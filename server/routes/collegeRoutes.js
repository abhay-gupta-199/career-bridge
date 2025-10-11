const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const College = require('../models/College');
const Student = require('../models/Student');

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

module.exports = router;
