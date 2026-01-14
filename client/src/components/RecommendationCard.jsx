import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Briefcase, TrendingUp, Plus, ChevronRight, AlertCircle } from 'lucide-react'
import { applyForJob } from '../api/recommendationApi'

const RecommendationCard = ({ job, index, onApply, onDetails }) => {
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState(null)

  // Determine color based on match percentage
  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'from-green-400 to-emerald-600'
    if (percentage >= 60) return 'from-blue-400 to-cyan-600'
    if (percentage >= 50) return 'from-yellow-400 to-orange-600'
    return 'from-red-400 to-pink-600'
  }

  // Determine match level text
  const getMatchLevel = (percentage) => {
    if (percentage >= 80) return 'Excellent Match'
    if (percentage >= 60) return 'Good Match'
    if (percentage >= 50) return 'Moderate Match'
    return 'Fair Match'
  }

  const handleApply = async () => {
    setApplying(true)
    setError(null)
    try {
      await applyForJob(job._id)
      setApplied(true)
      if (onApply) onApply(job._id)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply')
      console.error('Apply error:', err)
    } finally {
      setApplying(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden"
    >
      {/* Header with Match Score */}
      <div className={`bg-gradient-to-r ${getMatchColor(job.matchPercentage)} p-4 text-white`}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">{job.title}</h3>
            <p className="text-sm font-semibold opacity-90">{job.company}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{job.matchPercentage}%</div>
            <p className="text-xs font-semibold opacity-90">{getMatchLevel(job.matchPercentage)}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Location and Type */}
        <div className="flex gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{job.location || 'Location not specified'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            <span>{job.jobType || 'Full-time'}</span>
          </div>
        </div>

        {/* Salary */}
        {job.salary && (
          <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded border border-green-100">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Salary: </span>
              {job.salary.min && job.salary.max
                ? `₹${job.salary.min}L - ₹${job.salary.max}L`
                : 'Not specified'}
            </p>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{job.description}</p>

        {/* Skills Section */}
        <div className="mb-4 space-y-2">
          {/* Matched Skills */}
          {job.matchedSkills && job.matchedSkills.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-green-700 mb-2">
                ✓ Matched Skills ({job.matchedSkills.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {job.matchedSkills.slice(0, 4).map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {job.matchedSkills.length > 4 && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    +{job.matchedSkills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {job.missingSkills && job.missingSkills.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-orange-700 mb-2">
                ⚠ Missing Skills ({job.missingSkills.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {job.missingSkills.slice(0, 3).map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {job.missingSkills.length > 3 && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                    +{job.missingSkills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Match Method */}
        <div className="mb-4 p-2 bg-blue-50 rounded border border-blue-100">
          <p className="text-xs text-blue-700">
            <span className="font-semibold">Match Method:</span> {job.matchMethod === 'ml-semantic' ? 'AI-Powered Matching' : 'Skill Matching'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded border border-red-200 flex gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Footer with Action */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
        <button
          onClick={handleApply}
          disabled={applying || applied}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${applied
            ? 'bg-green-600 text-white'
            : applying
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
            }`}
        >
          {applied ? (
            <>
              <span>✓ Applied</span>
            </>
          ) : applying ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>Applying...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Apply Now</span>
            </>
          )}
        </button>
        <button
          onClick={() => onDetails && onDetails(job)}
          className="py-2 px-4 rounded-lg font-semibold text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all flex items-center gap-1"
        >
          <ChevronRight className="w-4 h-4" />
          <span>Details</span>
        </button>
      </div>
    </motion.div>
  )
}

export default RecommendationCard
