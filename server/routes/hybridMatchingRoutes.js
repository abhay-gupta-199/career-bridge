/**
 * Hybrid Job Matching Routes
 * Endpoints for percentage-based job recommendations
 * 
 * Uses hybrid matching: 70% Semantic + 30% TF-IDF
 */

const express = require('express');
const router = express.Router();
const {
  HybridMatchingEngine,
  getStudentJobMatches,
  calculateSpecificJobMatch,
  calculateBidirectionalJobMatch
} = require('../controllers/hybridMatchingController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * GET /api/hybrid/jobs/matches
 * 
 * Get top matching jobs for the authenticated student
 * 
 * Query Parameters:
 * - limit (optional): Number of results (default: 10)
 * 
 * Response:
 * {
 *   "success": true,
 *   "studentId": "64c7f8a1b2c3d4e5f6g7h8i9",
 *   "totalMatches": 5,
 *   "method": "Hybrid (70% Semantic + 30% TF-IDF)",
 *   "matches": [
 *     {
 *       "jobId": "64c7f8a1b2c3d4e5f6g7h8i9",
 *       "title": "Senior Data Analyst",
 *       "company": "Tech Corp",
 *       "matchPercentage": 81.7,
 *       "semanticPercentage": 82.5,
 *       "tfidfPercentage": 80.2,
 *       "interpretation": "Good Match - Well qualified",
 *       "skillAnalysis": {
 *         "matched": 3,
 *         "required": 5,
 *         "missing": 2
 *       }
 *     }
 *   ]
 * }
 * 
 * Status Codes:
 * - 200: Success
 * - 401: Unauthorized (no auth token)
 * - 500: Server error
 */
router.get(
  '/jobs/matches',
  authMiddleware,
  getStudentJobMatches
);

/**
 * POST /api/hybrid/jobs/:jobId/match
 * 
 * Calculate detailed match percentage for specific job
 * 
 * URL Parameters:
 * - jobId: MongoDB ObjectId of job
 * 
 * Response:
 * {
 *   "success": true,
 *   "match": {
 *     "jobId": "64c7f8a1b2c3d4e5f6g7h8i9",
 *     "title": "Senior Data Analyst",
 *     "company": "Tech Corp",
 *     "matchPercentage": 81.7,
 *     "scoreBreakdown": {
 *       "semanticScore": 0.825,          // 0-1
 *       "semanticPercentage": 82.5,      // 0-100
 *       "tfidfScore": 0.802,             // 0-1
 *       "tfidfPercentage": 80.2,         // 0-100
 *       "hybridScore": 0.817,            // 0-1
 *       "algorithm": "(semantic × 0.7) + (tfidf × 0.3)"
 *     },
 *     "interpretation": "Good Match - Well qualified",
 *     "skillAnalysis": {
 *       "required": ["Python", "SQL", "Excel", "Tableau", "Tableau"],
 *       "matched": ["Python", "SQL", "Excel"],
 *       "missing": ["Tableau", "Power BI"],
 *       "matchedCount": 3,
 *       "missingCount": 2
 *     }
 *   }
 * }
 * 
 * Status Codes:
 * - 200: Success
 * - 400: Invalid request
 * - 401: Unauthorized
 * - 404: Job not found
 * - 500: Server error
 */
router.post(
  '/jobs/:jobId/match',
  authMiddleware,
  calculateSpecificJobMatch
);

/**
 * POST /api/hybrid/jobs/bidirectional-match
 * 
 * Calculate bidirectional match between student and job
 * 
 * Factors:
 * 1. Job → Student: Does student have required skills? (Primary)
 * 2. Student → Job: Does job match student interests? (Secondary)
 * 
 * Request Body:
 * {
 *   "jobId": "64c7f8a1b2c3d4e5f6g7h8i9"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "result": {
 *     "studentId": "64c7f8a1b2c3d4e5f6g7h8i9",
 *     "jobId": "64c7f8a1b2c3d4e5f6g7h8i9",
 *     "jobToStudent": {
 *       "percentage": 81.7,
 *       "interpretation": "Good Match - Well qualified",
 *       "breakdown": {
 *         "semantic": 82.5,
 *         "tfidf": 80.2
 *       }
 *     },
 *     "studentToJob": {
 *       "percentage": 75.3,
 *       "interpretation": "Good Match - Well qualified"
 *     },
 *     "bidirectionalScore": 78.5,
 *     "recommendation": "Strong Match"
 *   }
 * }
 * 
 * Status Codes:
 * - 200: Success
 * - 400: Invalid request body
 * - 401: Unauthorized
 * - 404: Student or Job not found
 * - 500: Server error
 */
router.post(
  '/jobs/bidirectional-match',
  authMiddleware,
  calculateBidirectionalJobMatch
);

/**
 * GET /api/hybrid/algorithm-info
 * 
 * Get information about the hybrid matching algorithm
 * 
 * Response:
 * {
 *   "algorithm": "Hybrid Job Matching",
 *   "description": "Combines semantic similarity and TF-IDF keyword matching",
 *   "weights": {
 *     "semantic": 0.7,
 *     "tfidf": 0.3
 *   },
 *   "formula": "(semantic_score × 0.7) + (tfidf_score × 0.3) × 100",
 *   "scoring": {
 *     "range": "0-100%",
 *     "90-100": "Excellent Match - Perfect fit",
 *     "75-89": "Good Match - Well qualified",
 *     "60-74": "Fair Match - Some skill gaps",
 *     "40-59": "Below Average - Significant learning needed",
 *     "0-39": "Poor Match - Major skill gaps"
 *   },
 *   "methods": [
 *     {
 *       "name": "Semantic Similarity",
 *       "weight": 0.7,
 *       "purpose": "Understands meaning beyond keywords",
 *       "technology": "Sentence Transformers (all-MiniLM-L6-v2)",
 *       "benefits": [
 *         "Recognizes skill synonyms",
 *         "Handles related concepts",
 *         "Understands job descriptions"
 *       ]
 *     },
 *     {
 *       "name": "TF-IDF Matching",
 *       "weight": 0.3,
 *       "purpose": "Counts keyword frequency",
 *       "technology": "scikit-learn TfidfVectorizer",
 *       "benefits": [
 *         "Identifies exact keywords",
 *         "Measures term importance",
 *         "Fast computation"
 *       ]
 *     }
 *   ]
 * }
 * 
 * Status Codes:
 * - 200: Success
 */
router.get('/algorithm-info', (req, res) => {
  res.json({
    algorithm: 'Hybrid Job Matching Engine',
    description: 'Combines semantic similarity (70%) and TF-IDF keyword matching (30%)',
    version: '1.0.0',
    weights: {
      semantic: 0.7,
      tfidf: 0.3
    },
    formula: '(semantic_score × 0.7) + (tfidf_score × 0.3) × 100',
    scoreInterpretation: {
      range: '0-100%',
      '90-100': 'Excellent Match - Perfect fit',
      '75-89': 'Good Match - Well qualified',
      '60-74': 'Fair Match - Some skill gaps',
      '40-59': 'Below Average - Significant learning needed',
      '0-39': 'Poor Match - Major skill gaps'
    },
    methods: [
      {
        name: 'Semantic Similarity',
        weight: 0.7,
        percentage: '70%',
        purpose: 'Understands meaning of skills beyond keywords',
        technology: 'Sentence Transformers (all-MiniLM-L6-v2 model)',
        process: 'Converts skills/job description to 384-dimensional vectors, calculates cosine similarity',
        benefits: [
          'Recognizes skill synonyms (e.g., "JS" = "JavaScript")',
          'Handles related concepts (e.g., "Database" related to "SQL")',
          'Understands job titles and descriptions',
          'Works with misspellings'
        ],
        example: {
          studentSkill: 'JavaScript',
          jobDescription: 'Frontend Web Development',
          semanticScore: 0.82,
          semanticPercentage: '82%',
          reasoning: 'Model understands JavaScript is used for frontend web development'
        }
      },
      {
        name: 'TF-IDF Matching',
        weight: 0.3,
        percentage: '30%',
        purpose: 'Counts keyword frequency and importance',
        technology: 'scikit-learn TfidfVectorizer',
        process: 'Creates vocabulary, calculates term frequency, normalizes by inverse document frequency',
        benefits: [
          'Identifies exact keyword matches',
          'Measures how important each skill is in job description',
          'Ignores common English words',
          'Fast computation'
        ],
        example: {
          studentSkills: ['Python', 'SQL', 'Excel'],
          jobKeywords: ['Python', 'SQL', 'Tableau', 'Power BI'],
          tfidfScore: 0.65,
          tfidfPercentage: '65%',
          reasoning: '2 exact keyword matches (Python, SQL) out of 4 job keywords'
        }
      }
    ],
    whyHybrid: {
      semanticPros: ['Semantic Understanding', 'Synonym Recognition', 'Concept Matching'],
      semanticCons: ['Slower', 'May overweight some terms'],
      tfidfPros: ['Fast', 'Exact Keyword Match', 'Precise'],
      tfidfCons: ['Misses Synonyms', 'No Semantic Understanding'],
      hybridBenefit: 'Best of both worlds - fast, accurate, comprehensive'
    }
  });
});

/**
 * POST /api/hybrid/test-match
 * 
 * Test endpoint for hybrid matching (no auth required)
 * Useful for development and testing
 * 
 * Request Body:
 * {
 *   "studentSkills": ["Python", "SQL", "Excel"],
 *   "jobTitle": "Data Analyst",
 *   "jobDescription": "Looking for data analyst with Python and SQL skills"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "testResult": {
 *     "studentSkills": ["Python", "SQL", "Excel"],
 *     "jobTitle": "Data Analyst",
 *     "semanticScore": 0.825,
 *     "semanticPercentage": 82.5,
 *     "tfidfScore": 0.802,
 *     "tfidfPercentage": 80.2,
 *     "hybridScore": 0.817,
 *     "matchPercentage": 81.7,
 *     "interpretation": "Good Match - Well qualified",
 *     "breakdown": {
 *       "algorithm": "(0.825 × 0.7) + (0.802 × 0.3) = 0.817",
 *       "semanticContribution": "57.75%",
 *       "tfidfContribution": "24.06%",
 *       "total": "81.81%"
 *     }
 *   }
 * }
 */
router.post('/test-match', async (req, res) => {
  try {
    const { studentSkills, jobTitle, jobDescription } = req.body;

    if (!studentSkills || !jobDescription) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: studentSkills, jobDescription'
      });
    }

    // Calculate scores
    const semanticScore = 0.825; // Placeholder - call Python service
    const tfidfScore = 0.802;    // Placeholder - call Python service
    const hybridScore = HybridMatchingEngine.calculateHybridScore(
      semanticScore,
      tfidfScore
    );

    res.json({
      success: true,
      testResult: {
        studentSkills,
        jobTitle: jobTitle || 'Unknown Job',
        semanticScore,
        semanticPercentage: HybridMatchingEngine.scoreToPercentage(semanticScore),
        tfidfScore,
        tfidfPercentage: HybridMatchingEngine.scoreToPercentage(tfidfScore),
        hybridScore,
        matchPercentage: HybridMatchingEngine.scoreToPercentage(hybridScore),
        interpretation: HybridMatchingEngine.getMatchInterpretation(
          HybridMatchingEngine.scoreToPercentage(hybridScore)
        ),
        breakdown: {
          algorithm: `(${semanticScore} × 0.7) + (${tfidfScore} × 0.3) = ${hybridScore}`,
          semanticContribution: `${(semanticScore * 0.7 * 100).toFixed(2)}%`,
          tfidfContribution: `${(tfidfScore * 0.3 * 100).toFixed(2)}%`,
          total: `${HybridMatchingEngine.scoreToPercentage(hybridScore)}%`
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
