import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, ArrowRight, Zap } from 'lucide-react'
import { getRecommendations } from '../api/recommendationApi'
import { Link } from 'react-router-dom'

const RecommendationWidget = () => {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendations()
        setRecommendations((data.recommendations || []).filter(rec => rec.matchPercentage > 80).slice(0, 3))
        setSummary(data.summary)
      } catch (error) {
        console.error('Error fetching recommendations widget:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200"
      >
        <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
      </motion.div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-200"
      >
        <div className="flex items-center gap-3 mb-3">
          <Zap className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-bold text-orange-900">Get Personalized Recommendations</h3>
        </div>
        <p className="text-sm text-orange-800 mb-4">
          Add more skills to your profile to unlock AI-powered job recommendations tailored just for you.
        </p>
        <Link
          to="/student/profile"
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
        >
          Update Profile
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-lg p-6 border border-purple-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">AI Recommendations</h3>
            <p className="text-xs text-gray-600">Based on your skills</p>
          </div>
        </div>
        <Link
          to="/student/recommendations"
          className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-purple-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{summary.recommendedCount}</p>
            <p className="text-xs text-gray-600">For You</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-600">{summary.averageMatch}%</p>
            <p className="text-xs text-gray-600">Avg Match</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{summary.jobsAvailable}</p>
            <p className="text-xs text-gray-600">Available</p>
          </div>
        </div>
      )}

      {/* Top Recommendations */}
      <div className="space-y-3">
        {recommendations.map((job, index) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 bg-white rounded-lg border border-purple-100 hover:border-purple-300 transition-all cursor-pointer hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">{job.title}</h4>
                <p className="text-xs text-gray-600">{job.company}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-bold ${job.matchPercentage >= 80
                  ? 'bg-green-100 text-green-700'
                  : job.matchPercentage >= 60
                    ? 'bg-blue-100 text-blue-700'
                    : job.matchPercentage >= 50
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-orange-100 text-orange-700'
                }`}>
                {job.matchPercentage}%
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {job.matchedSkills?.slice(0, 2).map((skill, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  {skill}
                </span>
              ))}
              {job.missingSkills?.slice(0, 1).map((skill, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                  {skill} (learn)
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <Link
        to="/student/recommendations"
        className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm flex items-center justify-center gap-2"
      >
        <TrendingUp className="w-4 h-4" />
        Explore All Opportunities
      </Link>
    </motion.div>
  )
}

export default RecommendationWidget
