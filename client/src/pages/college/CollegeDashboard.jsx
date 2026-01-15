import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import CollegeSidebar from '../../components/CollegeSidebar'
import Navbar from '../../components/Navbar'
import { useNavigate, Routes, Route } from 'react-router-dom'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts'
import { motion } from "framer-motion";
import GlassCard from "../../components/ui/GlassCard";
import GradientCard from "../../components/ui/GradientCard";
import {
  FaGraduationCap,
  FaUsers,
  FaBriefcase,
  FaTrophy,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaBell,
  FaCog,
  FaAward,
  FaBuilding
} from 'react-icons/fa'
import API from '../../api/axios'

// Import feature pages
import CollegeStudents from './CollegeStudents'
import CollegeStatistics from './CollegeStatistics'
import CollegePlacements from './CollegePlacements'
import CollegeProfile from './CollegeProfile'
import CollegeJobs from './CollegeJobs'

// Removed unused StatCard component

const CollegeDashboard = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const notificationRef = useRef(null)

  useEffect(() => {
    if (!authLoading) {
      if (user?.role === 'college') {
        fetchDashboardData()
      } else if (user) {
        navigate(`/${user?.role}/dashboard`)
      }
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsRes, studentsRes, notificationsRes] = await Promise.all([
        API.get('/college/statistics'),
        API.get('/college/students'),
        API.get('/college/notifications').catch(() => ({ data: [] }))
      ])

      setStats(statsRes.data)
      setStudents(studentsRes.data || [])
      setNotifications(notificationsRes.data || [])
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const updatePlacementStatus = async (studentId, isPlaced, placedCompany = '') => {
    try {
      await API.put(`/college/students/${studentId}/placement`, { isPlaced, placedCompany })
      fetchDashboardData()
      alert('✅ Placement status updated successfully!')
    } catch (err) {
      alert('❌ Error updating placement status')
      console.error(err)
    }
  }

  // === Dashboard Home Content ===
  const DashboardHome = () => {
    const skillsData = stats?.topSkills?.slice(0, 8).map(s => ({
      name: s.skill,
      count: s.count
    })) || []

    const yearData = stats?.yearDistribution
      ? Object.entries(stats.yearDistribution).map(([year, count]) => ({
        year,
        students: count
      }))
      : []

    const statistics = stats
    const dropdownRef = useRef(null)

    return (
      <div className="p-6 md:p-8 min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">
              Welcome back, <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                {user?.name || 'College Admin'}!
              </span>
            </h1>
            <p className="text-gray-600 text-lg mt-2">Manage your institution's performance and placements</p>
          </div>

          {/* Notification Bell */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative bg-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
            >
              <FaBell className="text-purple-600 text-xl" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                  {notifications.length}
                </span>
              )}
            </motion.button>

            {/* Dropdown Panel */}
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <p className="font-bold text-gray-800">Notifications</p>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Close
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                      <FaBell className="text-2xl mb-2 opacity-20" />
                      <p className="text-sm">No new notifications</p>
                    </div>
                  ) : (
                    notifications.map((note, i) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i}
                        className="p-4 border-b last:border-none hover:bg-purple-50/50 transition flex gap-3 group cursor-pointer"
                      >
                        <div className="mt-1 p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                          {note.icon === '🔔' ? <FaBell /> : note.icon === '💼' ? <FaBriefcase /> : <FaChartLine />}
                        </div>
                        <div>
                          <p className="text-gray-800 text-sm font-medium leading-snug">{note.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(note.createdAt).toLocaleDateString()}</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Summary Cards */}
        {statistics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <GlassCard glow delay={0.1} className="h-full">
              <div className="flex items-center justify-between p-6 h-full">
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Total Students</p>
                  <p className="text-4xl font-black text-gray-900 leading-none">{statistics.totalStudents}</p>
                </div>
                <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl shadow-inner">
                  <FaUsers className="text-2xl" />
                </div>
              </div>
            </GlassCard>

            <GlassCard glow delay={0.2} className="h-full">
              <div className="flex items-center justify-between p-6 h-full">
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Placed</p>
                  <p className="text-4xl font-black text-pink-600 leading-none">{statistics.placedStudents}</p>
                </div>
                <div className="p-4 bg-pink-100 text-pink-600 rounded-2xl shadow-inner">
                  <FaBriefcase className="text-2xl" />
                </div>
              </div>
            </GlassCard>

            <GlassCard glow delay={0.3} className="h-full">
              <div className="flex items-center justify-between p-6 h-full">
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Placement Rate</p>
                  <p className="text-4xl font-black text-green-600 leading-none">{statistics.placementRate}%</p>
                </div>
                <div className="p-4 bg-green-100 text-green-600 rounded-2xl shadow-inner">
                  <FaChartLine className="text-2xl" />
                </div>
              </div>
            </GlassCard>

            <GlassCard glow delay={0.4} className="h-full">
              <div className="flex items-center justify-between p-6 h-full">
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Unplaced</p>
                  <p className="text-4xl font-black text-blue-600 leading-none">{statistics.unplacedStudents}</p>
                </div>
                <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl shadow-inner">
                  <FaBuilding className="text-2xl" />
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {statistics && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    <FaChartLine size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Placement Distribution</h3>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Placed", value: statistics.placedStudents, color: "#10B981" },
                          { name: "Unplaced", value: statistics.unplacedStudents, color: "#F43F5E" }
                        ]}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {[
                          { name: "Placed", value: statistics.placedStudents, color: "#10B981" },
                          { name: "Unplaced", value: statistics.unplacedStudents, color: "#F43F5E" }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(255,255,255,0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          padding: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <FaGraduationCap size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Top Skills</h3>
                </div>

                <div className="space-y-4">
                  {statistics.topSkills?.slice(0, 5).map((skill, i) => (
                    <div key={i} className="group">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-700">{skill.skill}</span>
                        <span className="text-sm text-gray-500 font-medium">{skill.count} students</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(skill.count / statistics.totalStudents) * 100}%` }}
                          transition={{ duration: 1, delay: 0.1 * i }}
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                  {(!statistics.topSkills || statistics.topSkills.length === 0) && (
                    <p className="text-gray-500 text-center py-8">No skills data available yet.</p>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="px-8 pt-8 pb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/college/students')}
              className="bg-gradient-to-br from-purple-600 to-purple-800 hover:shadow-xl text-white rounded-2xl p-6 text-left transition-all transform hover:scale-105 border border-white/20"
            >
              <FaUsers className="text-3xl mb-3" />
              <p className="font-bold text-xl">Students</p>
              <p className="text-sm opacity-80">View all student records</p>
            </button>
            <button
              onClick={() => navigate('/college/statistics')}
              className="bg-gradient-to-br from-pink-500 to-pink-700 hover:shadow-xl text-white rounded-2xl p-6 text-left transition-all transform hover:scale-105 border border-white/20"
            >
              <FaChartLine className="text-3xl mb-3" />
              <p className="font-bold text-xl">Statistics</p>
              <p className="text-sm opacity-80">Portal-wide analytics</p>
            </button>
            <button
              onClick={() => navigate('/college/placements')}
              className="bg-gradient-to-br from-blue-500 to-blue-700 hover:shadow-xl text-white rounded-2xl p-6 text-left transition-all transform hover:scale-105 border border-white/20"
            >
              <FaTrophy className="text-3xl mb-3" />
              <p className="font-bold text-xl">Placements</p>
              <p className="text-sm opacity-80">Placement tracker</p>
            </button>
            <button
              onClick={() => navigate('/college/profile')}
              className="bg-gradient-to-br from-amber-500 to-amber-700 hover:shadow-xl text-white rounded-2xl p-6 text-left transition-all transform hover:scale-105 border border-white/20"
            >
              <FaCog className="text-3xl mb-3" />
              <p className="font-bold text-xl">Settings</p>
              <p className="text-sm opacity-80">Profile information</p>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex">
        <CollegeSidebar />

        <div className="flex-1 overflow-auto">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route
              path="students"
              element={
                <CollegeStudents
                  students={students}
                  updatePlacementStatus={updatePlacementStatus}
                  loading={loading}
                  onRefresh={fetchDashboardData}
                />
              }
            />
            <Route
              path="statistics"
              element={<CollegeStatistics statistics={stats} students={students} />}
            />
            <Route
              path="placements"
              element={
                <CollegePlacements
                  students={students}
                  updatePlacementStatus={updatePlacementStatus}
                  onRefresh={fetchDashboardData}
                />
              }
            />
            <Route path="jobs" element={<CollegeJobs />} />
            <Route path="profile" element={<CollegeProfile user={user} onUpdate={fetchDashboardData} />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default CollegeDashboard
