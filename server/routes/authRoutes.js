const express = require('express');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const College = require('../models/College');
const Owner = require('../models/Owner');
const { sendEmail, generateOTP } = require('../utils/sendEmail');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper: generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

/* ==========================
   Password-based Registration
========================== */

// Student Registration
router.post('/register/student', async (req, res) => {
  try {
    const { name, email, password, skills, resume, college, graduationYear } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) return res.status(400).json({ message: 'Student already exists with this email' });

    // Store pending registration in session and send OTP
    req.session.pendingRegistration = {
      role: 'student',
      data: {
        name,
        email,
        password,
        skills: skills || '',
        resume: resume || '',
        college: college || '',
        graduationYear: graduationYear || ''
      }
    };

    const otp = generateOTP();
    req.session.otp = otp;
    req.session.email = email;
    req.session.role = 'student';

    const sent = await sendEmail(email, 'Your Career Bridge registration OTP', `Your registration OTP is: ${otp}. Expires in 10 minutes.`);
    if (!sent) {
      return res.json({ requiresOtp: true, message: 'OTP generated and logged to server (EMAIL not configured). Check server logs.' });
    }

    return res.json({ requiresOtp: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// College Registration
router.post('/register/college', async (req, res) => {
  try {
    const { name, email, password, location, website, description, establishedYear } = req.body;

    const existingCollege = await College.findOne({ email });
    if (existingCollege) return res.status(400).json({ message: 'College already exists with this email' });

    // Store pending registration in session and send OTP
    req.session.pendingRegistration = {
      role: 'college',
      data: {
        name,
        email,
        password,
        location: location || '',
        website: website || '',
        description: description || '',
        establishedYear: establishedYear || ''
      }
    };

    const otp = generateOTP();
    req.session.otp = otp;
    req.session.email = email;
    req.session.role = 'college';

    const sent = await sendEmail(email, 'Your Career Bridge registration OTP', `Your registration OTP is: ${otp}. Expires in 10 minutes.`);
    if (!sent) {
      return res.json({ requiresOtp: true, message: 'OTP generated and logged to server (EMAIL not configured). Check server logs.' });
    }

    return res.json({ requiresOtp: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error('College registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Owner Registration
router.post('/register/owner', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) return res.status(400).json({ message: 'Owner already exists with this email' });

    // Store pending registration in session and send OTP
    req.session.pendingRegistration = {
      role: 'owner',
      data: { name, email, password }
    };

    const otp = generateOTP();
    req.session.otp = otp;
    req.session.email = email;
    req.session.role = 'owner';

    const sent = await sendEmail(email, 'Your Career Bridge registration OTP', `Your registration OTP is: ${otp}. Expires in 10 minutes.`);
    if (!sent) {
      return res.json({ requiresOtp: true, message: 'OTP generated and logged to server (EMAIL not configured). Check server logs.' });
    }

    return res.json({ requiresOtp: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Owner registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

/* ==========================
       Password-based Login
========================== */

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;
    switch (role) {
      case 'student': user = await Student.findOne({ email }); break;
      case 'college': user = await College.findOne({ email }); break;
      case 'owner': user = await Owner.findOne({ email }); break;
      default: return res.status(400).json({ message: 'Invalid role specified' });
    }

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    // Always use OTP for login: generate an OTP, store in session and send email.
    const otp = generateOTP();
    req.session.otp = otp;
    req.session.email = email;
    req.session.role = role;

    const sent = await sendEmail(email, 'Your Career Bridge login OTP', `Your login OTP is: ${otp}. Expires in 10 minutes.`);

    if (!sent) {
      // In dev fallback mode sendEmail logs OTP to console — still allow OTP flow to proceed
      return res.json({ requiresOtp: true, message: 'OTP generated and logged to server (EMAIL not configured). Check server logs.' });
    }

    return res.json({ requiresOtp: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

/* ==========================
       OTP-based Authentication
========================== */

// Request OTP (signup/login)
router.post('/request-otp', async (req, res) => {
  const { email, role } = req.body;
  if (!email || !role) return res.status(400).json({ message: 'Email and role required' });

  // Check user model
  let UserModel;
  switch(role) {
    case 'student': UserModel = Student; break;
    case 'college': UserModel = College; break;
    case 'owner': UserModel = Owner; break;
    default: return res.status(400).json({ message: 'Invalid role' });
  }

  // Generate OTP
  const otp = generateOTP();
  req.session.otp = otp;
  req.session.email = email;
  req.session.role = role;

  // Send OTP email (best-effort)
  const sent = await sendEmail(email, 'Your OTP for Career Bridge', `Your OTP is: ${otp}. Expires in 10 minutes.`);

  if (!sent) {
    return res.json({ message: 'OTP generated and logged to server (EMAIL not configured). Check server logs.' });
  }

  res.json({ message: 'OTP sent to your email' });
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (email !== req.session.email || otp !== req.session.otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
  // If there is a pending registration in session, finalize it
  if (req.session.pendingRegistration) {
    const { role, data } = req.session.pendingRegistration;

    try {
      let createdUser;
      switch (role) {
        case 'student':
          createdUser = new Student({
            name: data.name,
            email: data.email,
            password: data.password,
            skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
            resume: data.resume,
            college: data.college,
            graduationYear: data.graduationYear
          });
          await createdUser.save();
          break;
        case 'college':
          createdUser = new College({
            name: data.name,
            email: data.email,
            password: data.password,
            location: data.location,
            website: data.website,
            description: data.description,
            establishedYear: data.establishedYear
          });
          await createdUser.save();
          break;
        case 'owner':
          createdUser = new Owner({ name: data.name, email: data.email, password: data.password });
          await createdUser.save();
          break;
        default:
          return res.status(400).json({ message: 'Invalid role' });
      }

      const token = generateToken(createdUser._id, role);

      // Clear pending registration and session values
      req.session.pendingRegistration = null;
      req.session.otp = null;
      const verifiedRole = role;
      req.session.destroy();

      return res.json({ message: 'Registration completed', token, user: { id: createdUser._id, email: createdUser.email, role: verifiedRole } });
    } catch (err) {
      console.error('Error finalizing registration:', err);
      return res.status(500).json({ message: 'Failed to finalize registration' });
    }
  }

  // Otherwise proceed with existing login/verify behavior (find or create user automatically)
  let UserModel;
  switch(req.session.role) {
    case 'student': UserModel = Student; break;
    case 'college': UserModel = College; break;
    case 'owner': UserModel = Owner; break;
    default: return res.status(400).json({ message: 'Invalid role' });
  }

  let user = await UserModel.findOne({ email });
  if (!user) {
    user = new UserModel({ email }); // add extra fields if needed
    await user.save();
  }

  // Capture role before destroying session
  const verifiedRole = req.session.role;

  // Generate JWT
  const token = generateToken(user._id, verifiedRole);

  // Clear session
  req.session.destroy();

  res.json({
    message: 'OTP verified successfully',
    token,
    user: { id: user._id, email: user.email, role: verifiedRole }
  });
});

module.exports = router;
