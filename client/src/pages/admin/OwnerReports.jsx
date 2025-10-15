import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import OwnerSidebar from '../../components/OwnerSidebar'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import axios from 'axios'

export default function OwnerReports() {
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalOpportunities: 0,
    totalSkills: 0
  })
  const [opportunitiesData, setOpportunitiesData] = useState([])
  const [skillsData, setSkillsData] = useState([])

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const summaryRes = await axios.get('/api/owner/reports/summary')
      const oppRes = await axios.get('/api/owner/reports/opportunities')
      const skillsRes = await axios.get('/api/owner/reports/skills')

      setSummary(summaryRes.data)
      setOpportunitiesData(oppRes.data)
      setSkillsData(skillsRes.data)
    } catch (err) {
      console.error('Error fetching reports:', err)
    }
  }

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F']

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Full-width Navbar */}
      <Navbar />

      {/* Sidebar + Main content */}
      <div className="flex flex-1">
        <OwnerSidebar />

        <main className="flex-1 p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate, visualize, and export platform reports</p>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
              <p className="text-2xl font-bold text-gray-900">{summary.totalUsers}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <h2 className="text-lg font-semibold text-gray-700">Total Opportunities</h2>
              <p className="text-2xl font-bold text-gray-900">{summary.totalOpportunities}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <h2 className="text-lg font-semibold text-gray-700">Total Skills</h2>
              <p className="text-2xl font-bold text-gray-900">{summary.totalSkills}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Opportunities per Department</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={opportunitiesData}>
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Skill Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={skillsData}
                    dataKey="value"
                    nameKey="skill"
                    outerRadius={100}
                    fill="#82ca9d"
                    label
                  >
                    {skillsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Export Section */}
          <div className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-gray-700">Export reports:</p>
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Export Users CSV
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Export Opportunities CSV
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
