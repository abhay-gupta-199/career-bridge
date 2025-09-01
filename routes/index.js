const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');

// Landing Page
router.get('/', (req, res) => {
  res.render('index');
});

// Dashboard (protected)
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).lean();
    if (!user) return res.redirect('/auth/login');
    res.render('dashboard', { user });
  } catch (err) {
    console.error(err);
    res.redirect('/auth/login');
  }
});

// Simple session debugger (optional)
router.get('/debug/session', (req, res) => {
  res.json({ session: req.session });
});

module.exports = router;
