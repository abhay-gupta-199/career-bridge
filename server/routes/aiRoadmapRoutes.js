const express = require('express');
const router = express.Router();
const aiRoadmapController = require('../controllers/aiRoadmapController');
const { protect } = require('../middleware/auth'); // Assuming you have auth middleware

router.post('/generate', protect, aiRoadmapController.generateRoadmap);

module.exports = router;
