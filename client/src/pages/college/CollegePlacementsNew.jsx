import React, { useState } from 'react'
import { FaBriefcase, FaUsers, FaChartBar, FaBuilding, FaSearch, FaFilter, FaUserTie } from 'react-icons/fa'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']

const CollegePlacementsNew = ({ students, updatePlacementStatus, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [companyFilter, setCompanyFilter] = useState('all')

  const placedStudents = students.filter((s) => s.isPlaced)
  const unplacedStudents = students.filter((s) => !s.isPlaced)

  // Unique companies
  const companies = [...new Set(placedStudents.map((s) => s.placedCompany).filter(Boolean))]

  // Company stats
  const companyData = companies.map((company) => ({
    name: company,
    count: placedStudents.filter((s) => s.placedCompany === company).length
  })).sort((a, b) => b.count - a.count)

  const filteredPlaced = placedStudents.filter((student) => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.placedCompany?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCompany = companyFilter === 'all' || student.placedCompany === companyFilter

    return matchesSearch && matchesCompany
  })

  const stats = {
    total: students.length,
    placed: placedStudents.length,
    unplaced: unplacedStudents.length,
    placementRate: students.length ? Math.round((placedStudents.length / students.length) * 100) : 0,
    averagePackage: (placedStudents.reduce((sum, s) => sum + (s.package || 0), 0) / placedStudents.length) || 0
  }

  const pieData = [
    { name: 'Placed', value: stats.placed, color: '#10B981' },
    { name: 'Unplaced', value: stats.unplaced, color: '#EF4444' }
  ]

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
          <FaBriefcase className="text-blue-600" /> Placement Tracking
        </h1>
        <p className="text-gray-600 mt-2">Monitor and manage student placements</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FaUsers className="text-3xl text-blue-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Placed</p>
              <p className="text-2xl font-bold text-green-600">{stats.placed}</p>
            </div>
            <FaUserTie className="text-3xl text-green-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Unplaced</p>
              <p className="text-2xl font-bold text-red-600">{stats.unplaced}</p>
            </div>
            <FaUsers className="text-3xl text-red-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Placement Rate</p>
              <p className="text-2xl font-bold text-purple-600">{stats.placementRate}%</p>
            </div>
            <FaChartBar className="text-3xl text-purple-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Companies</p>
              <p className="text-2xl font-bold text-amber-600">{companies.length}</p>
            </div>
            <FaBuilding className="text-3xl text-amber-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Placement Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Placement Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} students`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Companies */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Recruiting Companies</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={companyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Placed Students Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FaUserTie className="text-green-600" /> Placed Students ({filteredPlaced.length})
        </h2>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Companies</option>
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Company</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Skills</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPlaced.map((student) => (
                <tr key={student._id} className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      {student.placedCompany}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {student.skills?.slice(0, 3).map((skill, i) => (
                        <span key={i} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                          {skill}
                        </span>
                      ))}
                      {student.skills?.length > 3 && (
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          +{student.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => updatePlacementStatus(student._id, false)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                    >
                      Unmark
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unplaced Students */}
      {unplacedStudents.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FaUsers className="text-red-600" /> Unplaced Students ({unplacedStudents.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unplacedStudents.slice(0, 8).map((student) => (
              <div key={student._id} className="p-4 border border-red-200 rounded-lg">
                <p className="font-medium text-gray-900">{student.name}</p>
                <p className="text-sm text-gray-600">{student.email}</p>
                <p className="text-xs text-gray-500 mt-1">Grad: {student.graduationYear}</p>
                <button
                  onClick={() => {
                    const company = prompt('Enter company name:')
                    if (company) updatePlacementStatus(student._id, true, company)
                  }}
                  className="mt-3 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                >
                  Mark Placed
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CollegePlacementsNew
