const express = require('express')
const path = require('path')
const fs = require('fs')
const axios = require('axios')
const authMiddleware = require('../middleware/authMiddleware')
const Job = require('../models/Job')
const Student = require('../models/Student')
const { matchStudentWithJD, cleanSkillArray } = require('../utils/matchingEngine')

const router = express.Router()

// Initialize Gemini API - use the correct model
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent'

// Helper function to call Gemini API
async function generateRoadmapWithGemini(jobTitle, company, missingSkills, daysLeft, studentSkills) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set')
  }

  try {
    const prompt = `You are an expert career coach and learning path designer. Create a detailed, personalized learning roadmap in JSON format.

Job Title: ${jobTitle}
Company: ${company}
Days Available: ${daysLeft}
Student's Current Skills: ${studentSkills.join(', ') || 'None specified'}
Missing Skills to Learn: ${missingSkills.join(', ')}

Generate a comprehensive JSON roadmap with the following structure:
{
  "overview": "Brief overview of the learning journey",
  "totalDuration": "Total estimated time",
  "skillsToLearn": [
    {
      "name": "Skill name",
      "description": "Why this skill matters for the role",
      "estimatedDays": 7,
      "difficulty": "Beginner|Intermediate|Advanced",
      "modules": [
        {
          "title": "Module title",
          "description": "What you'll learn",
          "estimatedHours": 20,
          "topics": ["topic1", "topic2"],
          "resources": [
            {
              "type": "tutorial|documentation|course|video",
              "title": "Resource title",
              "url": "Suggested URL or search query",
              "duration": "Duration if applicable"
            }
          ],
          "project": {
            "title": "Mini project name",
            "description": "What you'll build",
            "difficulty": "Easy|Medium|Hard"
          }
        }
      ]
    }
  ],
  "capstoneProject": {
    "title": "Final project name",
    "description": "Comprehensive project using all learned skills",
    "estimatedDays": 3,
    "deliverables": ["component1", "component2"]
  },
  "timeline": "Week-by-week breakdown",
  "tips": ["Practical tips for success"],
  "resources": ["Key external resources"]
}

Make it practical, detailed, and achievable in ${daysLeft} days. Focus on industry-standard resources and real-world applications.`

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    )

    // Extract JSON from response
    const textContent = response.data.candidates[0].content.parts[0].text
    const jsonMatch = textContent.match(/\{[\s\S]*\}/)

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return JSON.parse(textContent)
  } catch (err) {
    console.error('Gemini API error:', err.message)
    throw err
  }
}

const { buildPersonalizedJobRoadmap } = require('../utils/personalizedRoadmap');

// Personalized roadmap for a specific job using Gemini (Node.js native implementation)
router.post('/generate-job-roadmap', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'student') return res.status(403).json({ message: 'Access denied' })

    const { jobId } = req.body
    if (!jobId) return res.status(400).json({ message: 'jobId is required' })

    const job = await Job.findById(jobId)
    if (!job) return res.status(404).json({ message: 'Job not found' })

    const student = await Student.findById(req.user._id)
    const resumeSkills = (student && Array.isArray(student.skills)) ? student.skills : []

    // Get JD Skills (parsed or manual)
    const jdSkills = (Array.isArray(job.parsedSkills) && job.parsedSkills.length > 0)
      ? job.parsedSkills
      : (Array.isArray(job.skillsRequired) ? job.skillsRequired : [])

    if (jdSkills.length === 0) {
      // Fallback if no skills are defined in the job
      return res.status(400).json({ message: 'Job has no skill requirements defined to generate a roadmap.' })
    }

    // Calculate days left
    let daysLeft = 14
    if (job.applicationDeadline) {
      const dl = new Date(job.applicationDeadline)
      const diff = Math.ceil((dl - new Date()) / (1000 * 60 * 60 * 24))
      if (!isNaN(diff) && diff > 0) daysLeft = diff
    } else if (job.interviewDate) {
      const dl = new Date(job.interviewDate)
      const diff = Math.ceil((dl - new Date()) / (1000 * 60 * 60 * 24))
      if (!isNaN(diff) && diff > 0) daysLeft = diff
    }

    console.log(`Generating roadmap for job: ${job.title}, missing skills logic executing...`);

    // Use the new utility to generate the roadmap
    const result = await buildPersonalizedJobRoadmap({
      resumeSkills,
      jdSkills,
      jdSkillWeights: job.skillWeights || {}, // Assuming skillWeights might exist or default to empty
      deadline: daysLeft,
      daysFallback: 30
    });

    if (result.status === 'success') {
      res.json(result.roadmap); // frontend expects the roadmap object directly
    } else {
      res.status(500).json({ message: 'Failed to generate roadmap' });
    }

  } catch (err) {
    console.error('generate-job-roadmap error:', err)
    res.status(500).json({ message: 'Server error', details: err.message })
  }
})

/**
 * NEW: AI-Powered Personalized Job Roadmap with Advanced Scheduling
 * POST /api/personalized-job-roadmap
 * Uses Python ML service for intelligent skill ranking and time distribution
 */
router.post('/personalized-job-roadmap', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'student') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const { jobId } = req.body
    if (!jobId) {
      return res.status(400).json({ message: 'jobId is required' })
    }

    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    const student = await Student.findById(req.user._id)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    const resumeSkills = (student && Array.isArray(student.skills)) ? student.skills : []
    const jdSkills = (Array.isArray(job.parsedSkills) && job.parsedSkills.length > 0)
      ? job.parsedSkills
      : (Array.isArray(job.skillsRequired) ? job.skillsRequired : [])

    if (jdSkills.length === 0) {
      return res.status(400).json({ message: 'Job has no skill requirements defined' })
    }

    // Calculate deadline in days
    let daysLeft = 30
    if (job.applicationDeadline) {
      const dl = new Date(job.applicationDeadline)
      const diff = Math.ceil((dl - new Date()) / (1000 * 60 * 60 * 24))
      if (!isNaN(diff) && diff > 0) daysLeft = diff
    } else if (job.interviewDate) {
      const dl = new Date(job.interviewDate)
      const diff = Math.ceil((dl - new Date()) / (1000 * 60 * 60 * 24))
      if (!isNaN(diff) && diff > 0) daysLeft = diff
    }

    console.log(`📚 Generating personalized roadmap`)
    console.log(`   Job: ${job.title} at ${job.company}`)
    console.log(`   Resume skills: ${resumeSkills.join(', ') || 'None'}`)
    console.log(`   JD skills: ${jdSkills.join(', ')}`)
    console.log(`   Days available: ${daysLeft}`)

    // Call ML API for advanced roadmap generation
    const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5002'

    let roadmapData = null
    try {
      const mlResponse = await axios.post(
        `${ML_API_URL}/api/personalized-job-roadmap`,
        {
          resume_skills: resumeSkills,
          jd_skills: jdSkills,
          jd_skill_weights: {},
          deadline: daysLeft,
          job_title: job.title,
          company: job.company
        },
        { timeout: 30000 }
      )

      if (mlResponse.data.status === 'success' && mlResponse.data.roadmap) {
        roadmapData = mlResponse.data.roadmap
        console.log(`✅ Generated personalized roadmap with ${roadmapData.skill_roadmaps?.length || 0} skills`)
      }
    } catch (mlError) {
      console.error('⚠️ ML API error:', mlError.message)
      console.error('Falling back to Gemini generation')
    }

    // Fallback: Use Gemini if ML API fails
    if (!roadmapData) {
      try {
        const matchResult = await matchStudentWithJD(resumeSkills, jdSkills)
        const missing = Array.isArray(matchResult.missing_skills) ? matchResult.missing_skills : []
        const normalizedMissing = cleanSkillArray(missing)

        roadmapData = await generateRoadmapWithGemini(
          job.title,
          job.company,
          normalizedMissing,
          daysLeft,
          resumeSkills
        )
      } catch (fallbackErr) {
        console.error('⚠️ Fallback generation failed:', fallbackErr.message)
        // Last resort: simple roadmap
        const matchResult = await matchStudentWithJD(resumeSkills, jdSkills)
        const missing = Array.isArray(matchResult.missing_skills) ? matchResult.missing_skills : []

        roadmapData = {
          analysis: matchResult,
          skill_roadmaps: missing.slice(0, 3).map(skill => ({
            skill,
            estimated_days: Math.max(3, Math.floor(daysLeft / Math.max(1, missing.length))),
            subtopics: [
              { title: `${skill} Fundamentals`, estimated_days: 2 },
              { title: `${skill} Practice`, estimated_days: 2 },
              { title: `${skill} Projects`, estimated_days: 1 }
            ]
          }))
        }
      }
    }

    const output = {
      job: {
        id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        applicationDeadline: job.applicationDeadline,
        daysRemaining: daysLeft
      },
      student: {
        id: student._id,
        name: student.name,
        currentSkills: resumeSkills
      },
      roadmap: roadmapData
    }

    res.json(output)

  } catch (err) {
    console.error('❌ Personalized roadmap error:', err)
    res.status(500).json({
      message: 'Failed to generate personalized roadmap',
      error: err.message
    })
  }
})

module.exports = router
