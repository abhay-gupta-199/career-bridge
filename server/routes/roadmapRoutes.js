const express = require('express')
const path = require('path')
const fs = require('fs')
const authMiddleware = require('../middleware/authMiddleware')
const Job = require('../models/Job')
const Student = require('../models/Student')
const { matchStudentWithJD, cleanSkillArray } = require('../utils/matchingEngine')

const router = express.Router()

// Simple hard-coded roadmap generator for demo / fallback
router.post('/generate-roadmap', (req, res) => {
  const skills = Array.isArray(req.body.skills) ? req.body.skills : []

  // Normalize input
  const normalized = skills.map(s => s.trim()).filter(Boolean)

  const templates = {
    Python: {
      main_course: 'Python for Developers',
      duration_weeks: 6,
      subtopics: [
        { title: 'Core Python & Data Structures', project: 'CLI todo app', youtube_links: ['https://youtu.be/rfscVS0vtbw'] },
        { title: 'Web with Flask/Django', project: 'Simple blog app', youtube_links: ['https://youtu.be/Z1RJmh_OqeA'] },
        { title: 'Data Manipulation & APIs', project: 'Data ETL script', youtube_links: ['https://youtu.be/GPVsHOlRBBI'] }
      ],
      final_projects: { suggested: ['Personal API', 'Data analysis mini-project'], github_references: ['https://github.com/tiangolo/fastapi'] }
    },
    SQL: {
      main_course: 'SQL & Databases',
      duration_weeks: 4,
      subtopics: [
        { title: 'Basics & Joins', project: 'Design a small schema', youtube_links: ['https://youtu.be/7S_tz1z_5bA'] },
        { title: 'Indexes & Performance', project: 'Optimize queries', youtube_links: ['https://youtu.be/5hzZtqCNQKk'] }
      ],
      final_projects: { suggested: ['Analytics dashboard'], github_references: [] }
    },
    React: {
      main_course: 'React Fundamentals',
      duration_weeks: 6,
      subtopics: [
        { title: 'Components & Props', project: 'Todo app', youtube_links: ['https://youtu.be/Ke90Tje7VS0'] },
        { title: 'State & Hooks', project: 'Notes app', youtube_links: ['https://youtu.be/dpw9EHDh2bM'] }
      ],
      final_projects: { suggested: ['Full-stack MERN app'], github_references: ['https://github.com/facebook/react'] }
    }
  }

  const roadmap = {}
  normalized.forEach(raw => {
    const key = raw.charAt(0).toUpperCase() + raw.slice(1)
    roadmap[key] = templates[key] || {
      main_course: `${key} Fundamentals`,
      duration_weeks: 4,
      subtopics: [{ title: 'Basics', project: 'Practice exercises', youtube_links: [] }],
      final_projects: { suggested: ['Capstone mini-project'], github_references: [] }
    }
  })

  // Also return simple role recommendations
  const roles = new Set()
  if (normalized.some(s => /python/i.test(s) || /sql/i.test(s))) roles.add('Data Engineer / Analyst')
  if (normalized.some(s => /react/i.test(s) || /frontend/i.test(s))) roles.add('Frontend Developer')

  res.json({ roadmap, recommendations: { roles: Array.from(roles) } })
})

// Personalized roadmap for a specific job (student-only)
router.post('/generate-job-roadmap', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'student') return res.status(403).json({ message: 'Access denied' })

    const { jobId } = req.body
    if (!jobId) return res.status(400).json({ message: 'jobId is required' })

    const job = await Job.findById(jobId)
    if (!job) return res.status(404).json({ message: 'Job not found' })

    const student = await Student.findById(req.user._id)
    const resumeSkills = (student && Array.isArray(student.skills)) ? student.skills : []

    const jdSkills = (Array.isArray(job.parsedSkills) && job.parsedSkills.length>0) ? job.parsedSkills : (Array.isArray(job.skillsRequired)?job.skillsRequired:[])

    const matchResult = await matchStudentWithJD(resumeSkills, jdSkills)
    const missing = Array.isArray(matchResult.missing_skills) ? matchResult.missing_skills : []
    const normalizedMissing = cleanSkillArray(missing)

    // determine days left
    let daysLeft = 14
    if (job.applicationDeadline) {
      const dl = new Date(job.applicationDeadline)
      const diff = Math.ceil((dl - new Date())/(1000*60*60*24))
      if (!isNaN(diff) && diff>0) daysLeft = diff
    } else if (job.interviewDate) {
      const dl = new Date(job.interviewDate)
      const diff = Math.ceil((dl - new Date())/(1000*60*60*24))
      if (!isNaN(diff) && diff>0) daysLeft = diff
    } else if (job.createdAt) {
      const created = new Date(job.createdAt)
      const window = 30
      const deadline = new Date(created.getTime() + window*24*60*60*1000)
      const diff = Math.ceil((deadline - new Date())/(1000*60*60*24))
      if (!isNaN(diff) && diff>0) daysLeft = diff
    }

    const personal = {}
    const perSkillDays = Math.max(1, Math.floor(daysLeft / Math.max(1, normalizedMissing.length || 1)))

    normalizedMissing.forEach(skill => {
      const title = skill.charAt(0).toUpperCase() + skill.slice(1)
      const subtopics = [
        {
          title: `${title} Basics`,
          project: `Small practice exercises for ${title}`,
          youtube_links: [`https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' tutorial')}`],
          docs: [`https://www.google.com/search?q=${encodeURIComponent(title + ' documentation')}`],
          github: [`https://github.com/search?q=${encodeURIComponent(title + '+project')}`],
          estimated_days: Math.max(1, Math.floor(perSkillDays * 0.4))
        },
        {
          title: `${title} Applied Practice`,
          project: `Mini project using ${title}`,
          youtube_links: [`https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' project tutorial')}`],
          docs: [`https://www.google.com/search?q=${encodeURIComponent(title + ' tutorial')}`],
          github: [`https://github.com/search?q=${encodeURIComponent(title + '+example')}`],
          estimated_days: Math.max(1, Math.floor(perSkillDays * 0.4))
        },
        {
          title: `${title} Interview Questions & Mock`,
          project: `Top interview questions for ${title}`,
          youtube_links: [`https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' interview questions')}`],
          docs: [`https://www.google.com/search?q=${encodeURIComponent(title + ' interview questions')}`],
          github: [`https://github.com/search?q=${encodeURIComponent(title + '+interview')}`],
          estimated_days: Math.max(1, perSkillDays - Math.floor(perSkillDays*0.8))
        }
      ]

      personal[title] = {
        main_course: `${title} Focus`,
        duration_days: perSkillDays,
        subtopics,
        final_projects: {
          suggested: [`Capstone mini-project using ${title}`],
          github_references: [`https://github.com/search?q=${encodeURIComponent(title + ' project')}`]
        }
      }
    })

    const output = {
      job: { id: job._id, title: job.title, company: job.company },
      student: { id: student._id, name: student.name },
      days_left: daysLeft,
      missing_skills: normalizedMissing,
      roadmap: personal
    }

    try {
      const outDir = path.join(__dirname, '../../hybrid_roadmap/output')
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
      const fileName = `${Date.now()}_job_${job._id}_roadmap.json`
      const filePath = path.join(outDir, fileName)
      fs.writeFileSync(filePath, JSON.stringify(output, null, 2), { encoding: 'utf-8' })
      return res.json({ ...output, saved: fileName })
    } catch (err) {
      console.error('Failed to save personal roadmap:', err)
      return res.status(500).json({ error: 'Failed to save personal roadmap', details: err.message })
    }

  } catch (err) {
    console.error('generate-job-roadmap error:', err)
    return res.status(500).json({ message: 'Server error', details: err.message })
  }
})

module.exports = router

