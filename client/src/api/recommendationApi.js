import API from './axios'

/**
 * Get AI-powered job recommendations for the logged-in student
 * Recommendations are based on skill match with available jobs
 */
export const getRecommendations = async () => {
  try {
    const response = await API.get('/student/recommendations')
    return response.data
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    throw error
  }
}

/**
 * Get personalized learning roadmap for a recommended job
 * Shows missing skills and learning path
 */
export const getRecommendationRoadmap = async (jobId) => {
  try {
    const response = await API.post(`/student/recommendations/${jobId}/roadmap`)
    return response.data
  } catch (error) {
    console.error('Error fetching recommendation roadmap:', error)
    throw error
  }
}

/**
 * Get job details with match information
 */
export const getJobDetails = async (jobId) => {
  try {
    const response = await API.get(`/student/jobs`)
    const job = response.data.find(j => j._id === jobId)
    return job
  } catch (error) {
    console.error('Error fetching job details:', error)
    throw error
  }
}

/**
 * Apply for a recommended job
 */
export const applyForJob = async (jobId) => {
  try {
    const response = await API.post(`/student/jobs/${jobId}/apply`)
    return response.data
  } catch (error) {
    console.error('Error applying for job:', error)
    throw error
  }
}
