/**
 * Skill Extraction Controller
 * Handles skill parsing from resumes, job descriptions, and text
 */

const Student = require('../models/Student');
const Job = require('../models/Job');
const {
  extractSkillsFromText,
  extractJobSkills,
  extractResumeSkills,
  calculateSkillMatch,
  categorizeSkills,
  normalizeSkill
} = require('../utils/skillExtractor');

/**
 * Extract skills from job description
 * POST /api/skills/extract-job-skills
 */
const extractJobSkillsHandler = async (req, res) => {
  try {
    const { title, description, requirements, skillsRequired } = req.body;
    
    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Job description is required'
      });
    }
    
    const jobData = {
      title: title || '',
      description,
      requirements: requirements || '',
      skillsRequired: skillsRequired || []
    };
    
    const skillExtraction = extractJobSkills(jobData);
    const categorized = categorizeSkills(skillExtraction.combinedSkills);
    
    return res.status(200).json({
      success: true,
      data: {
        ...skillExtraction,
        categorized,
        categories: Object.keys(categorized).filter(cat => categorized[cat].length > 0)
      }
    });
  } catch (error) {
    console.error('Error extracting job skills:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to extract job skills',
      error: error.message
    });
  }
};

/**
 * Extract skills from resume text
 * POST /api/skills/extract-resume-skills
 */
const extractResumeSkillsHandler = async (req, res) => {
  try {
    const { resumeText } = req.body;
    const userId = req.user?.id;
    
    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: 'Resume text is required'
      });
    }
    
    const skillExtraction = extractResumeSkills(resumeText);
    const categorized = categorizeSkills(skillExtraction.extractedSkills);
    
    // If user is authenticated, save extracted skills
    if (userId) {
      await Student.findByIdAndUpdate(
        userId,
        { skills: skillExtraction.extractedSkills },
        { new: true }
      );
    }
    
    return res.status(200).json({
      success: true,
      data: {
        ...skillExtraction,
        categorized,
        categories: Object.keys(categorized).filter(cat => categorized[cat].length > 0),
        saved: !!userId
      }
    });
  } catch (error) {
    console.error('Error extracting resume skills:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to extract resume skills',
      error: error.message
    });
  }
};

/**
 * Calculate skill match between resume and job
 * POST /api/skills/calculate-match
 */
const calculateSkillMatchHandler = async (req, res) => {
  try {
    const { resumeSkills, jobSkills } = req.body;
    
    if (!resumeSkills || !jobSkills) {
      return res.status(400).json({
        success: false,
        message: 'Resume skills and job skills are required'
      });
    }
    
    const matchDetails = calculateSkillMatch(resumeSkills, jobSkills);
    const categorized = categorizeSkills([...matchDetails.matchedSkills, ...matchDetails.missingSkills]);
    
    return res.status(200).json({
      success: true,
      data: {
        ...matchDetails,
        matchedCategorized: categorizeSkills(matchDetails.matchedSkills),
        missingCategorized: categorizeSkills(matchDetails.missingSkills),
        extraCategorized: categorizeSkills(matchDetails.extraSkills)
      }
    });
  } catch (error) {
    console.error('Error calculating skill match:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate skill match',
      error: error.message
    });
  }
};

/**
 * Parse and update job with extracted skills
 * POST /api/skills/parse-job/:jobId
 */
const parseJobHandler = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    const skillExtraction = extractJobSkills({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      skillsRequired: job.skillsRequired
    });
    
    // Update job with parsed skills
    job.parsedSkills = skillExtraction.combinedSkills;
    await job.save();
    
    const categorized = categorizeSkills(skillExtraction.combinedSkills);
    
    return res.status(200).json({
      success: true,
      message: 'Job parsed successfully',
      data: {
        jobId: job._id,
        title: job.title,
        company: job.company,
        ...skillExtraction,
        categorized,
        categories: Object.keys(categorized).filter(cat => categorized[cat].length > 0)
      }
    });
  } catch (error) {
    console.error('Error parsing job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to parse job',
      error: error.message
    });
  }
};

/**
 * Parse all jobs in database
 * POST /api/skills/parse-all-jobs
 * Admin only
 */
const parseAllJobsHandler = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true });
    const results = [];
    let successCount = 0;
    let errorCount = 0;
    
    for (const job of jobs) {
      try {
        const skillExtraction = extractJobSkills({
          title: job.title,
          description: job.description,
          requirements: job.requirements,
          skillsRequired: job.skillsRequired
        });
        
        job.parsedSkills = skillExtraction.combinedSkills;
        await job.save();
        
        results.push({
          jobId: job._id,
          title: job.title,
          skillsCount: skillExtraction.combinedSkills.length,
          status: 'success'
        });
        successCount++;
      } catch (jobError) {
        errorCount++;
        results.push({
          jobId: job._id,
          title: job.title,
          status: 'error',
          error: jobError.message
        });
      }
    }
    
    return res.status(200).json({
      success: true,
      message: `Parsed ${successCount} jobs successfully, ${errorCount} failed`,
      summary: {
        totalJobs: jobs.length,
        successCount,
        errorCount,
        averageSkillsPerJob: Math.round(
          results.reduce((sum, r) => sum + (r.skillsCount || 0), 0) / successCount
        )
      },
      results: results.slice(0, 20) // Return first 20
    });
  } catch (error) {
    console.error('Error parsing all jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to parse jobs',
      error: error.message
    });
  }
};

/**
 * Get job with detailed skill breakdown
 * GET /api/skills/job-details/:jobId
 */
const getJobDetailsWithSkillsHandler = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const job = await Job.findById(jobId)
      .populate('postedBy', 'name email')
      .populate('postedByCollege', 'name');
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // If no parsed skills, extract them
    if (!job.parsedSkills || job.parsedSkills.length === 0) {
      const skillExtraction = extractJobSkills({
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        skillsRequired: job.skillsRequired
      });
      job.parsedSkills = skillExtraction.combinedSkills;
      await job.save();
    }
    
    const categorized = categorizeSkills(job.parsedSkills);
    
    return res.status(200).json({
      success: true,
      data: {
        _id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        requirements: job.requirements,
        experience: job.experience,
        salary: job.salary,
        jobType: job.jobType,
        skillsRequired: job.skillsRequired,
        parsedSkills: job.parsedSkills,
        categorized,
        skillsBreakdown: {
          total: job.parsedSkills.length,
          byCategory: Object.entries(categorized).reduce((acc, [cat, skills]) => {
            if (skills.length > 0) acc[cat] = skills.length;
            return acc;
          }, {})
        }
      }
    });
  } catch (error) {
    console.error('Error getting job details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get job details',
      error: error.message
    });
  }
};

/**
 * Get student resume skills
 * GET /api/skills/student-skills/:studentId
 */
const getStudentSkillsHandler = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    const categorized = categorizeSkills(student.skills);
    
    return res.status(200).json({
      success: true,
      data: {
        studentId: student._id,
        name: student.name,
        email: student.email,
        skills: student.skills,
        categorized,
        skillsBreakdown: {
          total: student.skills.length,
          byCategory: Object.entries(categorized).reduce((acc, [cat, skills]) => {
            if (skills.length > 0) acc[cat] = skills.length;
            return acc;
          }, {})
        }
      }
    });
  } catch (error) {
    console.error('Error getting student skills:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get student skills',
      error: error.message
    });
  }
};

module.exports = {
  extractJobSkillsHandler,
  extractResumeSkillsHandler,
  calculateSkillMatchHandler,
  parseJobHandler,
  parseAllJobsHandler,
  getJobDetailsWithSkillsHandler,
  getStudentSkillsHandler
};
