import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import API from '../../api/axios'
import Navbar from '../../components/Navbar'
import OwnerSidebar from '../../components/OwnerSidebar'
import StudentDetailsModal from '../../components/StudentDetailsModal'
import GlassCard from '../../components/ui/GlassCard'
import SkeletonLoader from '../../components/ui/SkeletonLoader'
import AnimatedBadge from '../../components/ui/AnimatedBadge'
import { Search, Users, Award, TrendingUp, Eye, DownloadCloud, Lock, Unlock } from 'lucide-react'

export default function OwnerUsers() {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [search, setSearch] = useState('')
  const [colleges, setColleges] = useState([])
  const [filteredColleges, setFilteredColleges] = useState([])
  const [collegeSearch, setCollegeSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [stats, setStats] = useState(null)
  const [collegeStats, setCollegeStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  useEffect(() => {
    fetchStudents()
    fetchColleges()
  }, [])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const res = await API.get('/owner/students')
      setStudents(res.data)
      setFilteredStudents(res.data)
      calculateStats(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchColleges = async () => {
    try {
      const res = await API.get('/owner/colleges')
      setColleges(res.data)
      setFilteredColleges(res.data)
      setCollegeStats({
        total: res.data.length,
        active: res.data.filter((c) => !c.isBlocked).length
      })
    } catch (err) {
      console.error(err)
    }
  }

  const calculateStats = (data) => {
    const total = data.length
    const placed = data.filter((s) => s.isPlaced).length
    const active = data.filter((s) => !s.isBlocked).length
    setStats({
      total,
      placed,
      unplaced: total - placed,
      active,
      blocked: total - active,
      placementRate: total ? ((placed / total) * 100).toFixed(1) : 0
    })
  }

  const handleViewDetails = async (student) => {
    try {
      const res = await API.get(`/owner/students/${student._id}/details`)
      setSelectedStudent(res.data)
      setDetailsModalOpen(true)
    } catch (err) {
      alert('Error loading student details')
      console.error(err)
    }
  }

  const handleBlockStatusChange = (updatedStudent) => {
    const updatedStudents = students.map(s => 
      s._id === updatedStudent._id ? updatedStudent : s
    )
    setStudents(updatedStudents)
    setFilteredStudents(updatedStudents)
    calculateStats(updatedStudents)
    setSelectedStudent(updatedStudent)
  }

  const handleExportCSV = async () => {
    try {
      const response = await API.get('/owner/students-export/csv', {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `students-export-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.parentElement.removeChild(link)
    } catch (error) {
      alert('Failed to export CSV')
    }
  }

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setSearch(value)
    filterData(value, filter)
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    filterData(search, newFilter)
  }

  const filterData = (searchValue, filterType) => {
    let result = students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchValue) ||
        s.email.toLowerCase().includes(searchValue)
    )

    if (filterType === 'placed') result = result.filter((s) => s.isPlaced)
    else if (filterType === 'unplaced') result = result.filter((s) => !s.isPlaced)
    else if (filterType === 'blocked') result = result.filter((s) => s.isBlocked)

    setFilteredStudents(result)
  }

  const handleCollegeSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setCollegeSearch(value)
    if (!value) {
      setFilteredColleges(colleges)
      return
    }
    setFilteredColleges(
      colleges.filter(
        (c) =>
          c.name.toLowerCase().includes(value) ||
          c.email.toLowerCase().includes(value)
      )
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <OwnerSidebar />

        <div className="flex-1 p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
              👥 User Management
            </h1>
            <p className="text-gray-300">Monitor, manage, and control all registered students in the platform</p>
          </motion.div>

          {/* Stats Grid */}
          {stats ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
            >
              <GlassCard glow delay={0}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-300 mb-1">Total Students</p>
                    <p className="text-3xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
                      {stats.total}
                    </p>
                  </div>
                  <Users className="text-blue-400 opacity-50" size={40} />
                </div>
              </GlassCard>

              <GlassCard glow delay={0.1}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-300 mb-1">Placed Students</p>
                    <p className="text-3xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
                      {stats.placed}
                    </p>
                  </div>
                  <TrendingUp className="text-green-400 opacity-50" size={40} />
                </div>
              </GlassCard>

              <GlassCard glow delay={0.2}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-300 mb-1">Unplaced</p>
                    <p className="text-3xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                      {stats.unplaced}
                    </p>
                  </div>
                  <Award className="text-yellow-400 opacity-50" size={40} />
                </div>
              </GlassCard>

              <GlassCard glow delay={0.3}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-300 mb-1">Active</p>
                    <p className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                      {stats.active}
                    </p>
                  </div>
                  <Unlock className="text-purple-400 opacity-50" size={40} />
                </div>
              </GlassCard>

              <GlassCard glow delay={0.4}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-300 mb-1">Blocked</p>
                    <p className="text-3xl font-black text-transparent bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text">
                      {stats.blocked}
                    </p>
                  </div>
                  <Lock className="text-red-400 opacity-50" size={40} />
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <SkeletonLoader key={i} type="card" />
              ))}
            </div>
          )}

          {/* Search & Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-4 items-center justify-between"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search by name or email..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-lg"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {['all', 'placed', 'unplaced', 'blocked'].map((f) => (
                <motion.button
                  key={f}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFilterChange(f)}
                  className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                    filter === f
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg shadow-blue-500/50 transition-all"
            >
              <DownloadCloud size={20} />
              Export CSV
            </motion.button>
          </motion.div>

          {/* Students Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 border-b border-white/20">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold text-white">Name</th>
                    <th className="px-6 py-4 text-left font-bold text-white">Email</th>
                    <th className="px-6 py-4 text-left font-bold text-white">College</th>
                    <th className="px-6 py-4 text-left font-bold text-white">Skills</th>
                    <th className="px-6 py-4 text-left font-bold text-white">Status</th>
                    <th className="px-6 py-4 text-right font-bold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8">
                        <div className="flex justify-center">
                          <SkeletonLoader type="list" />
                        </div>
                      </td>
                    </tr>
                  ) : filteredStudents.length > 0 ? (
                    filteredStudents.map((student, idx) => (
                      <motion.tr
                        key={student._id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-white/10 hover:bg-white/5 transition-all"
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold text-white">{student.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-300 text-sm">{student.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-300">{student.college || '—'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {student.skills?.slice(0, 2).map((skill, sidx) => (
                              <span
                                key={sidx}
                                className="px-2 py-1 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-200 text-xs rounded-lg border border-blue-400/30"
                              >
                                {skill}
                              </span>
                            ))}
                            {student.skills?.length > 2 && (
                              <span className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-lg">
                                +{student.skills.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {student.isBlocked && (
                              <AnimatedBadge text="🔒 Blocked" variant="missing" />
                            )}
                            <AnimatedBadge 
                              text={student.isPlaced ? '✓ Placed' : '○ Unplaced'} 
                              variant={student.isPlaced ? 'skill' : 'status'}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewDetails(student)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all inline-flex"
                          >
                            <Eye size={16} />
                            Know More
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <p className="text-gray-400 text-lg">No students found matching your criteria</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Colleges Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1">
                  🎓 Partner Colleges
                </h2>
                <p className="text-gray-300">Connected educational institutions</p>
              </div>
              <div className="relative w-full lg:w-1/3">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  value={collegeSearch}
                  onChange={handleCollegeSearch}
                  placeholder="Search colleges..."
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur-lg"
                />
              </div>
            </div>

            {collegeStats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard glow delay={0}>
                  <div>
                    <p className="text-xs font-semibold text-gray-300 mb-2">Total Colleges</p>
                    <p className="text-3xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
                      {collegeStats.total}
                    </p>
                  </div>
                </GlassCard>
                <GlassCard glow delay={0.1}>
                  <div>
                    <p className="text-xs font-semibold text-gray-300 mb-2">Active Colleges</p>
                    <p className="text-3xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
                      {collegeStats.active}
                    </p>
                  </div>
                </GlassCard>
                <GlassCard glow delay={0.2}>
                  <div>
                    <p className="text-xs font-semibold text-gray-300 mb-2">Inactive</p>
                    <p className="text-3xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                      {collegeStats.total - collegeStats.active}
                    </p>
                  </div>
                </GlassCard>
              </div>
            )}

            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-cyan-600/50 to-blue-600/50 border-b border-white/20">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold text-white">Name</th>
                      <th className="px-6 py-4 text-left font-bold text-white">Email</th>
                      <th className="px-6 py-4 text-left font-bold text-white">Location</th>
                      <th className="px-6 py-4 text-left font-bold text-white">Website</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredColleges.length > 0 ? (
                      filteredColleges.map((college, idx) => (
                        <motion.tr
                          key={college._id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-white/10 hover:bg-white/5 transition-all"
                        >
                          <td className="px-6 py-4">
                            <p className="font-bold text-white">{college.name}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-gray-300">{college.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-gray-400">{college.location || '—'}</p>
                          </td>
                          <td className="px-6 py-4">
                            {college.website ? (
                              <a
                                href={college.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 hover:text-cyan-300 hover:underline"
                              >
                                Visit Website
                              </a>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center">
                          <p className="text-gray-400">No colleges found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Student Details Modal */}
      <StudentDetailsModal
        student={selectedStudent}
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        onBlockStatusChange={handleBlockStatusChange}
      />
    </div>
  )
}
