import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../../components/Navbar'
import OwnerSidebar from '../../components/OwnerSidebar'
import { Search, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react'

export default function OwnerFeedback() {
  const [feedbacks, setFeedbacks] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('/api/owner/feedback')
      const data = res.data.reverse()
      setFeedbacks(data)
      setFiltered(data)
      calculateStats(data)
    } catch (err) {
      console.error(err)
    }
  }

  const calculateStats = (data) => {
    const total = data.length
    const resolved = data.filter((f) => f.status === 'resolved').length
    const pending = total - resolved
    const avgRating =
      total > 0
        ? (
            data.reduce((sum, f) => sum + (f.rating || 0), 0) / total
          ).toFixed(1)
        : 0
    setStats({ total, resolved, pending, avgRating })
  }

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setSearch(value)
    setFiltered(
      feedbacks.filter(
        (f) =>
          f.title.toLowerCase().includes(value) ||
          f.message.toLowerCase().includes(value) ||
          f.email.toLowerCase().includes(value)
      )
    )
  }

  const handleFilterChange = (type) => {
    setFilter(type)
    if (type === 'all') setFiltered(feedbacks)
    else setFiltered(feedbacks.filter((f) => f.type === type))
  }

  const markResolved = async (id) => {
    if (!window.confirm('Mark this feedback as resolved?')) return
    try {
      await axios.post(`/api/owner/feedback/${id}/resolve`)
      fetchFeedbacks()
    } catch (err) {
      alert('Error updating status')
    }
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
              <MessageSquare className="text-blue-600" /> Feedback & Issues
            </h1>
            <p className="text-gray-600">Monitor and manage user feedback</p>
          </div>

          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <p className="text-sm text-gray-600">Total Feedback</p>
                <h2 className="text-2xl font-bold text-blue-600">{stats.total}</h2>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600">Resolved</p>
                <h2 className="text-2xl font-bold text-green-600">{stats.resolved}</h2>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600">Pending</p>
                <h2 className="text-2xl font-bold text-yellow-600">{stats.pending}</h2>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600">Avg Rating</p>
                <h2 className="text-2xl font-bold text-purple-600">{stats.avgRating}</h2>
              </div>
            </div>
          )}

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-1/3">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search feedbacks..."
                className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-2">
              {['all', 'bug', 'suggestion', 'other'].map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilterChange(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filter === f
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.length > 0 ? (
              filtered.map((f) => (
                <div
                  key={f._id}
                  className="card border border-gray-200 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{f.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        f.status === 'resolved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {f.status === 'resolved' ? 'Resolved' : 'Pending'}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm">{f.message}</p>

                  {f.type && (
                    <p className="mt-2 text-xs text-blue-600 font-medium">
                      #{f.type.toUpperCase()}
                    </p>
                  )}

                  {f.rating && (
                    <p className="mt-1 text-xs text-gray-500">
                      ⭐ Rating: {f.rating}/5
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-2">
                    From: {f.email} • {new Date(f.createdAt).toLocaleString()}
                  </p>

                  {f.status !== 'resolved' && (
                    <button
                      onClick={() => markResolved(f._id)}
                      className="mt-3 text-green-600 hover:underline text-sm flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" /> Mark as Resolved
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No feedbacks found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
