import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../../components/Navbar'
import OwnerSidebar from '../../components/OwnerSidebar'
import { Send, Bell, Loader2, Search, Users, Building } from 'lucide-react'

export default function OwnerNotifications() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [target, setTarget] = useState('all')
  const [notifyTarget, setNotifyTarget] = useState('student') // NEW: student or college
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
    const studentNotif = data.filter((n) => n.notifyTarget === 'student').length
    const collegeNotif = data.filter((n) => n.notifyTarget === 'college').length
    setStats({ total, success, failed, lastSent, studentNotif, collegeNotif })
  }

  const sendNotification = async () => {
    if (!title || !message) return alert('Please fill out all fields')
    try {
      setLoading(true)
      await axios.post('/api/owner/notifications', { 
        title, 
        message, 
        target,
        notifyTarget 
      })
      alert(`✅ Notification sent to ${notifyTarget === 'student' ? 'all students' : notifyTarget === 'college' ? 'all colleges' : 'all users'}!`)
      setTitle('')
      setMessage('')
      setTarget('all')
      setNotifyTarget('student')
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
              Send targeted announcements and manage notification history
            </p>
          </div>

          {/* Enhanced Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="card bg-blue-50 border-l-4 border-blue-500">
                <p className="text-sm text-gray-600">Total Sent</p>
                <h2 className="text-2xl font-bold text-blue-600">{stats.total}</h2>
              </div>
              <div className="card bg-green-50 border-l-4 border-green-500">
                <p className="text-sm text-gray-600">Delivered</p>
                <h2 className="text-2xl font-bold text-green-600">{stats.success}</h2>
              </div>
              <div className="card bg-red-50 border-l-4 border-red-500">
                <p className="text-sm text-gray-600">Failed</p>
                <h2 className="text-2xl font-bold text-red-600">{stats.failed}</h2>
              </div>
              <div className="card bg-purple-50 border-l-4 border-purple-500">
                <p className="text-sm text-gray-600">To Students</p>
                <h2 className="text-2xl font-bold text-purple-600">{stats.studentNotif}</h2>
              </div>
              <div className="card bg-orange-50 border-l-4 border-orange-500">
                <p className="text-sm text-gray-600">To Colleges</p>
                <h2 className="text-2xl font-bold text-orange-600">{stats.collegeNotif}</h2>
              </div>
            </div>
          )}

          {/* Send Notification Form */}
          <div className="card bg-white shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📤 Send New Notification</h2>
            
            <div className="space-y-4">
              {/* Notify Target Selection */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Who should receive this notification? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setNotifyTarget('student')}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 justify-center font-semibold ${
                      notifyTarget === 'student'
                        ? 'border-blue-500 bg-blue-100 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <Users size={18} />
                    All Students
                  </button>
                  <button
                    onClick={() => setNotifyTarget('college')}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 justify-center font-semibold ${
                      notifyTarget === 'college'
                        ? 'border-orange-500 bg-orange-100 text-orange-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-orange-300'
                    }`}
                  >
                    <Building size={18} />
                    All Colleges
                  </button>
                  <button
                    onClick={() => setNotifyTarget('all')}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 justify-center font-semibold ${
                      notifyTarget === 'all'
                        ? 'border-purple-500 bg-purple-100 text-purple-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <Bell size={18} />
                    Everyone
                  </button>
                </div>
              </div>

              <input
                type="text"
                placeholder="Notification Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                placeholder="Notification Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
              />

              <div className="flex gap-3">
                <button
                  onClick={sendNotification}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Notification
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Notification History */}
          <div className="card bg-white shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bell size={20} /> Notification History
            </h2>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search notifications..."
                value={search}
                onChange={handleSearch}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map((notif, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        notif.notifyTarget === 'student' ? 'bg-blue-100 text-blue-700' :
                        notif.notifyTarget === 'college' ? 'bg-orange-100 text-orange-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {notif.notifyTarget === 'student' ? '👥 Students' : notif.notifyTarget === 'college' ? '🏢 Colleges' : '📢 Everyone'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{notif.message}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{new Date(notif.createdAt).toLocaleString()}</span>
                      <span className={`px-2 py-1 rounded ${notif.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {notif.status === 'sent' ? '✅ Sent' : '❌ Failed'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No notifications sent yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
