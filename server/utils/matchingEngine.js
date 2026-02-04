/**
 * Resume-JD Matching Engine
 * 
 * Uses the Python ML service (hybrid_roadmap/modules/recommender/jd_reume.py)
 * for intelligent skill matching with semantic and TF-IDF analysis
 * 
 * Matches student resume skills against Job Description (JD) skills
 * Calculates match percentage, identifies matched/unmatched skills
 */

const axios = require('axios');

// ----------- HELPER FUNCTIONS -----------

/**
 * Clean and normalize a skill
 * Converts to lowercase, trims whitespace, removes special chars
 */
const cleanSkill = (skill) => {
  return String(skill)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\+\#\-\.]/g, '') // Remove special chars except +, #, -, .
    .trim();
};

/**
 * Clean skill arrays - remove duplicates and invalid entries
 */
const cleanSkillArray = (skills) => {
  if (!Array.isArray(skills)) return [];

  return [
    ...new Set(
      skills
        .filter(s => s && typeof s === 'string')
        .map(cleanSkill)
        .filter(s => s.length > 0)
    )
  ];
};

/**
 * Calculate match percentage using simple intersection method
 * Fallback when ML API is unavailable
 * matchPercentage = (matched skills / total JD skills) * 100
 */
const calculateSimpleMatchPercentage = (resumeSkills, jdSkills) => {
  const cleanedResume = new Set(cleanSkillArray(resumeSkills));
  const cleanedJD = cleanSkillArray(jdSkills);

  if (cleanedJD.length === 0) return 0;

  const matched = cleanedJD.filter(skill => cleanedResume.has(skill));
  return Math.round((matched.length / cleanedJD.length) * 100);
};

/**
 * Get matched and unmatched skills
 * Fallback when ML API is unavailable
 */
const getMatchedUnmatchedSkills = (resumeSkills, jdSkills) => {
  const cleanedResume = new Set(cleanSkillArray(resumeSkills));
  const cleanedJD = cleanSkillArray(jdSkills);

  const matched = cleanedJD.filter(skill => cleanedResume.has(skill));
  const unmatched = cleanedJD.filter(skill => !cleanedResume.has(skill));

  return {
    matched,
    unmatched
  };
};

// ----------- MAIN MATCHING FUNCTION -----------

/**
 * Match a single student's skills against JD skills using ML service
 * Calls Python API: /match-skills endpoint
 * Uses: Semantic Similarity (70%) + TF-IDF (30%)
 * 
 * @param {Array<String>} resumeSkills - Student's skills array
 * @param {Array<String>} jdSkills - Job's required skills array
 * @returns {Object} Matching result with scores and skill breakdown
 */
const matchStudentWithJD = async (resumeSkills, jdSkills) => {
  try {
    // Normalize inputs to safe arrays of cleaned skills
    const cleanedResume = cleanSkillArray(resumeSkills);
    const cleanedJD = cleanSkillArray(jdSkills);

    // If no JD skills provided, nothing to match
    if (!Array.isArray(cleanedJD) || cleanedJD.length === 0) {
      return {
        status: 'success',
        method: 'none',
        matched_skills: [],
        missing_skills: [],
        match_percentage: 0,
        semantic_score: null,
        tfidf_score: null,
        hybrid_score: null
      };
    }

    // If student has no skills, return simple 0 match
    if (!Array.isArray(cleanedResume) || cleanedResume.length === 0) {
      return performSimpleMatching([], cleanedJD);
    }

    // Use ML API for semantic matching but pass cleaned arrays
    return await performMLMatching(cleanedResume, cleanedJD);
  } catch (error) {
    console.error('Matching error, falling back to simple method:', error.message);
    // Fallback to simple matching on any error
    return performSimpleMatching(resumeSkills, jdSkills);
  }
};

/**
 * Perform simple skill intersection matching (Fallback)
 * Used when ML API is unavailable
 */
const performSimpleMatching = (resumeSkills, jdSkills) => {
  const { matched, unmatched } = getMatchedUnmatchedSkills(resumeSkills, jdSkills);
  const matchPercentage = calculateSimpleMatchPercentage(resumeSkills, jdSkills);

  return {
    status: 'success',
    method: 'simple',
    matched_skills: matched,
    missing_skills: unmatched,
    match_percentage: matchPercentage,
    semantic_score: null,
    tfidf_score: null,
    hybrid_score: null
  };
};

/**
 * Perform ML-based semantic matching using Python service
 * 
 * Calls: POST /match-skills
 * Body: { resume_skills: [...], jd_skills: [...] }
 * 
 * Response includes:
 * - matched_skills: skills found in both resume and JD
 * - missing_skills: JD skills not in resume
 * - semantic_score: 0-1 score from Sentence Transformers
 * - tfidf_score: 0-1 score from TF-IDF vectorizer
 * - hybrid_score: weighted combination (70% semantic + 30% tf-idf)
 * - match_percentage: simple skill intersection percentage
 */
const performMLMatching = async (resumeSkills, jdSkills) => {
  const ML_API_URL = process.env.ML_API_URL || 'http://127.0.0.1:5002';

  try {
    console.log(`Sending ML request to ${ML_API_URL}/match-skills...`);
    const response = await axios.post(
      `${ML_API_URL}/match-skills`,
      {
        resume_skills: resumeSkills,
        jd_skills: jdSkills
      },
      {
        timeout: 300000 // 5 minutes timeout for ML service
      }
    );

    if (response.data.status === 'success' && response.data.match_result) {
      const result = response.data.match_result;

      return {
        status: 'success',
        method: 'ml-semantic',
        matched_skills: result.matched_skills || [],
        missing_skills: result.missing_skills || [],
        match_percentage: Math.round(result.match_percentage || 0),
        semantic_score: result.semantic_score || null,
        tfidf_score: result.tfidf_score || null,
        hybrid_score: result.hybrid_score || null
      };
    }

    // If ML API returns success but no match_result, fallback
    console.warn('⚠️ ML API returned invalid response structure');
    return performSimpleMatching(resumeSkills, jdSkills);
  } catch (error) {
    console.error('⚠️ ML API error:', error.message);
    // Fallback to simple matching if ML service is down
    return performSimpleMatching(resumeSkills, jdSkills);
  }
};

/**
 * Match ALL students against a Job Description
 * This is the main batch matching function
 * 
 * @param {Array<Object>} students - Array of student documents with skills
 * @param {Array<String>} jdSkills - Job's required skills
 * @param {Number} threshold - Minimum match percentage to notify (default: 60)
 * @returns {Array<Object>} Array of matching results for students who meet threshold
 */
const matchAllStudentsWithJD = async (students, jdSkills, threshold = 75) => {
  const matchingResults = [];

  for (const student of students) {
    try {
      // Skip students without skills
      if (!student.skills || student.skills.length === 0) {
        continue;
      }

      const matchResult = await matchStudentWithJD(student.skills, jdSkills);

      // Only include students meeting the threshold
      if (matchResult.match_percentage >= threshold) {
        matchingResults.push({
          studentId: student._id,
          studentName: student.name,
          studentEmail: student.email,
          ...matchResult
        });
      }
    } catch (error) {
      console.error(`Error matching student ${student._id}:`, error.message);
      // Continue matching other students even if one fails
      continue;
    }
  }

  return matchingResults;
};

/**
 * Batch match students with proper error handling and logging
 * More resilient version for production
 * 
 * Returns object with:
 * - successful: Students who matched above threshold
 * - failed: Students where matching threw an error
 * - skipped: Students without skills or below threshold
 */
const matchStudentsBatch = async (students, jdSkills, threshold = 75) => {
  const results = {
    successful: [],
    failed: [],
    skipped: []
  };

  for (const student of students) {
    try {
      // Validate student data
      if (!student._id || !student.email) {
        results.skipped.push({
          reason: 'Invalid student data',
          student: student
        });
        continue;
      }

      // Skip students without skills
      if (!student.skills || !Array.isArray(student.skills) || student.skills.length === 0) {
        results.skipped.push({
          reason: 'No skills',
          studentId: student._id
        });
        continue;
      }

      // Perform matching using ML service (jd_reume.py via /match-skills endpoint)
      const matchResult = await matchStudentWithJD(student.skills, jdSkills);

      // Add to results if above threshold
      if (matchResult.match_percentage >= threshold) {
        results.successful.push({
          studentId: student._id,
          studentName: student.name || 'Unknown',
          studentEmail: student.email,
          matchPercentage: matchResult.match_percentage,
          matchedSkills: matchResult.matched_skills,
          unmatchedSkills: matchResult.missing_skills,
          method: matchResult.method,
          semanticScore: matchResult.semantic_score,
          tfidfScore: matchResult.tfidf_score,
          hybridScore: matchResult.hybrid_score
        });
      } else {
        results.skipped.push({
          reason: `Below threshold (${matchResult.match_percentage}% < ${threshold}%)`,
          studentId: student._id,
          matchPercentage: matchResult.match_percentage
        });
      }
    } catch (error) {
      console.error(`Error matching student ${student._id}:`, error.message);
      results.failed.push({
        studentId: student._id,
        error: error.message
      });
    }
  }

  return results;
};

/**
 * Compute match info for all students (detailed) regardless of threshold.
 * Returns array of { studentId, studentName, studentEmail, matchPercentage, matchedSkills, missingSkills, method }
 */
const computeMatchesForAllStudents = async (students, jdSkills) => {
  const allMatches = [];

  for (const student of students) {
    try {
      if (!student._id || !student.email) {
        allMatches.push({
          studentId: student._id || null,
          studentName: student.name || 'Unknown',
          studentEmail: student.email || null,
          matchPercentage: 0,
          matchedSkills: [],
          missingSkills: [],
          method: 'invalid-student'
        });
        continue;
      }

      // If student has no skills, return 0 match
      if (!student.skills || !Array.isArray(student.skills) || student.skills.length === 0) {
        allMatches.push({
          studentId: student._id,
          studentName: student.name || 'Unknown',
          studentEmail: student.email,
          matchPercentage: 0,
          matchedSkills: [],
          missingSkills: cleanSkillArray(jdSkills),
          method: 'no-skills'
        });
        continue;
      }

      const result = await matchStudentWithJD(student.skills, jdSkills);

      allMatches.push({
        studentId: student._id,
        studentName: student.name || 'Unknown',
        studentEmail: student.email,
        matchPercentage: result.match_percentage || 0,
        matchedSkills: result.matched_skills || [],
        missingSkills: result.missing_skills || [],
        method: result.method || 'simple',
        semanticScore: result.semantic_score || null,
        tfidfScore: result.tfidf_score || null,
        hybridScore: result.hybrid_score || null
      });
    } catch (err) {
      console.error(`Error computing match for student ${student._id}:`, err.message);
      allMatches.push({
        studentId: student._id || null,
        studentName: student.name || 'Unknown',
        studentEmail: student.email || null,
        matchPercentage: 0,
        matchedSkills: [],
        missingSkills: cleanSkillArray(jdSkills),
        method: 'error'
      });
    }
  }

  return allMatches;
};

module.exports = {
  cleanSkill,
  cleanSkillArray,
  calculateSimpleMatchPercentage,
  getMatchedUnmatchedSkills,
  matchStudentWithJD,
  performSimpleMatching,
  performMLMatching,
  matchAllStudentsWithJD,
  matchStudentsBatch
  , computeMatchesForAllStudents
};
