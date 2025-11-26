const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');
const Owner = require('../models/Owner');
const Job = require('../models/Job');
const Student = require('../models/Student');
const College = require('../models/College');
const Notification = require('../models/Notification');

const router = express.Router();

// Helper function to match students with job using ML API and create notifications
const matchStudentsWithJob = async (jobId, jdSkills) => {
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      console.error('Job not found for matching');
      return 0;
    }

    const students = await Student.find({ skills: { $exists: true, $ne: [] } });
    const notifications = [];
    const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5002';
    
    for (const student of students) {
      try {
        // Call ML API to match skills directly
        const mlResponse = await axios.post(`${ML_API_URL}/match-skills`, {
          resume_skills: student.skills || [],
          jd_skills: jdSkills || []
        });

        let matchScore = 0;
        let matchPercentage = 0;

        if (mlResponse.data.status === 'success' && mlResponse.data.match_result) {
          const matchResult = mlResponse.data.match_result;
          // Use hybrid_score (0-1) converted to percentage
          matchScore = matchResult.hybrid_score || 0;
          matchPercentage = Math.round(matchScore * 100);
          
          // Also consider match_percentage as fallback
          if (matchPercentage === 0 && matchResult.match_percentage) {
            matchPercentage = Math.round(matchResult.match_percentage);
          }
        } else {
          // Fallback: simple percentage calculation
          if (jdSkills && jdSkills.length > 0 && student.skills && student.skills.length > 0) {
            const studentSet = new Set(student.skills.map(s => s.toLowerCase().trim()));
            const jdSet = new Set(jdSkills.map(s => s.toLowerCase().trim()));
            const matched = [...jdSet].filter(skill => studentSet.has(skill));
            matchPercentage = Math.round((matched.length / jdSet.size) * 100);
            matchScore = matchPercentage / 100;
          }
        }

        // Notify students with score >= 50%
        if (matchPercentage >= 50) {
          const notification = new Notification({
            student: student._id,
            job: jobId,
            message: `New job opportunity: ${job.title} at ${job.company} - ${matchPercentage}% skill match!`,
            matchPercentage: matchPercentage
          });
          notifications.push(notification);
        }
      } catch (matchError) {
        console.error(`Error matching student ${student._id}:`, matchError.message);
        // Fallback to simple matching
        if (jdSkills && jdSkills.length > 0 && student.skills && student.skills.length > 0) {
          const studentSet = new Set(student.skills.map(s => s.toLowerCase().trim()));
          const jdSet = new Set(jdSkills.map(s => s.toLowerCase().trim()));
          const matched = [...jdSet].filter(skill => studentSet.has(skill));
          const matchPercentage = Math.round((matched.length / jdSet.size) * 100);
          
          if (matchPercentage >= 50) {
            const notification = new Notification({
              student: student._id,
              job: jobId,
              message: `New job opportunity: ${job.title} at ${job.company} - ${matchPercentage}% skill match!`,
              matchPercentage: matchPercentage
            });
            notifications.push(notification);
          }
        }
      }
    }
    
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
    
    return notifications.length;
  } catch (error) {
    console.error('Error matching students with job:', error);
    return 0;
  }
};

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

    const limit = parseInt(req.query.limit, 10) || null;
    const query = Job.find()
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });

    const jobs = limit ? await query.limit(limit) : await query;

    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new job with JD parsing and student matching
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

    // Parse JD using ML API
    let parsedSkills = [];
    let requirements = description;
    
    try {
      const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5002';
      const jdText = description || '';
      
      if (jdText) {
        const mlResponse = await axios.post(`${ML_API_URL}/parse-jd`, {
          jd_text: jdText
        });
        
        if (mlResponse.data.status === 'success' && mlResponse.data.jd_skill_weights) {
          // Extract skills from skill weights (keys are skills)
          parsedSkills = Object.keys(mlResponse.data.jd_skill_weights);
          requirements = jdText;
        }
      }
    } catch (mlError) {
      console.error('ML API Error (JD parsing):', mlError.message);
      // Continue with manual skills if ML parsing fails
    }

    // Combine manual skills and parsed skills
    const allSkills = [
      ...(skillsRequired ? skillsRequired.split(',').map(skill => skill.trim()) : []),
      ...parsedSkills
    ].filter((skill, index, self) => self.indexOf(skill) === index); // Remove duplicates

    const job = new Job({
      title,
      company,
      description,
      skillsRequired: allSkills,
      parsedSkills: parsedSkills,
      requirements: requirements,
      location,
      salary,
      experience,
      jobType,
      postedBy: req.user._id
    });

    await job.save();

    // Match students with job and create notifications
    const matchedCount = await matchStudentsWithJob(job._id, allSkills);

    res.status(201).json({ 
      message: 'Job created successfully', 
      job,
      parsedSkillsCount: parsedSkills.length,
      studentsNotified: matchedCount
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
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

    const limit = parseInt(req.query.limit, 10) || null;
    const query = Student.find()
      .select('-password')
      .sort({ createdAt: -1 });

    const students = limit ? await query.limit(limit) : await query;

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

    const limit = parseInt(req.query.limit, 10) || null;
    const query = College.find()
      .select('-password')
      .sort({ createdAt: -1 });

    const colleges = limit ? await query.limit(limit) : await query;

    res.json(colleges);
  } catch (error) {
    console.error('Get all colleges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Skill insights (top skills among students)
router.get('/skill-insights', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const insights = await Student.aggregate([
      { $unwind: '$skills' },
      { $match: { skills: { $exists: true, $nin: ['', null] } } },
      {
        $group: {
          _id: { $toLower: '$skills' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const formatted = insights.map(item => ({
      skill: item._id,
      count: item.count
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Skill insights error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User growth (students per month)
router.get('/user-growth', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const growth = await Student.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          users: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 12 }
    ]);

    const formatted = growth.map(item => {
      const [year, month] = item._id.split('-').map(Number);
      const date = new Date(year, month - 1);
      const monthLabel = date.toLocaleString('en-US', { month: 'short' });
      return { month: `${monthLabel} ${year}`, users: item.users };
    });

    res.json(formatted);
  } catch (error) {
    console.error('User growth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
