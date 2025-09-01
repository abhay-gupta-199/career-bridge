const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Upload Resume Page
router.get('/upload', isAuthenticated, (req, res) => {
  res.render('upload-resume');
});

module.exports = router;
