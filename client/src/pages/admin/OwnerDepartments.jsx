import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import API from '../../api/axios'
import Navbar from '../../components/Navbar'
import OwnerSidebar from '../../components/OwnerSidebar'
import GlassCard from '../../components/ui/GlassCard'
import { Search, Building2, CheckCircle, Clock, TrendingUp } from 'lucide-react'

export default function OwnerDepartments() {
  const [departments, setDepartments] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const res = await API.get('/owner/colleges')
      setDepartments(res.data)
      setFiltered(res.data)
      calculateStats(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data) => {
    const total = data.length
    const approved = data.filter((d) => d.isApproved).length
    const pending = total - approved
    const avgPlacement =
      total > 0
        ? (
          data.reduce(
            (sum, d) => sum + (d.placedStudents || 0) / (d.totalStudents || 1),
            0
          ) / total
        ).toFixed(1) * 100
        : 0

    setStats({ total, approved, pending, avgPlacement })
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
    let result = departments.filter(
      (d) =>
        d.name.toLowerCase().includes(searchValue) ||
        d.email.toLowerCase().includes(searchValue)
    )
    if (filterType === 'approved') result = result.filter((d) => d.isApproved)
    else if (filterType === 'pending') result = result.filter((d) => !d.isApproved)
    setFiltered(result)
  }

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this department?')) return
    try {
      await API.post(`/owner/colleges/${id}/approve`)
      fetchDepartments()
    } catch (err) {
      alert('Error approving department')
    }
  }

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject and remove this department? This action cannot be undone.')) return
    try {
      await API.post(`/owner/colleges/${id}/reject`)
      fetchDepartments()
    } catch (err) {
      alert('Error rejecting department')
    }
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
                Partner Institutions
              </h1>
              <p className="text-gray-500 font-medium">Manage and monitor affiliated college departments</p>
            </div>
          </motion.div>

          {/* === Stats Overview === */}
          {stats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <GlassCard className="h-full p-6 border-white/50" glow={false} delay={0}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Colleges</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.total}</p>
                  </div>
                  <Building2 className="text-purple-400 opacity-50" size={40} />
                </div>
              </GlassCard>
              <GlassCard className="h-full p-6 border-white/50" glow={false} delay={0.1}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Approved</p>
                    <p className="text-3xl font-bold text-emerald-600">{stats.approved}</p>
                  </div>
                  <CheckCircle className="text-emerald-400 opacity-50" size={40} />
                </div>
              </GlassCard>
              <GlassCard className="h-full p-6 border-white/50" glow={false} delay={0.2}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Approval</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.pending}</p>
                  </div>
                  <Clock className="text-blue-400 opacity-50" size={40} />
                </div>
              </GlassCard>
              <GlassCard className="h-full p-6 border-white/50" glow={false} delay={0.3}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Placement</p>
                    <p className="text-3xl font-bold text-pink-600">{stats.avgPlacement}%</p>
                  </div>
                  <TrendingUp className="text-pink-400 opacity-50" size={40} />
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* === Search + Filters === */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-white/50 shadow-xl shadow-purple-500/5 backdrop-blur-xl"
          >
            <div className="relative w-full lg:w-1/2">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search by name or email..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-gray-100 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {['all', 'approved', 'pending'].map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilterChange(f)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${filter === f
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.div>

          {/* === Department Cards === */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-white/50 animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.length > 0 ? (
                filtered.map((dept, idx) => (
                  <motion.div
                    key={dept._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <GlassCard className="h-full p-8 border-white/60 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group" glow={false}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                          <Building2 size={28} />
                        </div>
                        <span
                          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${dept.isApproved
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                            }`}
                        >
                          {dept.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </div>

                      <h3 className="font-bold text-lg text-slate-800 mb-1 leading-tight">{dept.name}</h3>
                      <p className="text-gray-500 text-sm mb-4 font-medium truncate">{dept.email}</p>

                      {dept.location && (
                        <p className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded inline-block mb-4">
                          📍 {dept.location}
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 mb-6">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Students</p>
                          <p className="font-bold text-slate-700">{dept.totalStudents || 0}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Placed</p>
                          <p className="font-bold text-emerald-600">{dept.placedStudents || 0}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        {dept.website && (
                          <a
                            href={dept.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-black text-indigo-600 hover:text-indigo-800 underline underline-offset-4"
                          >
                            Details
                          </a>
                        )}

                        {!dept.isApproved && (
                          <div className="flex gap-2 ml-auto">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleApprove(dept._id)}
                              className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20"
                            >
                              Approve
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleReject(dept._id)}
                              className="px-4 py-2 bg-rose-50 text-rose-600 text-xs font-bold rounded-xl"
                            >
                              Reject
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800">No departments found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}