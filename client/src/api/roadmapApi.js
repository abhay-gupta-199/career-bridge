import axiosInstance from './axios';

const API_BASE = '/student';

/**
 * Get all available jobs for creating roadmaps
 */
export const getJobsForRoadmaps = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE}/recommendations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs for roadmaps:', error);
    throw error;
  }
};

/**
 * Generate personalized roadmap for a specific job
 * @param {string} jobId - The job ID to generate roadmap for
 */
export const generateJobRoadmap = async (jobId) => {
  try {
    const response = await axiosInstance.post('/generate-job-roadmap', { jobId });
    return response.data;
  } catch (error) {
    console.error('Error generating job roadmap:', error);
    throw error;
  }
};

/**
 * Generate roadmap for missing skills
 * @param {array} skills - Array of skill names
 */
export const generateSkillsRoadmap = async (skills) => {
  try {
    const response = await axiosInstance.post('/generate-roadmap', { skills });
    return response.data;
  } catch (error) {
    console.error('Error generating skills roadmap:', error);
    throw error;
  }
};

/**
 * Get roadmap details
 */
export const getRoadmapDetails = async (jobId) => {
  try {
    const response = await axiosInstance.post('/recommendations/' + jobId + '/roadmap');
    return response.data;
  } catch (error) {
    console.error('Error fetching roadmap details:', error);
    throw error;
  }
};

/**
 * Save progress on a roadmap
 */
export const saveRoadmapProgress = async (jobId, skillName, progress) => {
  try {
    const response = await axiosInstance.post(`${API_BASE}/roadmap-progress`, {
      jobId,
      skillName,
      progress
    });
    return response.data;
  } catch (error) {
    console.error('Error saving roadmap progress:', error);
    throw error;
  }
};

/**
 * Get user's roadmap progress
 */
export const getRoadmapProgress = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE}/roadmap-progress`);
    return response.data;
  } catch (error) {
    console.error('Error fetching roadmap progress:', error);
    throw error;
  }
};

/**
 * Fetch roadmap with skill array (fallback API)
 */
export const fetchRoadmap = async (skills) => {
  try {
    const response = await axiosInstance.post('/generate-roadmap', { skills });
    return response.data;
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    throw error;
  }
};
