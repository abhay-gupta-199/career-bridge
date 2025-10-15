import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../../components/Navbar'
import OwnerSidebar from '../../components/OwnerSidebar'
import { Send, Bell, Loader2, Search } from 'lucide-react'

export default function OwnerNotifications() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [target, setTarget] = useState('all')
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  // Fetch previous notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/owner/notifications')
      const data = res.data.reverse() // newest first
      setNotifications(data)
      setFiltered(data)
      calculateStats(data)
    } catch (err) {
      console.error(err)
    }
  }

  const calculateStats = (data) => {
    const total = data.length
    const success = data.filter((n) => n.status === 'sent').length
    const failed = data.filter((n) => n.status === 'failed').length
    const lastSent = total > 0 ? data[0].createdAt : null
    setStats({ total, success, failed, lastSent })
  }

  const sendNotification = async () => {
    if (!title || !message) return alert('Please fill out all fields')
    try {
      setLoading(true)
      await axios.post('/api/owner/notifications', { title, message, target })
      alert('✅ Notification sent successfully')
      setTitle('')
      setMessage('')
      setTarget('all')
      fetchNotifications()
    } catch (err) {
      alert('❌ Error sending notification')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setSearch(value)
    setFiltered(
      notifications.filter(
        (n) =>
          n.title.toLowerCase().includes(value) ||
          n.message.toLowerCase().includes(value)
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <OwnerSidebar />

        <div className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="text-blue-600" /> Notifications
            </h1>
            <p className="text-gray-600">
              Send announcements and view notification history
            </p>
          </div>

          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <p className="text-sm text-gray-600">Total Notifications</p>
                <h2 className="text-2xl font-bold text-blue-600">{stats.total}</h2>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600">Delivered</p>
                <h2 className="text-2xl font-bold text-green-600">{stats.success}</h2>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600">Failed</p>
                <h2 className="text-2xl font-bold text-red-600">{stats.failed}</h2>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600">Last Sent</p>
                <h2 className="text-md font-semibold text-gray-800">
                  {stats.lastSent
                    ? new Date(stats.lastSent).toLocaleString()
                    : 'N/A'}
                </h2>
              </div>
            </div>
          )}

          {/* === Send Notification Form === */}
          <div className="card space-y-4 p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">Send New Notification</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter notification title"
                className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Users</option>
                <option value="students">Students</option>
                <option value="colleges">Colleges</option>
              </select>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              rows={4}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 w-full"
            />

            <button
              onClick={sendNotification}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" /> Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Send Notification
                </>
              )}
            </button>
          </div>

          {/* === Search Bar === */}
          <div className="relative w-full sm:w-1/3">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search notifications"
              className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* === Notification History === */}
          <div className="card border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Notification History
            </h2>

            {filtered.length > 0 ? (
              <div className="divide-y">
                {filtered.map((n) => (
                  <div
                    key={n._id}
                    className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{n.title}</h3>
                      <p className="text-gray-600 text-sm">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Sent to: {n.target?.toUpperCase() || 'ALL'} •{' '}
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`mt-2 sm:mt-0 text-xs px-2 py-1 rounded-full ${
                        n.status === 'sent'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {n.status === 'sent' ? 'Sent' : 'Failed'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No notifications found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
