import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import API from '../../api/axios' // Use API instance
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

const StudentDashboard = () => {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashboardRes, applicationsRes] = await Promise.all([
          API.get('/student/dashboard'), // token auto-added
          API.get('/student/applications'),
        ])

        setDashboard(dashboardRes.data)
        setApplications(applicationsRes.data)
      } catch (error) {
        console.error('Error loading student dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const chartColors = ['#FF8A80', '#80D8FF', '#FFD180', '#A7FFEB', '#FFD6A5']

  if (loading) return <div className="p-10 text-center text-lg">Loading dashboard...</div>

  const applicationsData = [
    { name: 'Applied', value: dashboard?.totalApplications || 0 },
    { name: 'Shortlisted', value: dashboard?.shortlisted || 0 },
    { name: 'Rejected', value: dashboard?.rejected || 0 },
  ]

  const skillsData =
    dashboard?.skills?.map(skill => ({ name: skill, value: 1 })) || []

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeTab="dashboard" />
        <div className="flex-1 p-6">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100 text-purple-900 rounded-xl p-10 mb-8 shadow-lg">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
              Welcome back, {dashboard?.name || user?.name || 'Student'}!
            </h1>
            <p className="text-purple-700 text-lg mb-6">
              Here’s your career journey overview.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white text-purple-900 rounded-xl p-6 shadow-md flex flex-col items-center">
                <p className="text-sm font-semibold uppercase tracking-wide">
                  Applications
                </p>
                <p className="text-3xl font-bold mt-2">
                  {dashboard?.totalApplications || 0}
                </p>
              </div>

              <div className="bg-white text-purple-900 rounded-xl p-6 shadow-md flex flex-col items-center">
                <p className="text-sm font-semibold uppercase tracking-wide">
                  Skills
                </p>
                <p className="text-3xl font-bold mt-2">
                  {dashboard?.skills?.length || 0}
                </p>
              </div>

              <div className="bg-white text-purple-900 rounded-xl p-6 shadow-md flex flex-col items-center">
                <p className="text-sm font-semibold uppercase tracking-wide">
                  Profile Completion
                </p>
                <p className="text-3xl font-bold mt-2">
                  {dashboard?.profileCompletion || 80}%
                </p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-xl p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Applications Status
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={applicationsData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {applicationsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={chartColors[index % chartColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white shadow-md rounded-xl p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Skills Overview
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={skillsData.length > 0 ? skillsData : [{ name: 'No Skills', value: 1 }]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {(skillsData.length > 0 ? skillsData : [{ name: 'No Skills', value: 1 }]).map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={chartColors[index % chartColors.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
