import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import API from '../../api/axios'
import Navbar from '../../components/Navbar'
import OwnerSidebar from '../../components/OwnerSidebar'
import GlassCard from '../../components/ui/GlassCard'
import { Megaphone, Send, History, User, Users, School, Trash2, Clock, Sparkles } from 'lucide-react'

export default function OwnerNotifications() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [target, setTarget] = useState('all')
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/owner/notifications')
      setNotifications(data)
      setFilteredNotifications(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.post('/owner/notifications', { title, message, target })
      setTitle('')
      setMessage('')
      fetchNotifications()
      alert('Announcement broadcasted successfully!')
    } catch (error) {
      alert('Failed to send announcement')
    } finally {
      setLoading(false)
    }
  }

  const deleteNotification = async (id) => {
    if (!window.confirm('Delete this announcement?')) return
    try {
      await API.delete(`/owner/notifications/${id}`)
      fetchNotifications()
    } catch (error) {
      alert('Error deleting announcement')
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
                Announcements Center
              </h1>
              <p className="text-gray-500 font-medium">Send system-wide announcements and alerts</p>
            </div>
            <Sparkles className="text-purple-600 hidden md:block" size={48} />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Announcement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-8 border-white/60 h-full" glow={false}>
                <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                  <Send className="text-purple-600" size={24} /> New Announcement
                </h2>

                <form onSubmit={handleSend} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Target Audience</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'all', label: 'Everyone', icon: Users },
                        { id: 'student', label: 'Students', icon: User },
                        { id: 'college', label: 'Colleges', icon: School }
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTarget(t.id)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${target === t.id
                            ? 'bg-purple-50 border-purple-500 text-purple-600 shadow-lg shadow-purple-500/10'
                            : 'bg-white border-slate-100 text-slate-400 hover:border-purple-200 hover:text-purple-400'
                            }`}
                        >
                          <t.icon size={20} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Title</label>
                    <input
                      required
                      type="text"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-300 transition-all"
                      placeholder="e.g. System Maintenance Update"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Message Content</label>
                    <textarea
                      required
                      rows="6"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-300 transition-all font-bold"
                      placeholder="Write your announcement here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <Send size={18} className={loading ? 'animate-pulse' : ''} />
                    {loading ? 'Broadcasting...' : 'Dispatch Announcement'}
                  </motion.button>
                </form>
              </GlassCard>
            </motion.div>

            {/* Previous Announcements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-8 border-white/60 h-full flex flex-col" glow={false}>
                <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                  <History className="text-pink-600" size={24} /> Broadcast History
                </h2>

                <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[600px]">
                  {notifications.length > 0 ? (
                    notifications.map((n, idx) => (
                      <motion.div
                        key={n._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-lg hover:shadow-purple-500/5 transition-all group border-l-4 border-l-purple-500"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="inline-block px-2 py-0.5 bg-purple-50 text-purple-600 text-[8px] font-bold uppercase tracking-widest rounded-md mb-1">
                              Target: {n.target}
                            </span>
                            <h3 className="font-bold text-slate-800 group-hover:text-purple-600 transition-colors">{n.title}</h3>
                          </div>
                          <button
                            onClick={() => deleteNotification(n._id)}
                            className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mb-4 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Clock size={12} />
                          <span className="text-[10px] font-bold uppercase">{new Date(n.createdAt).toLocaleString()}</span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                      <History size={48} className="opacity-20 mb-4" />
                      <p className="font-bold text-sm uppercase tracking-widest">No previous broadcasts</p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}