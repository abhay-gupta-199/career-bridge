const express = require('express')
const path = require('path')
const fs = require('fs')
const axios = require('axios')
const authMiddleware = require('../middleware/authMiddleware')
const Job = require('../models/Job')
const Student = require('../models/Student')
const { matchStudentWithJD, cleanSkillArray } = require('../utils/matchingEngine')

const router = express.Router()

// Initialize Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBxe6-KWdK9Z30GYW7zfQ_s3z0pQUTEO1o'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

// Helper function to call Gemini API
async function generateRoadmapWithGemini(jobTitle, company, missingSkills, daysLeft, studentSkills) {
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
      GEMINI_API_URL,
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
        params: {
          key: GEMINI_API_KEY
        },
        headers: {
          'Content-Type': 'application/json'
        }
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

// Personalized roadmap for a specific job using Gemini
router.post('/generate-job-roadmap', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'student') return res.status(403).json({ message: 'Access denied' })

    const { jobId } = req.body
    if (!jobId) return res.status(400).json({ message: 'jobId is required' })

    const job = await Job.findById(jobId)
    if (!job) return res.status(404).json({ message: 'Job not found' })

    const student = await Student.findById(req.user._id)
    const resumeSkills = (student && Array.isArray(student.skills)) ? student.skills : []
    const jdSkills = (Array.isArray(job.parsedSkills) && job.parsedSkills.length > 0) 
      ? job.parsedSkills 
      : (Array.isArray(job.skillsRequired) ? job.skillsRequired : [])

    const matchResult = await matchStudentWithJD(resumeSkills, jdSkills)
    const missing = Array.isArray(matchResult.missing_skills) ? matchResult.missing_skills : []
    const normalizedMissing = cleanSkillArray(missing)

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

    // Generate roadmap using Gemini AI
    let roadmapContent
    try {
      roadmapContent = await generateRoadmapWithGemini(
        job.title,
        job.company,
        normalizedMissing,
        daysLeft,
        resumeSkills
      )
    } catch (geminiErr) {
      console.warn('Gemini API failed, using fallback:', geminiErr.message)
      // Fallback to simple roadmap
      roadmapContent = {
        overview: `Learn ${normalizedMissing.join(', ')} to qualify for ${job.title} role`,
        skillsToLearn: normalizedMissing.map(skill => ({
          name: skill,
          description: `Master ${skill} for the ${job.title} position`,
          estimatedDays: Math.max(1, Math.floor(daysLeft / Math.max(1, normalizedMissing.length))),
          difficulty: 'Intermediate',
          modules: [
            {
              title: `${skill} Fundamentals`,
              description: `Core concepts of ${skill}`,
              estimatedHours: 20,
              resources: [
                { type: 'course', title: `${skill} Masterclass`, url: `https://www.google.com/search?q=${skill}+tutorial` },
                { type: 'documentation', title: 'Official Docs', url: `https://www.google.com/search?q=${skill}+documentation` }
              ],
              project: { title: `Build with ${skill}`, description: `Create a project using ${skill}` }
            }
          ]
        }))
      }
    }

    const output = {
      job: { id: job._id, title: job.title, company: job.company, location: job.location },
      student: { id: student._id, name: student.name },
      days_left: daysLeft,
      missing_skills: normalizedMissing,
      roadmap: roadmapContent
    }

    res.json(output)
  } catch (err) {
    console.error('generate-job-roadmap error:', err)
    res.status(500).json({ message: 'Server error', details: err.message })
  }
})

module.exports = router
