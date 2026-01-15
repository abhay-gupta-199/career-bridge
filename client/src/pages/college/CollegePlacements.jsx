import React, { useState } from 'react'
import { FaBriefcase, FaUsers, FaChartBar, FaBuilding, FaSearch, FaFilter, FaUserTie } from 'react-icons/fa'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']

const CollegePlacements = ({ students, updatePlacementStatus, onRefresh }) => {
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
    <div className="flex-1 p-6 md:p-8 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 min-h-screen overflow-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
          <FaBriefcase className="text-purple-600" />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Placement Tracking
          </span>
        </h1>
        <p className="text-gray-600 mt-2 text-lg">Monitor and manage student placements</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 flex flex-col items-center text-center group hover:shadow-xl transition-all">
          <FaUsers className="text-3xl text-purple-600 mb-2 opacity-80 group-hover:scale-110 transition-transform" />
          <p className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Total Students</p>
          <p className="text-2xl font-black text-gray-900">{stats.total}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 flex flex-col items-center text-center group hover:shadow-xl transition-all border-b-4 border-b-green-500">
          <FaUserTie className="text-3xl text-green-600 mb-2 opacity-80 group-hover:scale-110 transition-transform" />
          <p className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Placed</p>
          <p className="text-2xl font-black text-green-600">{stats.placed}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 flex flex-col items-center text-center group hover:shadow-xl transition-all border-b-4 border-b-red-500">
          <FaUsers className="text-3xl text-red-600 mb-2 opacity-80 group-hover:scale-110 transition-transform" />
          <p className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Unplaced</p>
          <p className="text-2xl font-black text-red-600">{stats.unplaced}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 flex flex-col items-center text-center group hover:shadow-xl transition-all border-b-4 border-b-purple-500">
          <FaChartBar className="text-3xl text-purple-600 mb-2 opacity-80 group-hover:scale-110 transition-transform" />
          <p className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Rate</p>
          <p className="text-2xl font-black text-purple-600">{stats.placementRate}%</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 flex flex-col items-center text-center group hover:shadow-xl transition-all border-b-4 border-b-amber-500">
          <FaBuilding className="text-3xl text-amber-600 mb-2 opacity-80 group-hover:scale-110 transition-transform" />
          <p className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Companies</p>
          <p className="text-2xl font-black text-amber-600">{companies.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FaChartBar className="text-purple-600" /> Placement Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color === '#10B981' ? '#10B981' : '#EF4444'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`${value} students`, 'Count']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FaBuilding className="text-purple-600" /> Top Recruiting Companies
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={companyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" fill="url(#blueGradientPlacements)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="blueGradientPlacements" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#4F46E5" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FaUserTie className="text-green-600" />
            <span>Placed Students</span>
            <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">{filteredPlaced.length}</span>
          </h2>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative group">
                <FaSearch className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaFilter className="text-gray-400" />
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 appearance-none cursor-pointer"
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
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Skills</th>
                <th className="px-8 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredPlaced.map((student) => (
                <tr key={student._id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{student.name}</span>
                      <span className="text-sm text-gray-500">{student.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="inline-flex items-center px-4 py-1.5 bg-green-100 text-green-700 rounded-xl text-sm font-bold border border-green-200">
                      <FaBuilding className="mr-2 text-xs" /> {student.placedCompany}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-1">
                      {student.skills?.slice(0, 3).map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 text-[10px] bg-purple-100 text-purple-700 rounded-lg font-bold">
                          {skill}
                        </span>
                      ))}
                      {student.skills?.length > 3 && (
                        <span className="px-2 py-0.5 text-[10px] bg-gray-100 text-gray-500 rounded-lg font-bold">
                          +{student.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    <button
                      onClick={() => updatePlacementStatus(student._id, false)}
                      className="text-red-500 hover:text-red-700 text-sm font-bold hover:underline transition-all"
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

      {unplacedStudents.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <FaUsers className="text-red-600" />
            <span>Unplaced Students</span>
            <span className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full">{unplacedStudents.length}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {unplacedStudents.slice(0, 8).map((student) => (
              <div key={student._id} className="p-6 bg-gray-50/50 border border-gray-100 rounded-2xl group hover:border-purple-300 transition-all hover:shadow-lg">
                <p className="font-bold text-gray-900 mb-1">{student.name}</p>
                <p className="text-sm text-gray-500 mb-1">{student.email}</p>
                <p className="text-xs font-bold text-purple-600">Grad: {student.graduationYear}</p>
                <button
                  onClick={() => {
                    const company = prompt('Enter company name:')
                    if (company) updatePlacementStatus(student._id, true, company)
                  }}
                  className="mt-4 w-full py-2 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition shadow-md hover:shadow-lg"
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

export default CollegePlacements
