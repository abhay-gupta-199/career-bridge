import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, MapPin, Calendar, CheckCircle, Clock, XCircle, ArrowUpRight } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import API from '../../api/axios'
import GlassCard from '../../components/ui/GlassCard'
import GradientCard from '../../components/ui/GradientCard'
import SkeletonLoader from '../../components/ui/SkeletonLoader'

const Applications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, applied, shortlisted, rejected
  const [error, setError] = useState(null)
  const [selectedApp, setSelectedApp] = useState(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await API.get('/student/applications')
      setApplications(res.data || [])
    } catch (err) {
      console.error('Failed to load applications:', err.message)
      setError('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Shortlisted':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'Rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'Applied':
      default:
        return <Clock className="w-5 h-5 text-blue-500" />
    }
  }

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-green-50 text-green-700 border border-green-200'
      case 'Rejected':
        return 'bg-red-50 text-red-700 border border-red-200'
      case 'Applied':
      default:
        return 'bg-blue-50 text-blue-700 border border-blue-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-gradient-to-r from-green-100 to-emerald-100'
      case 'Rejected':
        return 'bg-gradient-to-r from-red-100 to-pink-100'
      case 'Applied':
      default:
        return 'bg-gradient-to-r from-blue-100 to-cyan-100'
    }
  }

  // Filter applications
  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true
    if (filter === 'applied') return app.status === 'Applied'
    if (filter === 'shortlisted') return app.status === 'Shortlisted'
    if (filter === 'rejected') return app.status === 'Rejected'
    return true
  })

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'Applied').length,
    shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    rejected: applications.filter(a => a.status === 'Rejected').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
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
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full">
                <Briefcase className="text-blue-600" size={32} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900">My Applications</h1>
                <p className="text-gray-600 text-lg">Track your job application status</p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <GradientCard title="Total" value={stats.total} icon="📋" delay={0} />
            <GradientCard title="Applied" value={stats.applied} icon="✅" delay={0.1} />
            <GradientCard title="Shortlisted" value={stats.shortlisted} icon="⭐" delay={0.2} />
            <GradientCard title="Rejected" value={stats.rejected} icon="❌" delay={0.3} />
          </div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-3 mb-8 overflow-x-auto pb-2"
          >
            {[
              { key: 'all', label: 'All Applications' },
              { key: 'applied', label: 'Applied' },
              { key: 'shortlisted', label: 'Shortlisted' },
              { key: 'rejected', label: 'Rejected' }
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key)}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${filter === btn.key
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
                  }`}
              >
                {btn.label}
              </button>
            ))}
          </motion.div>

          {/* Loading State */}
          {loading ? (
            <div className="space-y-4">
              <SkeletonLoader count={4} />
            </div>
          ) : error ? (
            <GlassCard glow>
              <div className="text-center py-12">
                <p className="text-red-600 font-semibold">{error}</p>
                <button
                  onClick={fetchApplications}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            </GlassCard>
          ) : filteredApplications.length === 0 ? (
            <GlassCard glow>
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 text-lg font-semibold mb-2">No applications yet</p>
                <p className="text-gray-500">
                  {filter === 'all'
                    ? 'Start applying to jobs to track your applications here.'
                    : `No applications with status "${filter}"`}
                </p>
              </div>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app, index) => (
                <motion.div
                  key={app.job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard glow>
                    <div className="flex items-start justify-between gap-4">
                      {/* Left Content */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Status Badge */}
                          <div className={`p-3 rounded-xl ${getStatusColor(app.status)} flex-shrink-0`}>
                            {getStatusIcon(app.status)}
                          </div>

                          {/* Job Details */}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{app.job.title}</h3>
                            <p className="text-gray-600 font-semibold mb-2">{app.job.company}</p>

                            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                {app.job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4 text-purple-500" />
                                {app.job.jobType}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-green-500" />
                                {new Date(app.appliedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Status */}
                      <div className="flex flex-col items-end gap-3">
                        <span className={`px-4 py-2 rounded-full font-bold text-sm ${getStatusBadgeStyle(app.status)}`}>
                          {app.status}
                        </span>
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition flex items-center gap-1 text-sm font-semibold"
                        >
                          View <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
          {/* Detailed View Modal */}
          <ApplicationDetailsModal
            isOpen={!!selectedApp}
            onClose={() => setSelectedApp(null)}
            application={selectedApp}
          />
        </main>
      </div>
    </div>
  )
}



const ApplicationDetailsModal = ({ isOpen, onClose, application }) => {
  if (!isOpen || !application) return null

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shortlisted': return 'bg-green-100 text-green-700'
      case 'Rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-blue-100 text-blue-700'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{application.job.title}</h2>
              <p className="text-gray-600 font-medium">{application.job.company}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XCircle size={24} className="text-gray-400" />
            </button>
          </div>

          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold mb-6 ${getStatusColor(application.status)}`}>
            {application.status === 'Shortlisted' && <CheckCircle size={14} />}
            {application.status === 'Rejected' && <XCircle size={14} />}
            {application.status === 'Applied' && <Clock size={14} />}
            {application.status}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Calendar className="text-gray-400" size={20} />
              <div>
                <p className="text-xs text-gray-500 font-semibold">Applied On</p>
                <p className="text-gray-900 font-medium">{new Date(application.appliedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <MapPin className="text-gray-400" size={20} />
              <div>
                <p className="text-xs text-gray-500 font-semibold">Location</p>
                <p className="text-gray-900 font-medium">{application.job.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Briefcase className="text-gray-400" size={20} />
              <div>
                <p className="text-xs text-gray-500 font-semibold">Job Type</p>
                <p className="text-gray-900 font-medium">{application.job.jobType}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Applications
