
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import Navbar from '../../components/Navbar'
import OwnerSidebar from '../../components/OwnerSidebar'
import GlassCard from '../../components/ui/GlassCard'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts'
import {
  Users,
  School,
  Briefcase,
  Activity,
  TrendingUp,
  Award,
  Calendar,
  Layers,
  Zap,
  ArrowUpRight,
  RefreshCcw,
  LayoutDashboard,
  Target,
  Clock
} from 'lucide-react'

export default function OwnerDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentJobs, setRecentJobs] = useState([])
  const [recentStudents, setRecentStudents] = useState([])
  const [recentColleges, setRecentColleges] = useState([])
  const [skillData, setSkillData] = useState([])
  const [userGrowth, setUserGrowth] = useState([])
  const [timeframe, setTimeframe] = useState('6M')
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const COLORS = ['#9333ea', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b']

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchStats(),
        fetchRecentData(),
        fetchSkillInsights(),
        fetchUserGrowth()
      ])
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/owner/dashboard')
      setStats(data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchRecentData = async () => {
    try {
      const [jobsRes, studentsRes, collegesRes] = await Promise.all([
        API.get('/owner/jobs?limit=5'),
        API.get('/owner/students?limit=5'),
        API.get('/owner/colleges?limit=5')
      ])
      setRecentJobs(jobsRes.data)
      setRecentStudents(studentsRes.data)
      setRecentColleges(collegesRes.data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchSkillInsights = async () => {
    try {
      const { data } = await API.get('/owner/skill-insights')
      setSkillData(data)
    } catch (error) {
      console.error('Error fetching skill insights:', error)
      setSkillData([
        { skill: 'React', count: 120 },
        { skill: 'Python', count: 90 },
        { skill: 'Node.js', count: 70 },
        { skill: 'SQL', count: 60 },
        { skill: 'Java', count: 50 }
      ])
    }
  }

  const fetchUserGrowth = async () => {
    try {
      const { data } = await API.get('/owner/user-growth')
      // Local filtering based on timeframe if API doesn't support it yet
      const filtered = timeframe === '6M' ? data.slice(-6) : data
      setUserGrowth(filtered)
    } catch (error) {
      console.error('Error fetching user growth:', error)
      const mockData = [
        { month: 'Jan', users: 100 },
        { month: 'Feb', users: 160 },
        { month: 'Mar', users: 240 },
        { month: 'Apr', users: 310 },
        { month: 'May', users: 450 },
        { month: 'Jun', users: 600 }
      ]
      setUserGrowth(timeframe === '6M' ? mockData : [...mockData, ...mockData])
    }
  }

  // Refetch growth chart when timeframe changes
  useEffect(() => {
    fetchUserGrowth()
  }, [timeframe])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  const getRelativeTime = (date) => {
    const diff = Math.floor((new Date() - date) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return date.toLocaleTimeString()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex pt-16 h-screen overflow-hidden">
        <OwnerSidebar />

        <main className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Admin Dashboard
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-500 font-medium">Platform performance and ecosystem overview</p>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1">
                  <Clock size={10} /> Last updated: {getRelativeTime(lastUpdated)}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchAllData}
              className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-bold rounded-2xl border border-purple-100 shadow-lg shadow-purple-500/5 hover:bg-purple-50 transition-all"
            >
              <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
              Refresh Data
            </motion.button>
          </motion.div>

          {/* Core Stats Overview */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { title: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'purple', sub: `${stats?.newStudentsToday || 0} Joined Today`, path: '/owner/users' },
              { title: 'Partner Colleges', value: stats?.totalColleges || 0, icon: School, color: 'pink', sub: `${stats?.pendingColleges || 0} Awaiting Approval`, path: '/owner/departments' },
              { title: 'Open Opportunities', value: stats?.totalJobs || 0, icon: Briefcase, color: 'blue', sub: `${stats?.activeJobs || 0} currently active`, path: '/owner/opportunities' },
              { title: 'Market Liquidity', value: stats?.totalApplications || 0, icon: Activity, color: 'green', sub: 'Total job applications', path: '/owner/reports' }
            ].map((card, i) => (
              <motion.div key={i} variants={itemVariants} onClick={() => navigate(card.path)} className="cursor-pointer">
                <GlassCard glow className="p-6 border-white/50 group h-full hover:border-purple-200 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl bg-${card.color}-100/50 group-hover:scale-110 transition-transform duration-300`}>
                      <card.icon className={`text-${card.color}-600`} size={24} />
                    </div>
                    <ArrowUpRight className="text-slate-300 group-hover:text-purple-500 transition-colors" size={20} />
                  </div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{card.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-slate-900">
                      {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                    </p>
                  </div>
                  <p className={`text-[10px] font-black mt-2 text-${card.color}-600/70 uppercase tracking-wider`}>{card.sub}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Growth Chart */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2"
            >
              <GlassCard className="p-8 border-white/60 h-full" glow={false}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <TrendingUp size={20} className="text-purple-600" /> Ecosystem Growth
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Monthly user registration analytics</p>
                  </div>
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold py-2 px-4 rounded-xl focus:outline-none cursor-pointer"
                  >
                    <option value="6M">Last 6 Months</option>
                    <option value="1Y">Last Year</option>
                  </select>
                </div>

                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={userGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#9333ea" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '16px',
                          border: 'none',
                          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                          padding: '12px'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="users"
                        stroke="#9333ea"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorUsers)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </motion.div>

            {/* Skill Distribution */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <GlassCard className="p-8 border-white/60 h-full" glow={false}>
                <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <Target size={20} className="text-pink-600" /> Skill Demand
                </h3>
                <p className="text-xs text-slate-400 font-medium mb-8">Trending Student Proficiencies</p>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={skillData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="count"
                        stroke="none"
                      >
                        {skillData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: '16px',
                          border: 'none',
                          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 space-y-2">
                  {skillData.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        <span className="text-sm font-bold text-slate-600">{item.skill}</span>
                      </div>
                      <span className="text-xs font-black text-slate-400">{item.count} users</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Bottom Grid: Recent Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8">
            {/* Recent Jobs */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <GlassCard className="p-6 border-white/60 border-t-4 border-t-purple-500" glow={false}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Briefcase size={18} className="text-purple-600" /> Recent Opportunities
                  </h3>
                  <button
                    onClick={() => navigate('/owner/opportunities')}
                    className="text-[10px] font-bold uppercase text-purple-600 hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentJobs.length > 0 ? recentJobs.map((job, idx) => (
                    <div key={idx} className="group cursor-pointer" onClick={() => navigate('/owner/opportunities')}>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-purple-600 transition-colors">{job.title}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{job.company}</span>
                        <span className="text-[10px] text-purple-500 font-black">{job.jobType}</span>
                      </div>
                    </div>
                  )) : <p className="text-xs text-slate-400">No recent jobs found</p>}
                </div>
              </GlassCard>
            </motion.div>

            {/* Recent Students */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
              <GlassCard className="p-6 border-white/60 border-t-4 border-t-pink-500" glow={false}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Users size={18} className="text-pink-600" /> Recent Students
                  </h3>
                  <button
                    onClick={() => navigate('/owner/users')}
                    className="text-[10px] font-bold uppercase text-pink-600 hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentStudents.length > 0 ? recentStudents.map((stu, idx) => (
                    <div key={idx} className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/owner/users')}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center font-black text-xs text-purple-600 group-hover:scale-110 transition-transform">
                        {stu.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-none group-hover:text-pink-600 transition-colors">{stu.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{stu.college || 'Career Bridge'}</p>
                      </div>
                      <div className="ml-auto flex gap-1">
                        {stu.skills?.slice(0, 2).map((s, i) => (
                          <span key={i} className="text-[8px] px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded-md font-black uppercase">{s}</span>
                        ))}
                      </div>
                    </div>
                  )) : <p className="text-xs text-slate-400">No recent students found</p>}
                </div>
              </GlassCard>
            </motion.div>

            {/* Partner Colleges */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
              <GlassCard className="p-6 border-white/60 border-t-4 border-t-indigo-500" glow={false}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <School size={18} className="text-indigo-600" /> Partner Colleges
                  </h3>
                  <button
                    onClick={() => navigate('/owner/departments')}
                    className="text-[10px] font-bold uppercase text-indigo-600 hover:underline"
                  >
                    Monitor
                  </button>
                </div>
                <div className="space-y-4">
                  {recentColleges.length > 0 ? recentColleges.map((col, idx) => (
                    <div key={idx} className="flex flex-col gap-1 p-3 rounded-xl bg-slate-50/50 hover:bg-white transition-all border border-transparent hover:border-slate-100 cursor-pointer group" onClick={() => navigate('/owner/departments')}>
                      <p className="text-sm font-bold text-slate-800 leading-none group-hover:text-indigo-600">{col.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${col.isApproved ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{col.isApproved ? 'Verified Partner' : 'Verification Pending'}</span>
                        </div>
                        <ArrowUpRight size={12} className="text-slate-200 group-hover:text-indigo-400" />
                      </div>
                    </div>
                  )) : <p className="text-xs text-slate-400">No partner colleges found</p>}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
