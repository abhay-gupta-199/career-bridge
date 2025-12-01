import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import API from '../../api/axios'
import { motion } from 'framer-motion'
import { TrendingUp, BookOpen, Target, Mail, Award, ArrowRight } from 'lucide-react'
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
      } catch (error) {
        console.error('Error loading student dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

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
            <GlassCard glow delay={0.1}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Applications</p>
                  <p className="text-3xl font-black text-purple-600">{dashboard?.totalApplications || 0}</p>
                </div>
                <div className="text-4xl">📋</div>
              </div>
            </GlassCard>

            <GlassCard glow delay={0.2}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Skills</p>
                  <p className="text-3xl font-black text-pink-600">{dashboard?.skills?.length || 0}</p>
                </div>
                <div className="text-4xl">⭐</div>
              </div>
            </GlassCard>

            <GlassCard glow delay={0.3}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Shortlisted</p>
                  <p className="text-3xl font-black text-green-600">{dashboard?.shortlisted || 0}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </GlassCard>

            <GlassCard glow delay={0.4}>
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
                        className={`p-4 rounded-xl border-2 backdrop-blur-sm transition-all ${
                          notification.isRead
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
                    {dashboard.skills.slice(0, 8).map((skill, idx) => (
                      <AnimatedBadge
                        key={idx}
                        text={skill}
                        variant="skill"
                        icon="✨"
                      />
                    ))}
                    {dashboard.skills.length > 8 && (
                      <AnimatedBadge
                        text={`+${dashboard.skills.length - 8} more`}
                        variant="tag"
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
                {jobs.slice(0, 4).map((job, idx) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="bg-white/80 backdrop-blur-xl rounded-xl p-5 border border-white/50 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-purple-600 font-semibold">{job.company}</p>
                      </div>
                      {job.jobType && (
                        <AnimatedBadge text={job.jobType} variant="status" />
                      )}
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{job.description}</p>

                    {job.skillsRequired && job.skillsRequired.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {job.skillsRequired.slice(0, 3).map((skill, jdx) => (
                          <AnimatedBadge
                            key={jdx}
                            text={skill}
                            variant="tag"
                          />
                        ))}
                        {job.skillsRequired.length > 3 && (
                          <span className="text-xs text-gray-600 font-semibold">
                            +{job.skillsRequired.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
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
    </div>
  )
}

export default StudentDashboard
