/**
 * Hybrid Job Matching Controller
 * Integrates Python ML service with Node.js backend
 * Provides percentage-based job matching combining semantic + TF-IDF
 */

const axios = require('axios');
const Job = require('../models/Job');
const Student = require('../models/Student');

/**
 * Calculate match percentage using hybrid approach
 * 
 * Combines:
 * - Semantic Similarity (70%): Understands meaning
 * - TF-IDF Matching (30%): Keyword frequency
 * 
 * Formula: (semantic_score * 0.7) + (tfidf_score * 0.3) * 100
 */
class HybridMatchingEngine {
  /**
   * Calculate semantic match percentage
   * Uses pre-trained neural network to understand meaning
   * 
   * @param {Array<string>} studentSkills - Skills student has
   * @param {string} jobDescription - Job description text
   * @returns {number} Score 0-1
   * 
   * Line 30-50: Calls Python ML service for semantic embedding
   */
  static async calculateSemanticScore(studentSkills, jobDescription) {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/semantic-score',
        {
          skills: studentSkills,
          description: jobDescription
        }
      );
      
      return response.data.semantic_score; // 0-1
    } catch (error) {
      console.error('❌ Semantic scoring error:', error.message);
      return 0.5; // Default fallback
    }
  }

  /**
   * Calculate TF-IDF match percentage
   * Counts keyword frequency and importance
   * 
   * @param {Array<string>} studentSkills - Skills student has
   * @param {string} jobDescription - Job description text
   * @returns {number} Score 0-1
   * 
   * Line 60-80: Calls Python ML service for TF-IDF scoring
   */
  static async calculateTFIDFScore(studentSkills, jobDescription) {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/tfidf-score',
        {
          skills: studentSkills,
          description: jobDescription
        }
      );
      
      return response.data.tfidf_score; // 0-1
    } catch (error) {
      console.error('❌ TF-IDF scoring error:', error.message);
      return 0.5; // Default fallback
    }
  }

  /**
   * Calculate hybrid match score
   * Combines semantic (70%) and TF-IDF (30%) scores
   * 
   * @param {number} semanticScore - Semantic similarity (0-1)
   * @param {number} tfidfScore - TF-IDF similarity (0-1)
   * @param {number} semanticWeight - Weight for semantic (default 0.7)
   * @param {number} tfidfWeight - Weight for TF-IDF (default 0.3)
   * @returns {number} Combined score 0-1
   * 
   * Line 100-110: Hybrid calculation
   */
  static calculateHybridScore(
    semanticScore,
    tfidfScore,
    semanticWeight = 0.7,
    tfidfWeight = 0.3
  ) {
    const hybridScore = (semanticScore * semanticWeight) + 
                       (tfidfScore * tfidfWeight);
    return Math.round(hybridScore * 10000) / 10000; // 0-1, 4 decimals
  }

  /**
   * Convert score (0-1) to percentage (0-100)
   * 
   * @param {number} score - Score 0-1
   * @returns {number} Percentage 0-100
   * 
   * Line 120-125
   */
  static scoreToPercentage(score) {
    return Math.round(score * 10000) / 100; // 0-100, 2 decimals
  }

  /**
   * Get match interpretation text
   * 
   * @param {number} matchPercentage - Percentage 0-100
   * @returns {string} Human-readable interpretation
   * 
   * Line 130-150
   */
  static getMatchInterpretation(matchPercentage) {
    if (matchPercentage >= 90) return 'Excellent Match - Perfect fit!';
    if (matchPercentage >= 75) return 'Good Match - Well qualified';
    if (matchPercentage >= 60) return 'Fair Match - Some skill gaps';
    if (matchPercentage >= 40) return 'Below Average - Significant learning needed';
    return 'Poor Match - Major skill gaps';
  }

  /**
   * Calculate match for single job
   * Returns detailed breakdown with both scores
   * 
   * @param {Object} job - Job document from MongoDB
   * @param {Array<string>} studentSkills - Student's skills
   * @returns {Object} Match results with percentages
   * 
   * Line 160-200: Full calculation flow
   */
  static async calculateJobMatch(job, studentSkills) {
    // Extract job requirements
    const jobDescription = `${job.title} ${job.description} ${(job.requirements || '')}`;
    
    // Calculate both scores in parallel
    const [semanticScore, tfidfScore] = await Promise.all([
      this.calculateSemanticScore(studentSkills, jobDescription),
      this.calculateTFIDFScore(studentSkills, jobDescription)
    ]);
    
    // Combine scores
    const hybridScore = this.calculateHybridScore(semanticScore, tfidfScore);
    
    // Convert to percentages
    const matchPercentage = this.scoreToPercentage(hybridScore);
    const semanticPercentage = this.scoreToPercentage(semanticScore);
    const tfidfPercentage = this.scoreToPercentage(tfidfScore);
    
    return {
      jobId: job._id,
      title: job.title,
      company: job.company,
      
      // Individual scores (0-1)
      semanticScore: semanticScore,
      tfidfScore: tfidfScore,
      hybridScore: hybridScore,
      
      // Percentages (0-100)
      semanticPercentage: semanticPercentage,
      tfidfPercentage: tfidfPercentage,
      matchPercentage: matchPercentage,
      
      // Interpretation
      interpretation: this.getMatchInterpretation(matchPercentage),
      
      // Skill analysis
      skillBreakdown: {
        required: job.skills || [],
        matched: studentSkills.filter(s => 
          (job.skills || []).some(js => js.toLowerCase() === s.toLowerCase())
        ),
        missing: (job.skills || []).filter(js =>
          !studentSkills.some(s => s.toLowerCase() === js.toLowerCase())
        )
      }
    };
  }

  /**
   * Get top N job matches for a student
   * Sorts by match percentage descending
   * 
   * @param {string} studentId - Student MongoDB ID
   * @param {number} topN - Number of results to return (default 10)
   * @returns {Array<Object>} Array of job matches with percentages
   * 
   * Line 210-250: Multi-job matching
   */
  static async getTopJobMatches(studentId, topN = 10) {
    try {
      // Get student skills
      const student = await Student.findById(studentId);
      if (!student) {
        throw new Error('Student not found');
      }
      
      const studentSkills = student.skills || [];
      
      // Get all jobs
      const jobs = await Job.find().limit(100); // Limit for performance
      
      // Calculate match for each job in parallel
      const matches = await Promise.all(
        jobs.map(job => this.calculateJobMatch(job, studentSkills))
      );
      
      // Sort by match percentage (highest first)
      matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
      
      // Return top N
      return matches.slice(0, topN);
    } catch (error) {
      console.error('❌ Error getting job matches:', error.message);
      throw error;
    }
  }

  /**
   * Calculate match for student AND job together
   * Used for two-way matching
   * 
   * Factors:
   * - Job to student match (job requirements vs student skills)
   * - Student to job match (student interests vs job opportunities)
   * 
   * @param {string} studentId - Student MongoDB ID
   * @param {string} jobId - Job MongoDB ID
   * @returns {Object} Bi-directional match analysis
   * 
   * Line 260-310: Two-way matching
   */
  static async calculateBidirectionalMatch(studentId, jobId) {
    const student = await Student.findById(studentId);
    const job = await Job.findById(jobId);
    
    if (!student || !job) {
      throw new Error('Student or Job not found');
    }
    
    // Job to Student: Does student have required skills?
    const jobToStudentMatch = await this.calculateJobMatch(job, student.skills);
    
    // Student to Job: Does job provide growth opportunities?
    const studentInterests = student.interests || [];
    const jobOpportunities = `${job.title} in ${job.location}`;
    
    // Optional: Calculate reverse match
    const studentToJobScore = studentInterests.length > 0 
      ? await this.calculateSemanticScore(studentInterests, jobOpportunities)
      : 0.5;
    
    // Combined bidirectional score
    const bidirectionalScore = (jobToStudentMatch.hybridScore + studentToJobScore) / 2;
    
    return {
      studentId,
      jobId,
      jobToStudentMatch: {
        percentage: jobToStudentMatch.matchPercentage,
        semanticPercentage: jobToStudentMatch.semanticPercentage,
        tfidfPercentage: jobToStudentMatch.tfidfPercentage,
        interpretation: jobToStudentMatch.interpretation
      },
      studentToJobMatch: {
        percentage: this.scoreToPercentage(studentToJobScore),
        interpretation: this.getMatchInterpretation(this.scoreToPercentage(studentToJobScore))
      },
      bidirectionalScore: this.scoreToPercentage(bidirectionalScore),
      recommendation: bidirectionalScore > 0.7 ? 'Strong Match' : 
                      bidirectionalScore > 0.5 ? 'Fair Match' : 'Weak Match'
    };
  }
}

/**
 * Express Route Handlers
 */

/**
 * GET /api/jobs/matches
 * Get top matching jobs for logged-in student
 * 
 * Response: Array of jobs with match percentages
 * Line 330-360
 */
async function getStudentJobMatches(req, res) {
  try {
    const studentId = req.user.id; // From auth middleware
    const topN = req.query.limit || 10;
    
    const matches = await HybridMatchingEngine.getTopJobMatches(studentId, topN);
    
    res.json({
      success: true,
      studentId,
      totalMatches: matches.length,
      method: 'Hybrid (70% Semantic + 30% TF-IDF)',
      matches: matches.map(m => ({
        jobId: m.jobId,
        title: m.title,
        company: m.company,
        matchPercentage: m.matchPercentage,
        semanticPercentage: m.semanticPercentage,
        tfidfPercentage: m.tfidfPercentage,
        interpretation: m.interpretation,
        skillAnalysis: {
          matched: m.skillBreakdown.matched.length,
          required: m.skillBreakdown.required.length,
          missing: m.skillBreakdown.missing.length
        }
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * POST /api/jobs/:jobId/match
 * Calculate match percentage for specific job
 * 
 * Response: Detailed match breakdown
 * Line 370-410
 */
async function calculateSpecificJobMatch(req, res) {
  try {
    const { jobId } = req.params;
    const studentId = req.user.id;
    
    const student = await Student.findById(studentId);
    const job = await Job.findById(jobId);
    
    if (!student || !job) {
      return res.status(404).json({ error: 'Student or Job not found' });
    }
    
    const match = await HybridMatchingEngine.calculateJobMatch(
      job, 
      student.skills
    );
    
    res.json({
      success: true,
      match: {
        jobId: match.jobId,
        title: match.title,
        company: match.company,
        matchPercentage: match.matchPercentage,
        scoreBreakdown: {
          semanticScore: match.semanticScore,
          semanticPercentage: match.semanticPercentage,
          tfidfScore: match.tfidfScore,
          tfidfPercentage: match.tfidfPercentage,
          hybridScore: match.hybridScore,
          algorithm: '(semantic × 0.7) + (tfidf × 0.3)'
        },
        interpretation: match.interpretation,
        skillAnalysis: {
          required: match.skillBreakdown.required,
          matched: match.skillBreakdown.matched,
          missing: match.skillBreakdown.missing,
          matchedCount: match.skillBreakdown.matched.length,
          missingCount: match.skillBreakdown.missing.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * POST /api/jobs/bidirectional-match
 * Calculate bidirectional match (job→student + student→job)
 * 
 * Body: { jobId }
 * Response: Bidirectional match scores
 * Line 420-450
 */
async function calculateBidirectionalJobMatch(req, res) {
  try {
    const { jobId } = req.body;
    const studentId = req.user.id;
    
    const result = await HybridMatchingEngine.calculateBidirectionalMatch(
      studentId,
      jobId
    );
    
    res.json({
      success: true,
      result: {
        studentId: result.studentId,
        jobId: result.jobId,
        jobToStudent: {
          percentage: result.jobToStudentMatch.percentage,
          interpretation: result.jobToStudentMatch.interpretation,
          breakdown: {
            semantic: result.jobToStudentMatch.semanticPercentage,
            tfidf: result.jobToStudentMatch.tfidfPercentage
          }
        },
        studentToJob: {
          percentage: result.studentToJobMatch.percentage,
          interpretation: result.studentToJobMatch.interpretation
        },
        bidirectionalScore: result.bidirectionalScore,
        recommendation: result.recommendation
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = {
  HybridMatchingEngine,
  getStudentJobMatches,
  calculateSpecificJobMatch,
  calculateBidirectionalJobMatch
};
