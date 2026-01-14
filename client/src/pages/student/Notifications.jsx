import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, CheckCircle2, AlertCircle, Clock, X, ArrowRight } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import API from '../../api/axios'
import GlassCard from '../../components/ui/GlassCard'
import SkeletonLoader from '../../components/ui/SkeletonLoader'

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    let filtered = [...notifications]

    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.isRead)
    }

    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    setFilteredNotifications(filtered)
  }, [notifications, filter, sortBy])

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const response = await API.get('/student/notifications')
      setNotifications(response.data.notifications || [])
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await API.put(`/student/notifications/${notificationId}/read`)
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleDelete = (notificationId) => {
    setNotifications(prev => prev.filter(n => n._id !== notificationId))
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-slate-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full">
                  <Bell className="text-yellow-600" size={32} />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-gray-900">Notifications</h1>
                  <p className="text-gray-600 text-lg">Stay updated with job opportunities</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <GlassCard glow className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Total</p>
                  <p className="text-3xl font-black text-blue-600">{notifications.length}</p>
                </div>
                <div className="text-4xl">📬</div>
              </div>
            </GlassCard>

            <GlassCard glow className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Unread</p>
                  <p className="text-3xl font-black text-orange-600">{unreadCount}</p>
                </div>
                <div className="text-4xl">🆕</div>
              </div>
            </GlassCard>

            <GlassCard glow className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Read</p>
                  <p className="text-3xl font-black text-green-600">{notifications.length - unreadCount}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </GlassCard>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-3 mb-8 overflow-x-auto pb-2"
          >
            {[
              { key: 'all', label: 'All Notifications', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount }
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key)}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${filter === btn.key
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-yellow-300'
                  }`}
              >
                {btn.label} ({btn.count})
              </button>
            ))}
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-4">
              <SkeletonLoader count={4} />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <GlassCard glow className="p-6">
              <div className="text-center py-12">
                <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 text-lg font-semibold mb-2">No notifications</p>
                <p className="text-gray-500">
                  {filter === 'unread'
                    ? "You've read all your notifications. Check back soon!"
                    : 'Create a complete profile to get job notifications.'}
                </p>
              </div>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard glow className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left Content */}
                      <div className="flex-1 flex gap-4">
                        {/* Icon */}
                        <div className={`p-3 rounded-lg flex-shrink-0 ${notification.isRead
                            ? 'bg-gray-100'
                            : 'bg-gradient-to-br from-yellow-100 to-orange-100'
                          }`}>
                          {notification.isRead ? (
                            <CheckCircle2 className="text-gray-500" size={20} />
                          ) : (
                            <AlertCircle className="text-yellow-600" size={20} />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {notification.job?.title || 'Job Notification'}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {notification.job?.company} • {notification.job?.location}
                          </p>
                          <p className="text-gray-700 text-sm mb-2">
                            {notification.message || 'You have a new job opportunity matching your profile!'}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Right Actions */}
                      <div className="flex flex-col gap-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="px-3 py-1 text-xs bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 transition font-semibold"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default StudentNotifications
