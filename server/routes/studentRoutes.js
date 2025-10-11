const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Student = require('../models/Student');
const Job = require('../models/Job');

const router = express.Router();

// Get student profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const student = await Student.findById(req.user._id).select('-password');
    res.json(student);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, skills, resume, college, graduationYear } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (skills) updateData.skills = skills.split(',').map(skill => skill.trim());
    if (resume) updateData.resume = resume;
    if (college) updateData.college = college;
    if (graduationYear) updateData.graduationYear = graduationYear;

    const student = await Student.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', student });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available jobs
router.get('/jobs', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const jobs = await Job.find({ isActive: true })
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply for a job
router.post('/jobs/:jobId/apply', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const alreadyApplied = job.applications.some(
      app => app.student.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    job.applications.push({
      student: req.user._id,
      status: 'Applied'
    });

    await job.save();
    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Apply job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student's job applications
router.get('/applications', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const jobs = await Job.find({
      'applications.student': req.user._id
    }).populate('postedBy', 'name');

    const applications = jobs.map(job => {
      const application = job.applications.find(
        app => app.student.toString() === req.user._id.toString()
      );
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
      };
    });

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
