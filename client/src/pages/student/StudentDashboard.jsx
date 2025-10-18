import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching applications from backend
    setTimeout(() => {
      setApplications([
        { id: 1, title: 'Frontend Developer' },
        { id: 2, title: 'Backend Engineer' },
        { id: 3, title: 'Data Analyst Intern' },
      ])
      setLoading(false)
    }, 500)
  }, [])

  // Use dynamic data from user if available
  const applicationsData = [
    { name: 'Applied', value: applications.length },
    { name: 'Shortlisted', value: Math.floor(applications.length / 3) },
    { name: 'Rejected', value: Math.floor(applications.length / 3) },
  ]

  const skillsData = (user?.skills || []).map((skill, index) => ({
    name: skill,
    value: 1, // Each skill counts as 1 for chart
  }))

  const chartColors = ['#FF8A80', '#80D8FF', '#FFD180', '#A7FFEB', '#FFD6A5']

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex">
        <Sidebar activeTab="dashboard" />

        <div className="flex-1 p-6">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100 text-purple-900 rounded-xl p-10 mb-8 shadow-lg">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 animate-fadeIn">
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <p className="text-purple-700 text-lg mb-6 animate-fadeIn delay-100">
              Here's a quick snapshot of your career journey and progress.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white text-purple-900 rounded-xl p-6 shadow-md flex flex-col items-center transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300 animate-fadeIn delay-200">
                <p className="text-sm font-semibold uppercase tracking-wide">Applications</p>
                <p className="text-3xl font-bold mt-2">{applications.length}</p>
              </div>
              <div className="bg-white text-purple-900 rounded-xl p-6 shadow-md flex flex-col items-center transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300 animate-fadeIn delay-300">
                <p className="text-sm font-semibold uppercase tracking-wide">Skills</p>
                <p className="text-3xl font-bold mt-2">{user?.skills?.length || 0}</p>
              </div>
              <div className="bg-white text-purple-900 rounded-xl p-6 shadow-md flex flex-col items-center transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300 animate-fadeIn delay-400">
                <p className="text-sm font-semibold uppercase tracking-wide">Profile Completion</p>
                <p className="text-3xl font-bold mt-2">
                  {user?.profileCompletion || 85}%
                </p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-xl p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Applications Status</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={applicationsData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {applicationsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white shadow-md rounded-xl p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills Overview</h2>
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
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
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
