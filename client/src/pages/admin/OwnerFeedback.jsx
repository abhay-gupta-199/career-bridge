
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import API from '../../api/axios'
import Navbar from '../../components/Navbar'
import OwnerSidebar from '../../components/OwnerSidebar'
import GlassCard from '../../components/ui/GlassCard'
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  MoreVertical,
  Trash2,
  Flag,
  Sparkles
} from 'lucide-react'

export default function OwnerFeedback() {
  const [feedbacks, setFeedbacks] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 })

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/owner/feedback')
      setFeedbacks(data)
      setFiltered(data)
      const pending = data.filter((f) => f.status === 'pending').length
      setStats({
        total: data.length,
        pending,
        resolved: data.length - pending
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase()
    setSearch(val)
    applyFilters(val, filter)
  }

  const handleFilter = (f) => {
    setFilter(f)
    applyFilters(search, f)
  }

  const applyFilters = (s, f) => {
    let res = feedbacks.filter(
      (item) =>
        item.subject.toLowerCase().includes(s) ||
        item.message.toLowerCase().includes(s) ||
        item.userName?.toLowerCase().includes(s)
    )
    if (f !== 'all') res = res.filter((item) => item.status === f)
    setFiltered(res)
  }

  const markResolved = async (id) => {
    if (!window.confirm('Mark this feedback as resolved?')) return
    try {
      await API.post(`/owner/feedback/${id}/resolve`)
      fetchFeedbacks()
    } catch (err) {
      alert('Error updating status')
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
                User Feedback
              </h1>
              <p className="text-gray-500 font-medium">Listen and respond to user experiences</p>
            </div>
            <div className="p-4 bg-white rounded-2xl shadow-xl shadow-purple-500/5 rotate-3 border border-purple-100">
              <Sparkles className="text-purple-600" size={32} />
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Reports', val: stats.total, color: 'purple', icon: MessageSquare },
              { label: 'Awaiting Action', val: stats.pending, color: 'pink', icon: Clock },
              { label: 'Resolved Tickets', val: stats.resolved, color: 'emerald', icon: CheckCircle2 }
            ].map((s, i) => (
              <GlassCard key={i} className="p-6 border-white/50" glow={false}>
                <div className="flex items-center gap-4">
                  <div className={`p-4 bg-${s.color}-100/50 rounded-2xl text-${s.color}-600`}>
                    <s.icon size={24} />
                  </div>
                  <div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                      <p className="text-3xl font-bold text-slate-800">{s.val}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Search/Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white/50 backdrop-blur-xl p-4 rounded-3xl border border-white shadow-xl shadow-purple-500/5"
          >
            <div className="flex-1 relative w-full">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search by subject or user..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-300 transition-all font-medium"
              />
            </div>

            <div className="flex gap-2">
              {['all', 'pending', 'resolved'].map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilter(f)}
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

          {/* List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-40 bg-white/50 animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((fb, idx) => (
                  <motion.div
                    key={fb._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <GlassCard className="p-8 border-white/60 group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500" glow={false}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center font-black text-purple-600 border border-purple-200">
                            <User size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 leading-none">{fb.userName || 'Anonymous User'}</p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">{fb.userRole || 'User'}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${fb.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {fb.status}
                        </span>
                      </div>

                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-purple-600 transition-colors">
                          {fb.subject}
                        </h3>
                        <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic font-medium text-slate-600 line-clamp-4 relative">
                          {fb.message}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-6">
                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                          <Clock size={12} />
                          {new Date(fb.createdAt).toLocaleDateString()}
                        </div>

                        {fb.status === 'pending' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => markResolved(fb._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-[10px] rounded-xl hover:shadow-lg shadow-purple-500/20 uppercase tracking-widest"
                          >
                            <CheckCircle2 size={14} />
                            Resolve Ticket
                          </motion.button>
                        )}
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
