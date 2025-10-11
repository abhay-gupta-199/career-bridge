const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Owner = require('../models/Owner');
const Job = require('../models/Job');
const Student = require('../models/Student');
const College = require('../models/College');

const router = express.Router();

// Get owner profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const owner = await Owner.findById(req.user._id).select('-password');
    res.json(owner);
  } catch (error) {
    console.error('Get owner profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard statistics
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const totalStudents = await Student.countDocuments();
    const totalColleges = await College.countDocuments();
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ isActive: true });

    res.json({
      totalStudents,
      totalColleges,
      totalJobs,
      activeJobs
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all jobs
router.get('/jobs', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const jobs = await Job.find()
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new job
router.post('/jobs', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      title,
      company,
      description,
      skillsRequired,
      location,
      salary,
      experience,
      jobType
    } = req.body;

    const job = new Job({
      title,
      company,
      description,
      skillsRequired: skillsRequired ? skillsRequired.split(',').map(skill => skill.trim()) : [],
      location,
      salary,
      experience,
      jobType,
      postedBy: req.user._id
    });

    await job.save();
    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update job
router.put('/jobs/:jobId', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const {
      title,
      company,
      description,
      skillsRequired,
      location,
      salary,
      experience,
      jobType,
      isActive
    } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (company) updateData.company = company;
    if (description) updateData.description = description;
    if (skillsRequired) updateData.skillsRequired = skillsRequired.split(',').map(skill => skill.trim());
    if (location) updateData.location = location;
    if (salary) updateData.salary = salary;
    if (experience) updateData.experience = experience;
    if (jobType) updateData.jobType = jobType;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.jobId,
      updateData,
      { new: true }
    );

    res.json({ message: 'Job updated successfully', job: updatedJob });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete job
router.delete('/jobs/:jobId', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await Job.findByIdAndDelete(req.params.jobId);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all students
router.get('/students', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const students = await Student.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all colleges
router.get('/colleges', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const colleges = await College.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(colleges);
  } catch (error) {
    console.error('Get all colleges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
