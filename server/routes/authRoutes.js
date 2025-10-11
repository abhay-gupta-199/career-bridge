const express = require('express');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const College = require('../models/College');
const Owner = require('../models/Owner');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

// Student Registration
router.post('/register/student', async (req, res) => {
  try {
    const { name, email, password, skills, resume, college, graduationYear } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists with this email' });
    }

    // Create new student
    const student = new Student({
      name,
      email,
      password,
      skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
      resume,
      college,
      graduationYear
    });

    await student.save();

    const token = generateToken(student._id, 'student');
    res.status(201).json({
      message: 'Student registered successfully',
      token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: 'student'
      }
    });
  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// College Registration
router.post('/register/college', async (req, res) => {
  try {
    const { name, email, password, location, website, description, establishedYear } = req.body;

    // Check if college already exists
    const existingCollege = await College.findOne({ email });
    if (existingCollege) {
      return res.status(400).json({ message: 'College already exists with this email' });
    }

    // Create new college
    const college = new College({
      name,
      email,
      password,
      location,
      website,
      description,
      establishedYear
    });

    await college.save();

    const token = generateToken(college._id, 'college');
    res.status(201).json({
      message: 'College registered successfully',
      token,
      user: {
        id: college._id,
        name: college.name,
        email: college.email,
        role: 'college'
      }
    });
  } catch (error) {
    console.error('College registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Owner Registration
router.post('/register/owner', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if owner already exists
    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ message: 'Owner already exists with this email' });
    }

    // Create new owner
    const owner = new Owner({
      name,
      email,
      password
    });

    await owner.save();

    const token = generateToken(owner._id, 'owner');
    res.status(201).json({
      message: 'Owner registered successfully',
      token,
      user: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        role: 'owner'
      }
    });
  } catch (error) {
    console.error('Owner registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;
    let userRole;

    // Find user based on role
    switch (role) {
      case 'student':
        user = await Student.findOne({ email });
        userRole = 'student';
        break;
      case 'college':
        user = await College.findOne({ email });
        userRole = 'college';
        break;
      case 'owner':
        user = await Owner.findOne({ email });
        userRole = 'owner';
        break;
      default:
        return res.status(400).json({ message: 'Invalid role specified' });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, userRole);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: userRole
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
