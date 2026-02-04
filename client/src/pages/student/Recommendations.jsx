import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import RecommendationCard from '../../components/RecommendationCard'
import { motion } from 'framer-motion'
import { TrendingUp, AlertCircle, RefreshCw, Zap } from 'lucide-react'
import { getRecommendations } from '../../api/recommendationApi'
import SkeletonLoader from '../../components/ui/SkeletonLoader'

const StudentRecommendations = () => {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [appliedJobs, setAppliedJobs] = useState(new Set())
  const [selectedJob, setSelectedJob] = useState(null)

  const fetchRecommendations = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)

      setError(null)
      const data = await getRecommendations()

      setRecommendations((data.recommendations || []).filter(rec => rec.matchPercentage > 80))
      setSummary(data.summary)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to fetch recommendations. Please try again.'
      )
      console.error('Error fetching recommendations:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const handleApply = (jobId) => {
    setAppliedJobs(prev => new Set([...prev, jobId]))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-8">
            <SkeletonLoader count={4} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100">
      <Navbar />
      <div className="flex">
        <Sidebar activeTab="recommendations" />

        <main className="flex-1 px-6 py-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent flex items-center gap-3">
                  <Zap className="w-10 h-10 text-yellow-500" />
                  AI-Powered Recommendations
                </h1>
                <p className="text-gray-600 mt-2">
                  Personalized job matches based on your skills and experience
                </p>
              </div>
              <button
                onClick={() => fetchRecommendations(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </motion.div>

          {/* Summary Cards */}
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
              {/* Total Jobs Available */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Jobs Available</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{summary.jobsAvailable}</p>
                  </div>
                  <Briefcase className="w-12 h-12 text-blue-200" />
                </div>
              </div>

              {/* Recommended for You */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Recommended for You</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{summary.recommendedCount}</p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-purple-200" />
                </div>
              </div>

              {/* Average Match Score */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Average Match</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{summary.averageMatch}%</p>
                  </div>
                  <Zap className="w-12 h-12 text-green-200" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800">Error Loading Recommendations</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          {/* No Recommendations Message */}
          {!loading && recommendations.length === 0 && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 bg-white rounded-lg border border-gray-200"
            >
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No Recommendations Available
              </h3>
              <p className="text-gray-600 mb-4">
                Please add more skills to your profile to get personalized job recommendations.
              </p>
              <a
                href="/student/profile"
                className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Update Profile
              </a>
            </motion.div>
          )}

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((job, index) => (
              <RecommendationCard
                key={job._id}
                job={job}
                index={index}
                onApply={handleApply}
                onDetails={setSelectedJob}
              />
            ))}
          </div>

          {/* Footer Info */}
          {recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
            >
              <h3 className="font-bold text-gray-800 mb-2">💡 Pro Tip</h3>
              <p className="text-sm text-gray-700">
                These recommendations are powered by AI and match your skills with job requirements.
                The higher the match percentage, the better suited you are for the role.
                Don't hesitate to apply to jobs with lower match scores - you can always learn new skills!
              </p>
            </motion.div>
          )}
        </main>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedJob(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{selectedJob.title}</h2>
                <p className="text-purple-100 flex items-center gap-2">
                  {selectedJob.company} • {selectedJob.location || 'Location not specified'}
                </p>
              </div>
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                onClick={() => setSelectedJob(null)}
                className="text-white/80 hover:text-white flex-shrink-0 ml-4"
              >
                <X size={24} />
              </motion.button>
            </div>

            <div className="p-6 space-y-6">
              {/* Match Score Section */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Overall Match</p>
                    <p className="text-sm text-gray-600">Based on your skills and experience</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {selectedJob.matchPercentage}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
              </div>

              {/* Matched Skills */}
              {selectedJob.matchedSkills?.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">✅</span> Matched Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedJob.matchedSkills.map((skill, idx) => (
                      <AnimatedBadge
                        key={`matched-${idx}`}
                        text={skill}
                        variant="skill"
                        icon="✓"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {selectedJob.missingSkills?.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">⚠</span> Missing Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedJob.missingSkills.map((skill, idx) => (
                      <AnimatedBadge
                        key={`missing-${idx}`}
                        text={skill}
                        variant="missing"
                        icon="!"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Job Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedJob.jobType && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Job Type</p>
                    <p className="text-sm font-bold text-gray-900">{selectedJob.jobType}</p>
                  </div>
                )}
                {selectedJob.salary && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Salary</p>
                    <p className="text-sm font-bold text-gray-900">
                      {selectedJob.salary.min && selectedJob.salary.max
                        ? `₹${selectedJob.salary.min}L - ₹${selectedJob.salary.max}L`
                        : 'Not specified'}
                    </p>
                  </div>
                )}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Match Method</p>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedJob.matchMethod === 'ml-semantic' ? 'AI-Powered' : 'Skill Match'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedJob(null)}
                  className="flex-1 px-6 py-3 border-2 border-purple-300 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}


// Import missing icon
import { Briefcase, X } from 'lucide-react'
import AnimatedBadge from '../../components/ui/AnimatedBadge'

export default StudentRecommendations

