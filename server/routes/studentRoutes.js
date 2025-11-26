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
// ✅ Get student profile
// ========================
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'student') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const student = await Student.findById(req.user._id).select('-password')

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    // Calculate profile completion
    const totalFields = ['name', 'email', 'college', 'graduationYear', 'skills']
    let filledFields = totalFields.reduce((count, field) => {
      if (student[field] && student[field].length !== 0) count++
      return count
    }, 0)
    const profileCompletion = Math.floor((filledFields / totalFields.length) * 100)

    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      college: student.college || '',
      graduationYear: student.graduationYear || '',
      skills: student.skills || [],
      profilePic: student.profilePic || '',
      resume: student.resume || '',
      profileCompletion
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// ========================
// ✅ Update student profile
// ========================
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'student') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const { name, skills, resume, college, graduationYear } = req.body
    const updateData = {}

    if (name) updateData.name = name
    if (skills) updateData.skills = skills.split(',').map(s => s.trim())
    if (resume) updateData.resume = resume
    if (college) updateData.college = college
    if (graduationYear) updateData.graduationYear = graduationYear

    const student = await Student.findByIdAndUpdate(req.user._id, updateData, { new: true }).select('-password')

    res.json({
      message: 'Profile updated successfully',
      student
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// ========================
// ✅ Get available jobs
// ========================
router.get('/jobs', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'student') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const jobs = await Job.find({ isActive: true }).populate('postedBy', 'name').sort({ createdAt: -1 })
    res.json(jobs)
  } catch (error) {
    console.error('Get jobs error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// ========================
// ✅ Apply for a job
// ========================
router.post('/jobs/:jobId/apply', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'student') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const job = await Job.findById(req.params.jobId)
    if (!job) return res.status(404).json({ message: 'Job not found' })

    const alreadyApplied = job.applications.some(
      app => app.student.toString() === req.user._id.toString()
    )
    if (alreadyApplied) return res.status(400).json({ message: 'Already applied for this job' })

    job.applications.push({ student: req.user._id, status: 'Applied' })
    await job.save()

    res.json({ message: 'Application submitted successfully' })
  } catch (error) {
    console.error('Apply job error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// ========================
// ✅ Get student applications
// ========================
router.get('/applications', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'student') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const jobs = await Job.find({ 'applications.student': req.user._id }).populate('postedBy', 'name')

    const applications = jobs.map(job => {
      const application = job.applications.find(app => app.student.toString() === req.user._id.toString())
      return {
        job: {
          id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          jobType: job.jobType
        },
        status: application.status,
        appliedAt: application.appliedAt
      }
    })

    res.json(applications)
  } catch (error) {
    console.error('Get applications error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// ========================
// ✅ Student Dashboard Summary
// ========================
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'student') return res.status(403).json({ message: 'Access denied' })

    const student = await Student.findById(req.user._id).select('name skills')
    const jobs = await Job.find({ 'applications.student': req.user._id })

    const totalApplications = jobs.length
    const shortlisted = jobs.filter(job =>
      job.applications.some(app => app.student.toString() === req.user._id.toString() && app.status === 'Shortlisted')
    ).length
    const rejected = jobs.filter(job =>
      job.applications.some(app => app.student.toString() === req.user._id.toString() && app.status === 'Rejected')
    ).length

    res.json({
      name: student.name,
      skills: student.skills,
      profileCompletion: student.skills?.length ? 80 + student.skills.length * 2 : 70,
      totalApplications,
      shortlisted,
      rejected
    })
  } catch (error) {
    console.error('Dashboard summary error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// ========================
// ✅ Get Notifications
// ========================
router.get('/notifications', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'student') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const notifications = await Notification.find({ student: req.user._id })
      .populate('job', 'title company location')
      .sort({ createdAt: -1 })
      .limit(50)

    const unreadCount = await Notification.countDocuments({ 
      student: req.user._id, 
      isRead: false 
    })

    res.json({
      notifications,
      unreadCount
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// ========================
// ✅ Mark Notification as Read
// ========================
router.put('/notifications/:notificationId/read', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'student') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const notification = await Notification.findOne({
      _id: req.params.notificationId,
      student: req.user._id
    })

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    notification.isRead = true
    await notification.save()

    res.json({ message: 'Notification marked as read' })
  } catch (error) {
    console.error('Mark notification read error:', error)
    res.status(500).json({ message: 'Server error' })
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

    // Create FormData to send to ML API
    const formData = new FormData()
    formData.append('file', fs.createReadStream(filePath), {
      filename: fileName,
      contentType: req.file.mimetype
    })

    // Call ML API to parse resume
    let parsedSkills = []
    try {
      const mlResponse = await axios.post(`${ML_API_URL}/parse-resume`, formData, {
        headers: {
          ...formData.getHeaders()
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      })

      if (mlResponse.data.status === 'success' && mlResponse.data.resume_skills) {
        parsedSkills = mlResponse.data.resume_skills
      }
    } catch (mlError) {
      console.error('ML API Error:', mlError.message)
      // Continue even if ML API fails - we'll still save the resume
    }

    // Update student profile with resume and skills
    const student = await Student.findById(req.user._id)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    // Save resume path (relative to hybrid_roadmap/uploads)
    student.resume = `uploads/${fileName}`
    
    // Merge new skills with existing ones (avoid duplicates)
    const existingSkills = student.skills || []
    const newSkills = parsedSkills.filter(skill => !existingSkills.includes(skill))
    student.skills = [...existingSkills, ...newSkills]

    await student.save()

    res.json({
      message: 'Resume uploaded and parsed successfully',
      skills: parsedSkills,
      totalSkills: student.skills,
      resume: student.resume
    })
  } catch (error) {
    console.error('Upload resume error:', error)
    
    // Clean up uploaded file if error occurred
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }
    
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
})

module.exports = router
