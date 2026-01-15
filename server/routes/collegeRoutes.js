const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const College = require('../models/College');
const Student = require('../models/Student');
const Notification = require('../models/Notification');
const Job = require('../models/Job');
const { sendEmail } = require('../utils/sendEmail');
const { matchStudentsBatch } = require('../utils/matchingEngine');

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
      .sort(([, a], [, b]) => b - a)
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

    // Top Companies
    const companyCountMap = {};
    students.forEach(s => {
      if (s.isPlaced && s.placedCompany) {
        companyCountMap[s.placedCompany] = (companyCountMap[s.placedCompany] || 0) + 1;
      }
    });

    const topCompanies = Object.entries(companyCountMap)
      .map(([name, count]) => ({ name, placedStudents: count }))
      .sort((a, b) => b.placedStudents - a.placedStudents)
      .slice(0, 5);

    res.json({
      totalStudents,
      placedStudents,
      unplacedStudents,
      placementRate: totalStudents > 0 ? (placedStudents / totalStudents * 100).toFixed(2) : 0,
      topSkills,
      yearDistribution: yearData,
      topCompanies
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notifications (recent activities of students)
router.get('/notifications', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'college') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const college = await College.findById(req.user._id);
    // Find all students of this college
    const students = await Student.find({ college: college.name }).select('_id');
    const studentIds = students.map(s => s._id);

    // Find notifications for these students
    const notifications = await Notification.find({ student: { $in: studentIds } })
      .populate('student', 'name')
      .populate('job', 'title company')
      .sort({ createdAt: -1 })
      .limit(10);

    // Format notifications for the dashboard
    const formattedNotifications = notifications.map(note => {
      let message = '';
      let icon = '🔔';

      if (note.type === 'job_match') {
        message = `New job match for ${note.student.name}: ${note.job.title} at ${note.job.company}`;
        icon = '💼';
      } else if (note.type === 'application_status') {
        message = `Application update for ${note.student.name}: ${note.studentAction} for ${note.job.title}`;
        icon = '📝';
      } else {
        message = note.message;
      }

      return {
        _id: note._id,
        message,
        icon,
        createdAt: note.createdAt
      };
    });

    res.json(formattedNotifications);
  } catch (error) {
    console.error('Get notifications error:', error);
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

// Create a new job (posted by college)
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

    const newJob = new Job({
      title,
      company,
      description,
      skillsRequired,
      location,
      salary,
      experience,
      jobType,
      postedBy: req.user._id,
      onModel: 'College',
      isActive: true
    });

    await newJob.save();
    res.status(201).json({ message: 'Job posted successfully', job: newJob });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get jobs posted by this college
router.get('/jobs', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'college') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const jobs = await Job.find({ postedBy: req.user._id, onModel: 'College' })
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('Get college jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a job posted by this college
router.delete('/jobs/:id', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'college') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const job = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.user._id, onModel: 'College' });
    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Notify students about a job
router.post('/jobs/:id/notify', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'college') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const job = await Job.findOne({ _id: req.params.id, postedBy: req.user._id, onModel: 'College' });
    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    const college = await College.findById(req.user._id);
    const allStudents = await Student.find({ college: college.name });

    if (allStudents.length === 0) {
      return res.status(400).json({ message: 'No students found to notify' });
    }

    // Use the advanced matching engine (JD Parsing Logic)
    // We'll use a threshold of 50% for a "strong match" notification
    const matchingResults = await matchStudentsBatch(allStudents, job.skillsRequired, 50);

    if (matchingResults.successful.length === 0) {
      return res.status(200).json({
        message: 'No students met the 50% skill match threshold for this job.',
        skipped: matchingResults.skipped.length
      });
    }

    // Create in-app notifications with detailed match data
    const notifications = matchingResults.successful.map(result => ({
      student: result.studentId,
      job: job._id,
      message: `Skill Match (${result.matchPercentage}%)! Your college has recommended a job opportunity: ${job.title} at ${job.company}`,
      type: 'job_match',
      matchPercentage: result.matchPercentage,
      matchedSkills: result.matchedSkills,
      unmatchedSkills: result.unmatchedSkills,
      matchMethod: result.method,
      semanticScore: result.semanticScore,
      tfidfScore: result.tfidfScore,
      hybridScore: result.hybridScore
    }));

    await Notification.insertMany(notifications);

    // Send Emails asynchronously
    const emailPromises = matchingResults.successful.map(result => {
      const subject = `AI Matched Job: ${job.title} at ${job.company}`;
      const matchedText = result.matchedSkills.length > 0 ? `Matched Skills: ${result.matchedSkills.join(', ')}` : '';

      const text = `Hello ${result.studentName},

Our AI matching engine has identified a great job opportunity for you with a ${result.matchPercentage}% skill match!

Job: ${job.title}
Company: ${job.company}
Location: ${job.location}
Job Type: ${job.jobType}

${matchedText}

Description:
${job.description}

Log in to the Career Bridge portal to apply.

Good luck!
Career Bridge Team`;

      return sendEmail(result.studentEmail, subject, text);
    });

    await Promise.allSettled(emailPromises);

    res.json({
      message: `Intelligent notifications and emails sent to ${matchingResults.successful.length} matched students`,
      matchDetails: {
        notified: matchingResults.successful.length,
        belowThreshold: matchingResults.skipped.length,
        failed: matchingResults.failed.length
      }
    });
  } catch (error) {
    console.error('Notify students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
