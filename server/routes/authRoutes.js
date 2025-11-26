const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const College = require('../models/College');
const Owner = require('../models/Owner');
const { sendEmail, generateOTP } = require('../utils/sendEmail');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Configure multer for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../hybrid_roadmap/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  }
});

// Helper: generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

/* ==========================
   Password-based Registration
========================== */

// Student Registration with Resume Upload
router.post('/register/student', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, password, skills, college, graduationYear } = req.body;
    const resumeFile = req.file;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      // Clean up uploaded file if student exists
      if (resumeFile && fs.existsSync(resumeFile.path)) {
        fs.unlinkSync(resumeFile.path);
      }
      return res.status(400).json({ message: 'Student already exists with this email' });
    }

    // Parse resume if file uploaded
    let parsedSkills = [];
    let resumePath = '';
    
    if (resumeFile) {
      resumePath = `uploads/${resumeFile.filename}`;
      
      try {
        const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5002';
        const formData = new FormData();
        formData.append('file', fs.createReadStream(resumeFile.path), {
          filename: resumeFile.filename,
          contentType: resumeFile.mimetype
        });

        const mlResponse = await axios.post(`${ML_API_URL}/parse-resume`, formData, {
          headers: {
            ...formData.getHeaders()
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        });

        if (mlResponse.data.status === 'success' && mlResponse.data.resume_skills) {
          parsedSkills = mlResponse.data.resume_skills;
        }
      } catch (mlError) {
        console.error('ML API Error (resume parsing):', mlError.message);
        // Continue even if ML parsing fails
      }
    }

    // Combine manual skills and parsed skills
    const manualSkills = skills ? skills.split(',').map(s => s.trim()).filter(s => s) : [];
    const allSkills = [...new Set([...manualSkills, ...parsedSkills])]; // Remove duplicates

    // Store pending registration in session and send OTP
    req.session.pendingRegistration = {
      role: 'student',
      data: {
        name,
        email,
        password,
        skills: allSkills,
        resume: resumePath,
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
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error during registration: ' + error.message });
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
            skills: Array.isArray(data.skills) ? data.skills : (data.skills ? data.skills.split(',').map(s => s.trim()) : []),
            resume: data.resume || '',
            college: data.college || '',
            graduationYear: data.graduationYear || ''
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
