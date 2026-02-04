/**
 * Skill Extraction Routes
 * Routes for extracting and managing skills
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  extractJobSkillsHandler,
  extractResumeSkillsHandler,
  calculateSkillMatchHandler,
  parseJobHandler,
  parseAllJobsHandler,
  getJobDetailsWithSkillsHandler,
  getStudentSkillsHandler
} = require('../controllers/skillExtractionController');

/**
 * POST /api/skills/extract-job-skills
 * Extract skills from job description
 * Body: { title, description, requirements, skillsRequired }
 */
router.post('/extract-job-skills', extractJobSkillsHandler);

/**
 * POST /api/skills/extract-resume-skills
 * Extract skills from resume text (authenticated users)
 * Body: { resumeText }
 */
router.post('/extract-resume-skills', authMiddleware, extractResumeSkillsHandler);

/**
 * POST /api/skills/calculate-match
 * Calculate skill match between resume and job
 * Body: { resumeSkills: [], jobSkills: [] }
 */
router.post('/calculate-match', calculateSkillMatchHandler);

/**
 * POST /api/skills/parse-job/:jobId
 * Parse specific job and extract skills
 * Updates Job model with parsed skills
 */
router.post('/parse-job/:jobId', authMiddleware, parseJobHandler);

/**
 * POST /api/skills/parse-all-jobs
 * Parse all active jobs in database
 * Admin/Owner only
 */
router.post('/parse-all-jobs', authMiddleware, parseAllJobsHandler);

/**
 * GET /api/skills/job-details/:jobId
 * Get job details with detailed skill breakdown and categorization
 */
router.get('/job-details/:jobId', getJobDetailsWithSkillsHandler);

/**
 * GET /api/skills/student-skills/:studentId
 * Get student's parsed resume skills with categorization
 */
router.get('/student-skills/:studentId', getStudentSkillsHandler);

module.exports = router;
