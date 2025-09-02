const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { requireGuest } = require('../middleware/auth');

const router = express.Router();

// Signup GET
router.get('/signup', requireGuest, (req, res) => {
  res.render('signup', { error: null });
});

// Signup POST
router.post('/signup', requireGuest, async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      college,
      branch,
      course,
      passout_year,
      skills,
      certifications
    } = req.body;

    // Required fields
    if (!name || !email || !password || !college || !branch || !course || !passout_year) {
      return res.status(400).render('signup', { error: 'All fields are required' });
    }

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).render('signup', { error: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      college,
      branch,
      course,
      passout_year,
      skills: skills ? skills.split(',') : [],
      certifications: certifications ? certifications.split(',') : []
    });

    req.session.userId = user._id;
    res.redirect('/dashboard');
  } catch (e) {
    console.error(e);
    res.status(500).render('signup', { error: 'Server error. Please try again.' });
  }
});

// Login routes remain same
router.get('/login', requireGuest, (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', requireGuest, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).render('login', { error: 'Invalid email or password' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).render('login', { error: 'Invalid email or password' });

    req.session.userId = user._id;
    res.redirect('/dashboard');
  } catch (e) {
    console.error(e);
    res.status(500).render('login', { error: 'Server error. Please try again.' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
