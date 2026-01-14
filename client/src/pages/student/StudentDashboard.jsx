import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import RecommendationWidget from '../../components/RecommendationWidget'
import API from '../../api/axios'
import { motion } from 'framer-motion'
import { TrendingUp, BookOpen, Target, Mail, Award, ArrowRight, MapPin, X } from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import GradientCard from '../../components/ui/GradientCard'
import GlassCard from '../../components/ui/GlassCard'
import AnimatedBadge from '../../components/ui/AnimatedBadge'
import SkeletonLoader from '../../components/ui/SkeletonLoader'

const StudentDashboard = () => {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [jobs, setJobs] = useState([])
  const [showAllSkills, setShowAllSkills] = useState(false)
  const [expandedJobs, setExpandedJobs] = useState(new Set())
  const [selectedJob, setSelectedJob] = useState(null)
  const [appliedJobs, setAppliedJobs] = useState(new Set())

  const toggleJobSkills = (jobId) => {
    setExpandedJobs(prev => {
      const next = new Set(prev)
      if (next.has(jobId)) next.delete(jobId)
      else next.add(jobId)
      return next
    })
  }

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashboardRes, applicationsRes, notificationsRes, jobsRes] = await Promise.all([
          API.get('/student/dashboard'),
          API.get('/student/applications'),
          API.get('/student/notifications'),
          API.get('/student/jobs')
        ])

        setDashboard(dashboardRes.data)
        setApplications(applicationsRes.data)
        setNotifications(notificationsRes.data.notifications || [])
        setUnreadCount(notificationsRes.data.unreadCount || 0)
        setJobs(jobsRes.data || [])

        // Populate applied jobs set
        const appliedIds = new Set(applicationsRes.data.map(app => app.job.id || app.job._id))
        setAppliedJobs(appliedIds)

      } catch (error) {
        console.error('Error loading student dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const handleApply = async (jobId) => {
    try {
      await API.post(`/student/jobs/${jobId}/apply`)
      setAppliedJobs(prev => new Set([...prev, jobId]))
      // Optionally refresh applications
    } catch (err) {
      console.error('Failed to apply:', err.message)
      alert(err.response?.data?.message || 'Failed to apply')
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await API.put(`/student/notifications/${notificationId}/read`)
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const chartColors = ['#FF8A80', '#80D8FF', '#FFD180', '#A7FFEB', '#FFD6A5']

  if (loading) return (
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

  const applicationsData = [
    { name: 'Applied', value: dashboard?.totalApplications || 0 },
    { name: 'Shortlisted', value: dashboard?.shortlisted || 0 },
    { name: 'Rejected', value: dashboard?.rejected || 0 },
  ]

  const skillsData = dashboard?.skills?.map(skill => ({ name: skill, value: 1 })) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100">
      <Navbar />
      <div className="flex">
        <Sidebar activeTab="dashboard" />
        <div className="flex-1 p-6 md:p-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-black">
                  Welcome back, <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                    {dashboard?.name || user?.name || 'Student'}
                  </span>
                </h1>
                <p className="text-gray-600 text-lg mt-2">Track your career journey and opportunities</p>
              </div>
            </div>
          </motion.div>

          {/* Top Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <GlassCard glow delay={0.1} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Applications</p>
                  <p className="text-3xl font-black text-purple-600">{dashboard?.totalApplications || 0}</p>
                </div>
                <div className="text-4xl">📋</div>
              </div>
            </GlassCard>

            <GlassCard glow delay={0.2} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Skills</p>
                  <p className="text-3xl font-black text-pink-600">{dashboard?.skills?.length || 0}</p>
                </div>
                <div className="text-4xl">⭐</div>
              </div>
            </GlassCard>

            <GlassCard glow delay={0.3} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Shortlisted</p>
                  <p className="text-3xl font-black text-green-600">{dashboard?.shortlisted || 0}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </GlassCard>

            <GlassCard glow delay={0.4} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Profile</p>
                  <p className="text-3xl font-black text-blue-600">{dashboard?.profileCompletion || 0}%</p>
                </div>
                <div className="text-4xl">🎯</div>
              </div>
            </GlassCard>
          </div>

          {/* Profile Completion Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full">
                  <Target className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Profile Completion</h3>
                  <p className="text-sm text-gray-600">Complete your profile to get better job matches</p>
                </div>
              </div>
              <p className="text-2xl font-black text-purple-600">{dashboard?.profileCompletion || 0}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${dashboard?.profileCompletion || 0}%` }}
                transition={{ delay: 0.3, duration: 1 }}
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
              />
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* AI Recommendations Widget - Take full width on top */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3"
            >
              <RecommendationWidget />
            </motion.div>
            {/* Notifications Section */}
            {notifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2"
              >
                <GradientCard gradient="from-blue-500 via-cyan-500 to-teal-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Mail className="text-blue-600" size={28} />
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Job Opportunities</h2>
                        {unreadCount > 0 && (
                          <p className="text-sm text-gray-600">{unreadCount} new notifications</p>
                        )}
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold"
                      >
                        {unreadCount} new
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {notifications.slice(0, 5).map((notification, idx) => (
                      <motion.div
                        key={notification._id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-4 rounded-xl border-2 backdrop-blur-sm transition-all ${notification.isRead
                          ? 'bg-gray-50/50 border-gray-200'
                          : 'bg-blue-50/50 border-blue-300 shadow-md'
                          }`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {notification.job?.title} <span className="text-blue-600">@{notification.job?.company}</span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span>{notification.job?.location}</span>
                              <span>•</span>
                              <span className="font-bold text-blue-600">{notification.matchPercentage}% match</span>
                            </div>
                          </div>
                          {!notification.isRead && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="px-3 py-1 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700 whitespace-nowrap"
                            >
                              Mark Read
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {notifications.length > 5 && (
                    <motion.button
                      whileHover={{ x: 4 }}
                      onClick={() => window.location.href = '/student/notifications'}
                      className="mt-4 w-full py-2 text-center text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      View all {notifications.length} notifications <ArrowRight size={16} />
                    </motion.button>
                  )}
                </GradientCard>
              </motion.div>
            )}

            {/* Skills Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={notifications.length > 0 ? '' : 'lg:col-span-3'}
            >
              <GradientCard gradient="from-emerald-500 via-teal-500 to-cyan-500">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="text-emerald-600" size={28} />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Your Skills</h2>
                    <p className="text-sm text-gray-600">{dashboard?.skills?.length || 0} skills added</p>
                  </div>
                </div>

                {dashboard?.skills && dashboard.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {dashboard.skills.slice(0, showAllSkills ? undefined : 8).map((skill, idx) => (
                      <AnimatedBadge
                        key={idx}
                        text={skill}
                        variant="skill"
                        icon="✨"
                      />
                    ))}
                    {!showAllSkills && dashboard.skills.length > 8 && (
                      <AnimatedBadge
                        text={`+${dashboard.skills.length - 8} more`}
                        variant="tag"
                        onClick={() => setShowAllSkills(true)}
                        className="hover:bg-gray-400"
                      />
                    )}
                    {showAllSkills && dashboard.skills.length > 8 && (
                      <AnimatedBadge
                        text="Show Less"
                        variant="tag"
                        onClick={() => setShowAllSkills(false)}
                      />
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">Add skills to your profile for better job matches</p>
                )}
              </GradientCard>
            </motion.div>
          </div>

          {/* Active Jobs Section */}
          {jobs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">🔥 Active Jobs</h2>
                <span className="text-sm text-gray-600">{jobs.length} opportunities available</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.slice(0, 4).map((job, idx) => {
                  const isApplied = appliedJobs.has(job._id)
                  const matchPercent = job.studentMatch?.matchPercentage ?? 0

                  return (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <GradientCard
                        gradient="from-emerald-500 via-teal-500 to-green-500"
                        className="h-full flex flex-col"
                      >
                        {/* Top Section */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                              <span className="font-semibold text-emerald-600">{job.company}</span>
                              {job.location && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <MapPin size={16} />
                                    {job.location}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Match Score */}
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="text-center bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 min-w-[80px] shadow-sm border border-emerald-100"
                          >
                            <div className="text-2xl font-bold text-emerald-600">
                              {matchPercent}%
                            </div>
                            <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-800/60">Match</div>
                          </motion.div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed flex-1">
                          {job.description}
                        </p>

                        {/* Skills Section */}
                        {(job.skillsRequired?.length > 0 || job.studentMatch?.matched_skills?.length > 0) && (
                          <div className="mb-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                            <div className="flex flex-wrap gap-2">
                              {job.studentMatch?.matched_skills?.slice(0, 3).map((skill, idx) => (
                                <AnimatedBadge
                                  key={`matched-${idx}`}
                                  text={skill}
                                  variant="skill"
                                  icon="✓"
                                />
                              ))}
                              {/* Fallback to simple skills if matched_skills not available */}
                              {(!job.studentMatch?.matched_skills || job.studentMatch.matched_skills.length === 0) &&
                                job.skillsRequired?.slice(0, 3).map((skill, idx) => (
                                  <AnimatedBadge
                                    key={`req-${idx}`}
                                    text={skill}
                                    variant="tag"
                                  />
                                ))}


                              {(job.skillsRequired?.length > 3) && (
                                <AnimatedBadge
                                  text={`+${job.skillsRequired.length - 3}`}
                                  variant="tag"
                                />
                              )}
                            </div>
                          </div>
                        )}

                        {/* Bottom Section */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedJob(job)}
                            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-2"
                          >
                            Details
                          </motion.button>

                          <motion.button
                            whileHover={!isApplied ? { scale: 1.05 } : {}}
                            whileTap={!isApplied ? { scale: 0.95 } : {}}
                            onClick={() => handleApply(job._id)}
                            disabled={isApplied}
                            className={`
                            px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md
                            ${isApplied
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-200'
                              }
                          `}
                          >
                            {isApplied ? 'Applied' : 'Apply Now'}
                          </motion.button>
                        </div>
                      </GradientCard>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Applications Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="text-orange-600" size={28} />
                <h3 className="text-xl font-bold text-gray-900">Applications Status</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={applicationsData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={1} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255,255,255,0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="url(#colorGrad)" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Skills Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <Award className="text-indigo-600" size={28} />
                <h3 className="text-xl font-bold text-gray-900">Skills Overview</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={skillsData.length > 0 ? skillsData : [{ name: 'No Skills', value: 1 }]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                  >
                    {(skillsData.length > 0 ? skillsData : []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255,255,255,0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
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
              {selectedJob.skillsRequired?.length > 0 && (
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
              )}

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

    </div>
  )
}

export default StudentDashboard
