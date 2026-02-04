const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const axios = require('axios')
const FormData = require('form-data')
const authMiddleware = require('../middleware/authMiddleware')
const Student = require('../models/Student')
const Job = require('../models/Job')
const Notification = require('../models/Notification')
// Add imports at top
const pdf = require('pdf-parse')
const mammoth = require('mammoth')
const { matchStudentWithJD, cleanSkillArray } = require('../utils/matchingEngine')
const { extractResumeSkills, extractJobSkills } = require('../utils/skillExtractor')

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../hybrid_roadmap/uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedTypes.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'))
    }
  }
})

// ========================
// ✅ Upload Resume and Parse Skills
// ========================
router.post('/upload-resume', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (req.userRole !== 'student') {
      return res.status(403).json({ message: 'Access denied' })
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5002'
    const filePath = req.file.path
    const fileName = req.file.filename
    const fileExt = path.extname(req.file.originalname).toLowerCase()

    // 1. Try ML API parsing
    let parsedSkills = []

    // Create FormData to send to ML API
    const formData = new FormData()
    formData.append('file', fs.createReadStream(filePath), {
      filename: fileName,
      contentType: req.file.mimetype
    })

    try {
      const mlResponse = await axios.post(`${ML_API_URL}/parse-resume`, formData, {
        headers: { ...formData.getHeaders() },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 10000 // 10s timeout
      })

      if (mlResponse.data.status === 'success' && mlResponse.data.resume_skills) {
        parsedSkills = mlResponse.data.resume_skills
        console.log(`✅ ML Parsed ${parsedSkills.length} skills`)
      }
    } catch (mlError) {
      console.warn('⚠️ ML API Error (Resume parsing):', mlError.message)
    }

    // 2. Perform Local Parsing (Fallback & Augmentation)
    let localSkills = []
    try {
      let fileText = ''

      if (fileExt === '.pdf') {
        const dataBuffer = fs.readFileSync(filePath)
        const data = await pdf(dataBuffer)
        fileText = data.text
      } else if (fileExt === '.docx') {
        const result = await mammoth.extractRawText({ path: filePath })
        fileText = result.value
      }

      if (fileText) {
        // Use our robust regex extractor
        const extractionResult = extractResumeSkills(fileText)
        localSkills = extractionResult.extractedSkills || []
        console.log(`✅ Local Parsed ${localSkills.length} skills`)
      }
    } catch (localError) {
      console.error('❌ Local parsing error:', localError.message)
    }

    // 3. Merge Skills (Dedup)
    const combinedSkills = [...new Set([...parsedSkills, ...localSkills])]
      .filter(s => s && typeof s === 'string' && s.length > 1) // basic filtering

    console.log(`✨ Total Unique Skills: ${combinedSkills.length}`)

    // Update student profile with resume and skills
    const student = await Student.findById(req.user._id)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    // Save resume path
    student.resume = `uploads/${fileName}`

    // Merge new skills with existing student skills
    const existingSkills = student.skills || []
    // Add unique new skills
    const finalSkills = [...new Set([...existingSkills, ...combinedSkills])]
    student.skills = finalSkills

    await student.save()

    res.json({
      message: 'Resume uploaded and parsed successfully',
      skills: combinedSkills, // Return the skills found in THIS resume
      totalSkills: student.skills,
      resume: student.resume
    })
  } catch (error) {
    console.error('Upload resume error:', error)

    // Clean up uploaded file if error occurred
    if (req.file && fs.existsSync(req.file.path)) {
      // Don't delete if we successfully saved it to student, but here we are in error block
      // Check if student was saved? tough to know. Safer to leave it or delete. 
      // The original code deleted it.
      try { fs.unlinkSync(req.file.path) } catch (e) { }
    }

    res.status(500).json({ message: 'Server error: ' + error.message })
  }
})

// ========================
// ✅ Get AI Recommendations
// ========================
router.get('/recommendations', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'student') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const student = await Student.findById(req.user._id).select('skills name email graduationYear college')

    if (!student || !student.skills || student.skills.length === 0) {
      return res.json({
        recommendations: [],
        message: 'Please add skills to your profile to get recommendations'
      })
    }

    // Fetch active jobs
    const jobs = await Job.find({ isActive: true })
      .populate('postedBy', 'name company')
      .sort({ createdAt: -1 })
      .limit(50)

    if (jobs.length === 0) {
      return res.json({
        recommendations: [],
        message: 'No jobs available at the moment'
      })
    }

    // Clean student skills
    const studentSkills = cleanSkillArray(student.skills)

    // Compute matches for all jobs
    const recommendedJobs = []
    for (const job of jobs) {
      try {
        // Re-extract skills on the fly to capture any improvements in extractor
        const extracted = extractJobSkills(job)
        const jobSkills = cleanSkillArray(extracted.combinedSkills)

        if (jobSkills.length === 0) continue

        const matchResult = await matchStudentWithJD(studentSkills, jobSkills)

        // Only include jobs with >= 50% match
        if (matchResult.match_percentage >= 50) {
          recommendedJobs.push({
            _id: job._id,
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description?.substring(0, 200) + '...',
            salary: job.salary,
            jobType: job.jobType,
            matchPercentage: matchResult.match_percentage,
            matchedSkills: matchResult.matched_skills,
            missingSkills: matchResult.missing_skills,
            matchMethod: matchResult.method,
            semanticScore: Math.round((matchResult.semantic_score || 0) * 100),
            tfidfScore: Math.round((matchResult.tfidf_score || 0) * 100),
            hybridScore: matchResult.hybrid_score,
            postedBy: job.postedBy?.name,
            createdAt: job.createdAt
          })
        }
      } catch (err) {
        console.error('Error matching job', job._id, ':', err.message)
        continue
      }
    }

    // Sort by match percentage (highest first)
    recommendedJobs.sort((a, b) => b.matchPercentage - a.matchPercentage)

    // Get top recommendations
    const topRecommendations = recommendedJobs.slice(0, 10)

    console.log(`Sending ${topRecommendations.length} recommendations with detailed scores`);

    res.json({
      success: true,
      totalRecommendations: recommendedJobs.length,
      recommendations: topRecommendations,
      studentSkills: studentSkills,
      summary: {
        averageMatch: Math.round(
          recommendedJobs.reduce((sum, job) => sum + job.matchPercentage, 0) /
          (recommendedJobs.length || 1)
        ),
        jobsAvailable: jobs.length,
        recommendedCount: topRecommendations.length
      }
    })
  } catch (error) {
    console.error('Recommendations error:', error)
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
})

// ========================
// ✅ Get Personalized Roadmap for Recommended Job
// ========================
router.post('/recommendations/:jobId/roadmap', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'student') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const { jobId } = req.params
    const student = await Student.findById(req.user._id).select('skills')
    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    const studentSkills = cleanSkillArray(student.skills || [])
    const jobSkills = cleanSkillArray(job.skillsRequired || job.parsedSkills || [])

    const matchResult = await matchStudentWithJD(studentSkills, jobSkills)
    const missingSkills = matchResult.missing_skills || []

    // Get roadmap from the main roadmap routes
    const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5002'

    try {
      const roadmapResponse = await axios.post(
        `${ML_API_URL}/generate-roadmap`,
        { skills: missingSkills },
        { timeout: 15000 }
      )

      res.json({
        success: true,
        jobTitle: job.title,
        company: job.company,
        matchPercentage: matchResult.match_percentage,
        missingSkills,
        roadmap: roadmapResponse.data.roadmap || {},
        recommendations: roadmapResponse.data.recommendations || {}
      })
    } catch (mlErr) {
      console.warn('ML API unavailable, using fallback roadmap')

      // Fallback: generate simple roadmap
      const fallbackRoadmap = {}
      missingSkills.forEach(skill => {
        fallbackRoadmap[skill] = {
          main_course: `${skill} for ${job.title}`,
          duration_weeks: 4,
          subtopics: [
            { title: `${skill} Basics`, project: 'Practice exercises' },
            { title: `${skill} Advanced`, project: 'Mini project' }
          ],
          final_projects: {
            suggested: [`Complete ${skill} project`],
            github_references: []
          }
        }
      })

      res.json({
        success: true,
        jobTitle: job.title,
        company: job.company,
        matchPercentage: matchResult.match_percentage,
        missingSkills,
        roadmap: fallbackRoadmap,
        recommendations: { roles: ['Focus on missing skills'] }
      })
    }
  } catch (error) {
    console.error('Roadmap error:', error)
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
})

// ========================
// ✅ Get All Jobs with Match Info
// ========================
router.get('/jobs', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select('skills')
    if (!student) return res.status(404).json({ message: 'Student not found' })

    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 })
    const studentSkills = cleanSkillArray(student.skills || [])

    const jobsWithMatch = []

    for (const job of jobs) {
      // Calculate match
      // Calculate match using fresh skill extraction
      const extracted = extractJobSkills(job)
      const jobSkills = cleanSkillArray(extracted.combinedSkills)
      let matchResult = { match_percentage: 0, matched_skills: [], missing_skills: [] }

      if (jobSkills.length > 0 && studentSkills.length > 0) {
        try {
          matchResult = await matchStudentWithJD(studentSkills, jobSkills)
        } catch (e) {
          // Fallback if matching fails
          console.error(`Matching failed for job ${job._id}`, e.message)
        }
      }

      jobsWithMatch.push({
        ...job.toObject(),
        studentMatch: {
          matchPercentage: matchResult.match_percentage || 0,
          matched_skills: matchResult.matched_skills || [],
          missing_skills: matchResult.missing_skills || [],
          semanticPercentage: Math.round((matchResult.semantic_score || 0) * 100),
          tfidfPercentage: Math.round((matchResult.tfidf_score || 0) * 100)
        }
      })
    }

    // Sort by match percentage desc
    jobsWithMatch.sort((a, b) => (b.studentMatch.matchPercentage - a.studentMatch.matchPercentage))

    res.json(jobsWithMatch)
  } catch (error) {
    console.error('Get jobs error:', error)
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
})

// ========================
// ✅ Apply for a Job
// ========================
router.post('/jobs/:jobId/apply', authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.params
    const studentId = req.user._id

    const job = await Job.findById(jobId)
    if (!job) return res.status(404).json({ message: 'Job not found' })

    // Check if already applied
    const alreadyApplied = job.applications.some(app => app.student.toString() === studentId.toString())
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job' })
    }

    // Add application
    job.applications.push({
      student: studentId,
      status: 'Applied',
      appliedAt: new Date()
    })

    await job.save()
    res.json({ message: 'Application submitted successfully' })
  } catch (error) {
    console.error('Apply job error:', error)
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
})

// ========================
// ✅ Get Student Applications
// ========================
router.get('/applications', authMiddleware, async (req, res) => {
  try {
    const studentId = req.user._id

    // Find jobs where this student has applied
    const jobs = await Job.find({ 'applications.student': studentId })
      .select('title company location jobType applications')
      .sort({ 'applications.appliedAt': -1 })

    // Map to simplified structure
    const applications = jobs.map(job => {
      const app = job.applications.find(a => a.student.toString() === studentId.toString())
      return {
        job: {
          id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          jobType: job.jobType
        },
        status: app ? app.status : 'Unknown',
        appliedAt: app ? app.appliedAt : null
      }
    })

    res.json(applications)
  } catch (error) {
    console.error('Get applications error:', error)
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
})

// ========================
// ✅ Get Student Profile
// ========================
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select('-password')
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }
    res.json(student)
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
})

// ========================
// ✅ Get Student Dashboard Stats
// ========================
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.user._id)
    if (!student) return res.status(404).json({ message: 'Student not found' })

    const applications = await Job.aggregate([
      { $unwind: '$applications' },
      { $match: { 'applications.student': student._id } }
    ])

    const totalApplications = applications.length
    const shortlisted = applications.filter(a => a.applications.status === 'Shortlisted' || a.applications.status === 'Accepted').length
    const rejected = applications.filter(a => a.applications.status === 'Rejected').length

    // Calculate profile completion
    let filledFields = 0
    const totalFields = 5 // name, email, skills, resume, college
    if (student.name) filledFields++
    if (student.email) filledFields++
    if (student.skills && student.skills.length > 0) filledFields++
    if (student.resume) filledFields++
    if (student.college) filledFields++

    const profileCompletion = Math.round((filledFields / totalFields) * 100)

    res.json({
      name: student.name,
      totalApplications,
      shortlisted,
      rejected,
      skills: student.skills || [],
      profileCompletion
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
})

// ========================
// ✅ Get Student Notifications
// ========================
router.get('/notifications', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
      userModel: 'Student'
    })
      .populate('job', 'title company location')
      .sort({ createdAt: -1 })
      .limit(20)

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      userModel: 'Student',
      isRead: false
    })

    res.json({
      notifications,
      unreadCount
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
})

module.exports = router
