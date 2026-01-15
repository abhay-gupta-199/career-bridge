const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');
const Owner = require('../models/Owner');
const Job = require('../models/Job');
const Student = require('../models/Student');
const College = require('../models/College');
const Notification = require('../models/Notification');
const { matchStudentsBatch, cleanSkillArray, computeMatchesForAllStudents } = require('../utils/matchingEngine');
const { sendEmail } = require('../utils/sendEmail');

const router = express.Router();

/**
 * Enhanced Job Matching with Notifications
 * Matches all students against a new JD and sends notifications based on notifyTarget
 */
const matchStudentsWithJobAndNotify = async (jobId, jdSkills, threshold = 75, notifyTarget = 'student', collegeId = null) => {
  try {
    const job = await Job.findById(jobId).populate('postedBy', 'name company');
    if (!job) {
      console.error('❌ Job not found for matching');
      return { matched: 0, notified: 0, errors: [] };
    }

    // Determine which students to fetch based on notification target
    let students = [];
    if (notifyTarget === 'college' && collegeId) {
      // Get students from specific college
      const college = await College.findById(collegeId);
      if (!college) {
        return { matched: 0, notified: 0, errors: ['College not found'] };
      }
      students = await Student.find({ college: college.name });
      console.log(`📊 Computing matches for ${students.length} students from college ${college.name}`);
    } else {
      // Get all students
      students = await Student.find({});
      console.log(`📊 Computing matches for ${students.length} students (all)`);
    }

    if (!students || students.length === 0) {
      return { matched: 0, notified: 0, errors: ['No students found'] };
    }

    // Compute detailed matches for ALL students (regardless of threshold)
    const allMatches = await computeMatchesForAllStudents(students, jdSkills);

    // Persist per-student matches on the Job document for quick retrieval later
    try {
      job.matches = allMatches.map(m => ({
        student: m.studentId || null,
        matchPercentage: m.matchPercentage || 0,
        matchedSkills: Array.isArray(m.matchedSkills) ? m.matchedSkills : [],
        missingSkills: Array.isArray(m.missingSkills) ? m.missingSkills : [],
        method: m.method || 'unknown',
        calculatedAt: new Date()
      }));

      await job.save();
      console.log(`💾 Persisted ${job.matches.length} student match entries on job ${job._id}`);
    } catch (persistErr) {
      console.error('⚠️ Failed to persist job.matches:', persistErr.message);
      // continue without failing the entire matching process
    }

    // Filter out students to notify based on threshold and valid contact info
    const notifyList = allMatches.filter(m =>
      m && typeof m.matchPercentage === 'number' && m.matchPercentage >= threshold && m.studentId && m.studentEmail
    );

    console.log(`✅ ${notifyList.length} students meet the >=${threshold}% threshold for ${notifyTarget}`);

    // Create notifications and send emails for notifyList
    const notifications = [];
    const emailPromises = [];

    for (const match of notifyList) {
      try {
        const notification = new Notification({
          student: match.studentId,
          college: notifyTarget === 'college' ? collegeId : null,
          job: jobId,
          message: `New job opportunity: ${job.title} at ${job.company} - ${match.matchPercentage}% skill match!`,
          matchPercentage: match.matchPercentage,
          matchedSkills: match.matchedSkills,
          unmatchedSkills: match.missingSkills,
          matchMethod: match.method,
          semanticScore: match.semanticScore || null,
          tfidfScore: match.tfidfScore || null,
          hybridScore: match.hybridScore || null,
          notifyTarget: notifyTarget,
          type: 'job_match'
        });

        notifications.push(notification);

        const emailPromise = sendEmail(
          match.studentEmail,
          `🎯 New Job Match: ${job.title} (${match.matchPercentage}%)`,
          `Hi ${match.studentName},\n\n` +
          `Great news! We found a job opportunity that matches your profile!\n\n` +
          `Job Title: ${job.title}\nCompany: ${job.company}\nLocation: ${job.location || 'Not specified'}\n\n` +
          `Match Percentage: ${match.matchPercentage}%\n\n` +
          `Matched Skills: ${Array.isArray(match.matchedSkills) ? match.matchedSkills.slice(0, 10).join(', ') : ''}\n\n` +
          `Login to Career Bridge to view and apply for this job.\n\nBest regards,\nCareer Bridge Team`
        ).catch(err => {
          console.error(`⚠️ Failed to send email to ${match.studentEmail}:`, err.message);
          return false;
        });

        emailPromises.push(emailPromise);
      } catch (error) {
        console.error(`⚠️ Error creating notification for student ${match.studentId}:`, error.message);
      }
    }

    // Bulk insert notifications
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      console.log(`✅ Created ${notifications.length} notifications`);
    }

    if (emailPromises.length > 0) {
      await Promise.allSettled(emailPromises);
    }

    return {
      matched: allMatches.length,
      notified: notifications.length,
      errors: [] ,
      details: notifyList.map(m => ({ studentId: m.studentId, name: m.studentName, matchPercentage: m.matchPercentage }))
    };
  } catch (error) {
    console.error('❌ Error matching students with job:', error);
    return { matched: 0, notified: 0, errors: [error.message] };
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

/**
 * Create new job with JD parsing and automatic student matching
 * POST /api/owner/jobs
 * Body: { title, company, description, skillsRequired, location, salary, experience, jobType }
 */
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

    // Validate required fields
    if (!title || !company || !description) {
      return res.status(400).json({ message: 'Title, company, and description are required' });
    }

    console.log(`📝 Creating job: ${title} at ${company}`);

    // Parse JD using ML API
    let parsedSkills = [];
    
    try {
      const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5002';
      const jdText = description || '';
      
      if (jdText) {
        const mlResponse = await axios.post(`${ML_API_URL}/parse-jd`, {
          jd_text: jdText
        }, {
          timeout: 15000
        });
        
        if (mlResponse.data.status === 'success' && mlResponse.data.jd_skill_weights) {
            // Extract skills from skill weights (keys are skills)
            parsedSkills = Object.keys(mlResponse.data.jd_skill_weights || {}).filter(Boolean);
            console.log(`✅ Parsed ${parsedSkills.length} skills from JD`);
          }
      }
    } catch (mlError) {
      console.error('⚠️ ML API Error (JD parsing):', mlError.message);
      // Continue with manual skills if ML parsing fails
    }

    // Combine manual skills and parsed skills
    const manualSkills = skillsRequired ? 
      skillsRequired.split(',').map(skill => skill && String(skill).trim()).filter(s => s) : [];

    // Clean and normalize all skills to avoid undefined values
    const allSkills = cleanSkillArray([...manualSkills, ...parsedSkills]);

    console.log(`📌 Total skills required: ${allSkills.length}`);

    // Create job document
    const job = new Job({
      title,
      company,
      description,
      skillsRequired: allSkills,
      parsedSkills: parsedSkills,
      requirements: description,
      location,
      salary,
      experience,
      jobType,
      postedBy: req.user._id,
      createdByType: "owner"
    });

    await job.save();
    console.log(`✅ Job created with ID: ${job._id}`);

    // Trigger matching and notifications (notify threshold: 75%)
    const matchingPromise = matchStudentsWithJobAndNotify(job._id, allSkills, 75);

    // Wait up to 30s for matching to complete so we can return accurate counts to the client.
    // If matching takes longer, respond immediately and let background processing continue.
    const timeoutMs = 30000;
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ timedOut: true }), timeoutMs));

    const matchResult = await Promise.race([matchingPromise, timeoutPromise]);

    if (matchResult && matchResult.timedOut) {
      // Matching is still running — return immediate response and indicate background processing
      res.status(201).json({ 
        message: 'Job created successfully',
        job: {
          id: job._id,
          title: job.title,
          company: job.company,
          skillsRequired: job.skillsRequired,
          parsedSkillsCount: parsedSkills.length
        },
        status: 'Job created. Matching in background',
        studentsNotified: 0
      });

      // When matching completes later, it will still log to server
      matchingPromise.then(result => {
        console.log(`📊 Matching complete for job ${job._id}: Matched ${result.matched} students, Notified ${result.notified}`);
      }).catch(error => {
        console.error(`❌ Matching failed for job ${job._id}:`, error);
      });
    } else {
      // Matching finished within timeout — return real counts
      const result = matchResult || { matched: 0, notified: 0, errors: [] };
      res.status(201).json({ 
        message: 'Job created and matching completed',
        job: {
          id: job._id,
          title: job.title,
          company: job.company,
          skillsRequired: job.skillsRequired,
          parsedSkillsCount: parsedSkills.length
        },
        status: 'Matching complete',
        studentsMatched: result.matched || 0,
        studentsNotified: result.notified || 0,
        errors: result.errors || []
      });
    }

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
    
    // Also delete associated notifications
    await Notification.deleteMany({ job: req.params.jobId });

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

    const colleges = limit ? await query.limit(limit) : await colleges;

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

/**
 * Get detailed student profile with applications and skills
 * GET /owner/students/:studentId/details
 */
router.get('/students/:studentId/details', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const student = await Student.findById(req.params.studentId)
      .select('-password')
      .lean();

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get all applications for this student
    const applications = await Job.find(
      { 'applications.student': student._id },
      {
        title: 1,
        company: 1,
        location: 1,
        'applications.$': 1,
        createdAt: 1
      }
    ).lean();

    // Format applications with job details
    const appliedJobs = applications.map(job => ({
      jobId: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      appliedAt: job.applications[0]?.appliedAt,
      status: job.applications[0]?.status || 'Applied',
      postedAt: job.createdAt
    }));

    // Get match data for all jobs student was matched for
    const jobMatches = await Job.find({
      'matches.student': student._id
    }, {
      title: 1,
      company: 1,
      location: 1,
      'matches.$': 1,
      skillsRequired: 1
    }).lean();

    // Format match data
    const matchedJobs = jobMatches.map(job => {
      const match = job.matches.find(m => m.student?.toString() === student._id.toString());
      return {
        jobId: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        matchPercentage: match?.matchPercentage || 0,
        matchedSkills: match?.matchedSkills || [],
        missingSkills: match?.missingSkills || [],
        requiredSkills: job.skillsRequired || []
      };
    });

    const profileData = {
      _id: student._id,
      name: student.name,
      email: student.email,
      college: student.college,
      graduationYear: student.graduationYear,
      skills: student.skills || [],
      resume: student.resume,
      isPlaced: student.isPlaced,
      placedCompany: student.placedCompany,
      isBlocked: student.isBlocked,
      blockedAt: student.blockedAt,
      blockReason: student.blockReason,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
      applications: appliedJobs,
      matches: matchedJobs,
      applicationStats: {
        total: appliedJobs.length,
        applied: appliedJobs.filter(a => a.status === 'Applied').length,
        shortlisted: appliedJobs.filter(a => a.status === 'Accepted').length,
        rejected: appliedJobs.filter(a => a.status === 'Rejected').length
      },
      matchStats: {
        totalMatched: matchedJobs.length,
        highMatch: matchedJobs.filter(m => m.matchPercentage >= 75).length,
        mediumMatch: matchedJobs.filter(m => m.matchPercentage >= 50 && m.matchPercentage < 75).length,
        lowMatch: matchedJobs.filter(m => m.matchPercentage < 50).length
      }
    };

    res.json(profileData);
  } catch (error) {
    console.error('Get student details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * Block/Unblock a student
 * POST /owner/students/:studentId/toggle-block
 */
router.post('/students/:studentId/toggle-block', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { isBlocking, reason } = req.body;

    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (isBlocking) {
      student.isBlocked = true;
      student.blockedAt = new Date();
      student.blockReason = reason || 'Blocked by administrator';
    } else {
      student.isBlocked = false;
      student.blockedAt = null;
      student.blockReason = null;
    }

    await student.save();

    res.json({
      message: isBlocking ? 'Student blocked successfully' : 'Student unblocked successfully',
      student: {
        _id: student._id,
        name: student.name,
        isBlocked: student.isBlocked,
        blockedAt: student.blockedAt,
        blockReason: student.blockReason
      }
    });
  } catch (error) {
    console.error('Toggle block error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Export students data as CSV
 * GET /owner/students/export/csv
 */
router.get('/students-export/csv', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const students = await Student.find()
      .select('-password')
      .lean();

    // Fetch applications for each student
    const studentsWithData = await Promise.all(
      students.map(async (student) => {
        const applications = await Job.find(
          { 'applications.student': student._id },
          { title: 1, company: 1, 'applications.$': 1 }
        ).lean();

        return {
          ...student,
          applicationsCount: applications.length,
          appliedCompanies: applications.map(j => j.company).join('; ')
        };
      })
    );

    // Convert to CSV format
    const csvHeaders = [
      'Student ID',
      'Name',
      'Email',
      'College',
      'Graduation Year',
      'Skills',
      'Applied Jobs',
      'Companies Applied To',
      'Status',
      'Placed Company',
      'Is Blocked',
      'Created Date'
    ];

    const csvRows = studentsWithData.map(student => [
      student._id.toString(),
      student.name,
      student.email,
      student.college || 'N/A',
      student.graduationYear || 'N/A',
      (student.skills || []).join('; '),
      student.applicationsCount,
      student.appliedCompanies,
      student.isPlaced ? 'Placed' : 'Unplaced',
      student.placedCompany || 'N/A',
      student.isBlocked ? 'Yes' : 'No',
      new Date(student.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=students-export.csv');
    res.send(csvContent);
  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
