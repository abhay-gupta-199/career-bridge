import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import API from '../../api/axios'
import { motion } from 'framer-motion'
import { Briefcase, MapPin, Users, TrendingUp, Search, X } from 'lucide-react'
import GradientCard from '../../components/ui/GradientCard'
import AnimatedBadge from '../../components/ui/AnimatedBadge'
import SkeletonLoader from '../../components/ui/SkeletonLoader'
import JobCard from '../../components/JobCardEnhanced'

const JobsStudent = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)
  const [error, setError] = useState(null)
  const [appliedJobs, setAppliedJobs] = useState(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMatch, setFilterMatch] = useState(0)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await API.get('/student/jobs')
        if (!mounted) return
        setJobs(res.data)

        // Get applications to check which jobs were already applied
        const appRes = await API.get('/student/applications')
        if (mounted && appRes.data) {
          const appliedJobIds = new Set(appRes.data.map(app => app.job.id))
          setAppliedJobs(appliedJobIds)
        }

        setError(null)
      } catch (err) {
        console.error('Error loading student jobs:', err.message)
        setError('Failed to load jobs')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  const handleApply = async (jobId) => {
    try {
      await API.post(`/student/jobs/${jobId}/apply`)
      // Mark job as applied in local state
      setAppliedJobs(prev => new Set([...prev, jobId]))
      alert('Applied successfully')
    } catch (err) {
      console.error('Failed to apply:', err.message)
      alert(err.response?.data?.message || 'Failed to apply')
    }
  }

  // Filter jobs based on search and match percentage
  const filteredJobs = jobs.filter(job => {
    const matchPercent = job.studentMatch?.matchPercentage ?? 0
    return (
      (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
      matchPercent >= filterMatch
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 px-6 py-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                  Discover Opportunities
                </h1>
                <p className="text-gray-600 mt-2">Find jobs that match your skills</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600">{filteredJobs.length}</div>
                <p className="text-sm text-gray-600">Available Jobs</p>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs by title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none bg-white/70 backdrop-blur-sm transition-all"
                />
              </div>

              <div className="flex gap-2 items-center">
                <label className="text-sm font-semibold text-gray-700">Min Match:</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={filterMatch}
                  onChange={(e) => setFilterMatch(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gradient-to-r from-purple-300 to-pink-300 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-bold text-purple-600 min-w-12">{filterMatch}%</span>
              </div>
            </div>
          </motion.div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3"
            >
              <span className="text-2xl">⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}

          {/* Loading State */}
          {loading ? (
            <SkeletonLoader count={6} type="card" />
          ) : filteredJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-gray-600">No jobs found matching your criteria</p>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job, idx) => {
                const matchPercent = job.studentMatch?.matchPercentage ?? 0
                const isApplied = appliedJobs.has(job._id)

                return (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <JobCard
                      job={{
                        ...job,
                        semanticPercentage: job.studentMatch?.semanticPercentage || 0,
                        tfidfPercentage: job.studentMatch?.tfidfPercentage || 0
                      }}
                      matchPercentage={matchPercent}
                      matchedSkills={job.studentMatch?.matched_skills || []}
                      missingSkills={job.studentMatch?.missing_skills || []}
                      onClick={() => setSelectedJob(job)}
                      onViewDetails={() => setSelectedJob(job)}
                    />
                  </motion.div>
                )
              })}
            </div>
          )}

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
                <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{selectedJob.title}</h2>
                    <p className="text-purple-100 flex items-center gap-2">
                      {selectedJob.company} • {selectedJob.location}
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
                          {selectedJob.studentMatch?.matchPercentage ?? 0}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
                  </div>

                  {/* Required Skills */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedJob.skillsRequired?.map((skill, idx) => (
                        <AnimatedBadge
                          key={idx}
                          text={skill}
                          variant="tag"
                          icon="💼"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Matched Skills */}
                  {selectedJob.studentMatch?.matched_skills?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-2xl">✅</span> Your Matched Skills
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {selectedJob.studentMatch.matched_skills.map((skill, idx) => (
                          <AnimatedBadge
                            key={idx}
                            text={skill}
                            variant="skill"
                            icon="✓"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  {selectedJob.studentMatch?.missing_skills?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-2xl">📚</span> Skills to Develop
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {selectedJob.studentMatch.missing_skills.map((skill, idx) => (
                          <AnimatedBadge
                            key={idx}
                            text={skill}
                            variant="missing"
                            icon="⊘"
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
                    {selectedJob.salaryRange && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs font-semibold text-gray-600 mb-1">Salary</p>
                        <p className="text-sm font-bold text-gray-900">{selectedJob.salaryRange}</p>
                      </div>
                    )}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Posted</p>
                      <p className="text-sm font-bold text-gray-900">Recently</p>
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

                    <motion.button
                      whileHover={!appliedJobs.has(selectedJob._id) ? { scale: 1.05 } : {}}
                      whileTap={!appliedJobs.has(selectedJob._id) ? { scale: 0.95 } : {}}
                      onClick={() => {
                        handleApply(selectedJob._id)
                        setSelectedJob(null)
                      }}
                      disabled={appliedJobs.has(selectedJob._id)}
                      className={`
                        flex-1 px-6 py-3 rounded-xl font-semibold transition-all
                        ${appliedJobs.has(selectedJob._id)
                          ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                        }
                      `}
                    >
                      {appliedJobs.has(selectedJob._id) ? '✓ Applied' : 'Apply Now'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}

export default JobsStudent
