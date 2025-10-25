import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../../components/Navbar'
import OwnerSidebar from '../../components/OwnerSidebar'
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
  Legend
} from 'recharts'

export default function OwnerDashboard() {
  const [stats, setStats] = useState(null)
  const [recentJobs, setRecentJobs] = useState([])
  const [recentStudents, setRecentStudents] = useState([])
  const [skillData, setSkillData] = useState([])
  const [userGrowth, setUserGrowth] = useState([])

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  useEffect(() => {
    fetchStats()
    fetchRecentData()
    fetchSkillInsights()
    fetchUserGrowth()
  }, [])

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/owner/dashboard')
      setStats(data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchRecentData = async () => {
    try {
      const jobsRes = await axios.get('/api/owner/jobs?limit=5')
      const studentsRes = await axios.get('/api/owner/students?limit=5')
      setRecentJobs(jobsRes.data)
      setRecentStudents(studentsRes.data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchSkillInsights = async () => {
    try {
      const { data } = await axios.get('/api/owner/skill-insights')
      setSkillData(data)
    } catch (error) {
      console.error('Error fetching skill insights:', error)
      // fallback demo data
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
      const { data } = await axios.get('/api/owner/user-growth')
      setUserGrowth(data)
    } catch (error) {
      console.error('Error fetching user growth:', error)
      // fallback demo data
      setUserGrowth([
        { month: 'Jan', users: 100 },
        { month: 'Feb', users: 160 },
        { month: 'Mar', users: 240 },
        { month: 'Apr', users: 310 },
        { month: 'May', users: 450 },
        { month: 'Jun', users: 600 }
      ])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        <OwnerSidebar />

        <div className="flex-1 p-6 space-y-8">
          <header>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">AI-powered insights and performance overview</p>
          </header>

          {/* === Summary Cards === */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <p className="text-sm text-gray-600">Total Students</p>
                <h2 className="text-2xl font-bold text-blue-600">{stats.totalStudents}</h2>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600">Total Colleges</p>
                <h2 className="text-2xl font-bold text-green-600">{stats.totalColleges}</h2>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600">Total Jobs</p>
                <h2 className="text-2xl font-bold text-yellow-600">{stats.totalJobs}</h2>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600">Active Jobs</p>
                <h2 className="text-2xl font-bold text-purple-600">{stats.activeJobs}</h2>
              </div>
            </div>
          )}

          {/* === Charts === */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-3">User Growth (Monthly)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Skill Insights Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-3">Top Skills in Demand</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={skillData}
                    dataKey="count"
                    nameKey="skill"
                    outerRadius={120}
                    label
                  >
                    {skillData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* === Recent Activity === */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Jobs */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-3">Recent Opportunities</h3>
              {recentJobs.map((job) => (
                <div key={job._id} className="border rounded-lg p-3 mb-2">
                  <h4 className="font-medium text-gray-900">{job.title}</h4>
                  <p className="text-sm text-gray-600">{job.company}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      job.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {job.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>

            {/* Recent Students */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-3">Recent Students</h3>
              {recentStudents.map((s) => (
                <div key={s._id} className="border rounded-lg p-3 mb-2">
                  <h4 className="font-medium text-gray-900">{s.name}</h4>
                  <p className="text-sm text-gray-600">{s.email}</p>
                  <p className="text-xs text-gray-500">{s.college || 'N/A'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
