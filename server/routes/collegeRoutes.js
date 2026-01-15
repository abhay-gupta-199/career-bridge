const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');
const College = require('../models/College');
const Student = require('../models/Student');
const Job = require('../models/Job');
const Notification = require('../models/Notification');
const { matchStudentsBatch, cleanSkillArray, computeMatchesForAllStudents } = require('../utils/matchingEngine');
const { sendEmail } = require('../utils/sendEmail');

const router = express.Router();

// Get college profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'college') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const college = await College.findById(req.user._id).select('-password');
    res.json(college);
  } catch (error) {
    console.error('Get college profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update college profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'college') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, location, website, description, establishedYear } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (location) updateData.location = location;
    if (website) updateData.website = website;
    if (description) updateData.description = description;
    if (establishedYear) updateData.establishedYear = establishedYear;

    const college = await College.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', college });
  } catch (error) {
    console.error('Update college profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get students from this college
router.get('/students', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'college') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const college = await College.findById(req.user._id);
    const students = await Student.find({ college: college.name })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get placement statistics
router.get('/statistics', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'college') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const college = await College.findById(req.user._id);
    const students = await Student.find({ college: college.name });

    const totalStudents = students.length;
    const placedStudents = students.filter(student => student.isPlaced).length;
    const unplacedStudents = totalStudents - placedStudents;

    // Skills distribution
    const skillsCount = {};
    students.forEach(student => {
      student.skills.forEach(skill => {
        skillsCount[skill] = (skillsCount[skill] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillsCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));

    // Graduation year distribution
    const yearDistribution = {};
    students.forEach(student => {
      if (student.graduationYear) {
        yearDistribution[student.graduationYear] = (yearDistribution[student.graduationYear] || 0) + 1;
      }
    });

    const yearData = Object.entries(yearDistribution)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => a.year - b.year);

    res.json({
      totalStudents,
      placedStudents,
      unplacedStudents,
      placementRate: totalStudents > 0 ? (placedStudents / totalStudents * 100).toFixed(2) : 0,
      topSkills,
      yearDistribution: yearData
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student placement status
router.put('/students/:studentId/placement', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'college') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { isPlaced, placedCompany } = req.body;
    
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.isPlaced = isPlaced;
    if (placedCompany) student.placedCompany = placedCompany;

    await student.save();

    // Update college statistics
    const college = await College.findById(req.user._id);
    const allStudents = await Student.find({ college: college.name });
    college.totalStudents = allStudents.length;
    college.placedStudents = allStudents.filter(s => s.isPlaced).length;
    await college.save();

    res.json({ message: 'Student placement status updated successfully' });
  } catch (error) {
    console.error('Update placement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * ========== COLLEGE JOB POSTING FEATURES ==========
 * Colleges can create and manage jobs for their students
 */

// Helper function for college job matching and notifications
const matchCollegeStudentsWithJobAndNotify = async (jobId, jdSkills, collegeId, threshold = 75) => {
  try {
    const job = await Job.findById(jobId).populate('postedByCollege', 'name');
    const college = await College.findById(collegeId);
    
    if (!job || !college) {
      console.error('❌ Job or College not found for matching');
      return { matched: 0, notified: 0, errors: [] };
    }

    // Fetch students from this college only
    const students = await Student.find({ college: college.name });
    console.log(`📊 Computing matches for ${students.length} students from ${college.name}`);

    if (!students || students.length === 0) {
      return { matched: 0, notified: 0, errors: ['No students found in this college'] };
    }

    // Compute matches
    const allMatches = await computeMatchesForAllStudents(students, jdSkills);

    // Persist matches on job
    job.matches = allMatches.map(m => ({
      student: m.studentId || null,
      matchPercentage: m.matchPercentage || 0,
      matchedSkills: Array.isArray(m.matchedSkills) ? m.matchedSkills : [],
      missingSkills: Array.isArray(m.missingSkills) ? m.missingSkills : [],
      method: m.method || 'unknown',
      calculatedAt: new Date()
    }));

    await job.save();

    // Filter for notifications
    const notifyList = allMatches.filter(m =>
      m && typeof m.matchPercentage === 'number' && m.matchPercentage >= threshold && m.studentId && m.studentEmail
    );

    console.log(`✅ ${notifyList.length} students meet the >=${threshold}% threshold`);

    // Create notifications with college reference
    const notifications = [];
    const emailPromises = [];

    for (const match of notifyList) {
      try {
        const notification = new Notification({
          student: match.studentId,
          college: collegeId,
          job: jobId,
          message: `New job opportunity from your college: ${job.title} at ${job.company} - ${match.matchPercentage}% skill match!`,
          matchPercentage: match.matchPercentage,
          matchedSkills: match.matchedSkills,
          unmatchedSkills: match.missingSkills,
          matchMethod: match.method,
          semanticScore: match.semanticScore || null,
          tfidfScore: match.tfidfScore || null,
          hybridScore: match.hybridScore || null,
          notifyTarget: 'college',
          type: 'job_match'
        });

        notifications.push(notification);

        const emailPromise = sendEmail(
          match.studentEmail,
          `🎯 New Job Match from ${college.name}: ${job.title} (${match.matchPercentage}%)`,
          `Hi ${match.studentName},\n\n` +
          `Great news! Your college has posted a job opportunity that matches your profile!\n\n` +
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
        console.error(`⚠️ Error creating notification:`, error.message);
      }
    }

    // Bulk insert notifications
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      console.log(`✅ Created ${notifications.length} college-specific notifications`);
    }

    if (emailPromises.length > 0) {
      await Promise.allSettled(emailPromises);
    }

    return {
      matched: allMatches.length,
      notified: notifications.length,
      errors: []
    };
  } catch (error) {
    console.error('❌ Error matching college students:', error);
    return { matched: 0, notified: 0, errors: [error.message] };
  }
};

// Get jobs created by this college
router.get('/jobs', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'college') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const jobs = await Job.find({ 
      postedByCollege: req.user._id,
      createdByType: 'college'
    })
      .populate('postedByCollege', 'name')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('Get college jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new job (College posting)
router.post('/jobs', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'college') {
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

    console.log(`📝 College creating job: ${title} at ${company}`);

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
          parsedSkills = Object.keys(mlResponse.data.jd_skill_weights || {}).filter(Boolean);
          console.log(`✅ Parsed ${parsedSkills.length} skills from JD`);
        }
      }
    } catch (mlError) {
      console.error('⚠️ ML API Error (JD parsing):', mlError.message);
    }

    // Combine manual skills and parsed skills
    const manualSkills = skillsRequired ? 
      skillsRequired.split(',').map(skill => skill && String(skill).trim()).filter(s => s) : [];

    const allSkills = cleanSkillArray([...manualSkills, ...parsedSkills]);

    console.log(`📌 Total skills required: ${allSkills.length}`);

    // Create job document with college reference
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
      postedBy: req.user._id, // College ID in postedBy field
      postedByCollege: req.user._id, // Explicit college reference
      createdByType: 'college'
    });

    await job.save();
    console.log(`✅ College job created with ID: ${job._id}`);

    // Trigger college-specific matching and notifications (75% threshold)
    const matchingPromise = matchCollegeStudentsWithJobAndNotify(job._id, allSkills, req.user._id, 75);

    const timeoutMs = 30000;
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ timedOut: true }), timeoutMs));

    const matchResult = await Promise.race([matchingPromise, timeoutPromise]);

    if (matchResult && matchResult.timedOut) {
      res.status(201).json({ 
        message: 'Job created successfully',
        job: {
          id: job._id,
          title: job.title,
          company: job.company,
          skillsRequired: job.skillsRequired
        },
        status: 'Job created. Notifying college students...',
        studentsNotified: 0
      });

      matchingPromise.then(result => {
        console.log(`📊 College matching complete for job ${job._id}: Matched ${result.matched}, Notified ${result.notified}`);
      }).catch(error => {
        console.error(`❌ College matching failed for job ${job._id}:`, error);
      });
    } else {
      const result = matchResult || { matched: 0, notified: 0, errors: [] };
      res.status(201).json({ 
        message: 'Job created and college students notified',
        job: {
          id: job._id,
          title: job.title,
          company: job.company,
          skillsRequired: job.skillsRequired
        },
        status: 'Notifications sent',
        collegeStudentsMatched: result.matched || 0,
        collegeStudentsNotified: result.notified || 0
      });
    }

  } catch (error) {
    console.error('Create college job error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get job applications for this college's jobs
router.get('/jobs/applications/:jobId', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'college') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const job = await Job.findById(req.params.jobId)
      .populate('postedByCollege', 'name')
      .populate('applications.student', 'name email college skills');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Verify this college created this job
    if (job.postedByCollege._id.toString() !== req.user._id.toString() || job.createdByType !== 'college') {
      return res.status(403).json({ message: 'You can only view applications for your jobs' });
    }

    res.json({
      jobId: job._id,
      jobTitle: job.title,
      company: job.company,
      totalApplications: job.applications.length,
      applications: job.applications
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status (College side)
router.put('/jobs/:jobId/applications/:appIndex', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'college') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status } = req.body;
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Verify ownership
    if (job.postedByCollege.toString() !== req.user._id.toString() || job.createdByType !== 'college') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const appIndex = parseInt(req.params.appIndex);
    if (appIndex >= 0 && appIndex < job.applications.length) {
      job.applications[appIndex].status = status;
      await job.save();
      res.json({ message: `Application status updated to ${status}` });
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notifications for this college (applications from their jobs, students from their college)
router.get('/notifications', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'college') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const college = await College.findById(req.user._id);
    
    // Get notifications for college-posted jobs AND college-specific job notifications
    const notifications = await Notification.find({
      $or: [
        { college: req.user._id },
        { notifyTarget: 'college' }
      ]
    })
      .populate('student', 'name email')
      .populate('job', 'title company')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    console.error('Get college notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
