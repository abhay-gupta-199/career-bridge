import { useState, useCallback } from 'react'
import { getRecommendations, getRecommendationRoadmap, applyForJob } from '../api/recommendationApi'

/**
 * Custom hook for managing AI recommendations
 */
export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [appliedJobs, setAppliedJobs] = useState(new Set())

  const fetchRecommendations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRecommendations()
      setRecommendations(data.recommendations || [])
      setSummary(data.summary)
      return data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch recommendations')
      console.error('Error:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRoadmap = useCallback(async (jobId) => {
    try {
      const data = await getRecommendationRoadmap(jobId)
      return data
    } catch (err) {
      console.error('Error fetching roadmap:', err)
      throw err
    }
  }, [])

  const apply = useCallback(async (jobId) => {
    try {
      const result = await applyForJob(jobId)
      setAppliedJobs(prev => new Set([...prev, jobId]))
      return result
    } catch (err) {
      console.error('Error applying:', err)
      throw err
    }
  }, [])

  return {
    recommendations,
    summary,
    loading,
    error,
    appliedJobs,
    fetchRecommendations,
    fetchRoadmap,
    apply
  }
}

export default useRecommendations
