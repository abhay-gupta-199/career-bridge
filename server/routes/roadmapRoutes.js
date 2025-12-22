const express = require('express')

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

module.exports = router
