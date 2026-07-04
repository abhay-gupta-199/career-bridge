import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import API from '../../api/axios'
import Navbar from '../../components/Navbar'
import OwnerSidebar from '../../components/OwnerSidebar'
import GlassCard from '../../components/ui/GlassCard'
import AnimatedBadge from '../../components/ui/AnimatedBadge'
import SkeletonLoader from '../../components/ui/SkeletonLoader'
import {
  Search,
  Briefcase,
  Building2,
  MapPin,
  Plus,
  Trash2,
  Power,
  PowerOff,
  Filter,
  Users,
  Mail,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Calendar,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react'

export default function OwnerOpportunities() {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [applications, setApplications] = useState([])
  const [showApplications, setShowApplications] = useState(false)
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    jobType: 'Full-time',
    skillsRequired: '',
    lastDate: ''
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const res = await API.get('/owner/jobs')
      setJobs(res.data)
      setFilteredJobs(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setSearch(value)
    filterJobs(value, filter)
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    filterJobs(search, newFilter)
  }

  const filterJobs = (searchValue, filterType) => {
    let result = jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(searchValue) ||
        j.company.toLowerCase().includes(searchValue)
    )
    if (filterType === 'active') result = result.filter((j) => j.isActive)
    else if (filterType === 'inactive') result = result.filter((j) => !j.isActive)
    setFilteredJobs(result)
  }

  const toggleJobStatus = async (id, currentStatus) => {
    try {
      const res = await API.patch(`/owner/jobs/${id}`, { isActive: !currentStatus })
      const updatedJobs = jobs.map((j) => (j._id === id ? res.data : j))
      setJobs(updatedJobs)
      filterJobs(search, filter)
    } catch (err) {
      alert('Error updating job status')
    }
  }

  const deleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return
    try {
      await API.delete(`/owner/jobs/${id}`)
      const updatedJobs = jobs.filter((j) => j._id !== id)
      setJobs(updatedJobs)
      setFilteredJobs(updatedJobs)
    } catch (err) {
      alert('Error deleting job')
    }
  }

  const handleCreateJob = async (e) => {
    e.preventDefault()
    try {
      const jobData = {
        ...newJob,
        skillsRequired: newJob.skillsRequired.split(',').map((s) => s.trim())
      }
      await API.post('/owner/jobs', jobData)
      setShowCreateModal(false)
      setNewJob({
        title: '',
        company: '',
        description: '',
        location: '',
        jobType: 'Full-time',
        skillsRequired: '',
        lastDate: ''
      })
      fetchJobs()
    } catch (err) {
      alert('Error creating job')
    }
  }

  const fetchApplications = async (jobId) => {
    try {
      const res = await API.get(`/owner/jobs/applications/${jobId}`)
      setApplications(res.data.applications)
      setShowApplications(true)
    } catch (err) {
      alert('Error fetching applications')
    }
  }

  const updateApplicationStatus = async (jobId, appIndex, newStatus) => {
    try {
      await API.put(`/owner/jobs/${jobId}/applications/${appIndex}`, {
        status: newStatus
      })
      fetchApplications(jobId)
      fetchJobs()
    } catch (err) {
      alert('Error updating application status')
    }
  }

  const scheduleApplicationEvent = async (jobId, appIndex, event) => {
    const eventLabel = event === 'oa' ? 'OA' : 'Interview'
    const inputValue = window.prompt(`Enter ${eventLabel} date/time (YYYY-MM-DDTHH:MM)`)
    if (!inputValue) return

    const scheduledAt = new Date(inputValue)
    if (Number.isNaN(scheduledAt.getTime())) {
      alert('Invalid date/time format. Please use YYYY-MM-DDTHH:MM')
      return
    }

    try {
      await API.put(`/owner/jobs/${jobId}/applications/${appIndex}/schedule`, {
        event,
        date: scheduledAt.toISOString()
      })
      fetchApplications(jobId)
      fetchJobs()
      alert(`${eventLabel} scheduled successfully`)
    } catch (err) {
      console.error('Error scheduling application event:', err)
      alert('Unable to schedule the event. Please try again.')
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
                Job Opportunities
              </h1>
              <p className="text-gray-500 font-medium">Manage professional opportunities and career paths</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
            >
              <Plus size={20} />
              Post New Opportunity
            </motion.button>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard glow className="p-6 border-white/50 group h-full">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-purple-100/50 text-purple-600">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Jobs</p>
                  <p className="text-2xl font-bold text-slate-900">{jobs.filter(j => j.isActive).length}</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard glow className="p-6 border-white/50 group h-full">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-pink-100/50 text-pink-600">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Applicants</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {jobs.reduce((acc, job) => acc + (job.applications?.length || 0), 0)}
                  </p>
                </div>
              </div>
            </GlassCard>
            <GlassCard glow className="p-6 border-white/50 group h-full">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-indigo-100/50 text-indigo-600">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Partner Companies</p>
                  <p className="text-2xl font-bold text-slate-900">{new Set(jobs.map(j => j.company)).size}</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Search & Filter Bar */}
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
                placeholder="Search by title or company..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-300 transition-all font-medium"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {['all', 'active', 'inactive'].map((f) => (
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

          {/* Job Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <SkeletonLoader key={i} type="card" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8">
              <AnimatePresence mode="popLayout">
                {filteredJobs.map((job, idx) => (
                  <motion.div
                    key={job._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <GlassCard className="h-full flex flex-col p-6 group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 border-white/60" glow={false}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-purple-600 shadow-inner group-hover:scale-110 transition-transform duration-300">
                          <Briefcase size={28} />
                        </div>
                        <div className="flex gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleJobStatus(job._id, job.isActive)}
                            className={`p-2 rounded-xl transition-colors ${job.isActive ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                            title={job.isActive ? "Deactivate" : "Activate"}
                          >
                            {job.isActive ? <Power size={18} /> : <PowerOff size={18} />}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteJob(job._id)}
                            className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </div>

                      <div className="space-y-1 mb-4">
                        <h3 className="font-bold text-lg text-slate-800 leading-tight group-hover:text-purple-600 transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-pink-600 font-semibold text-xs transition-colors">
                          <Building2 size={14} />
                          {job.company}
                        </div>
                      </div>

                      <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-3 leading-relaxed">
                        {job.description}
                      </p>

                      <div className="mt-auto space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {job.skillsRequired?.slice(0, 3).map((skill, sidx) => (
                            <span
                              key={sidx}
                              className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-200/50"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skillsRequired?.length > 3 && (
                            <span className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-lg">
                              +{job.skillsRequired.length - 3}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 grid place-items-center text-purple-600">
                              <Users size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{job.applications?.length || 0}</p>
                              <p className="text-[9px] uppercase tracking-widest text-slate-400">Applied</p>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedJob(job)
                              fetchApplications(job._id)
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-purple-700 transition-all"
                          >
                            <ArrowUpRight size={14} />
                            View Applicants
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>

        {/* Create Job Modal */}
        <AnimatePresence>
          {showApplications && selectedJob && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowApplications(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white"
              >
                <div className="p-8 bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Applicants for {selectedJob.title}</h2>
                    <p className="text-purple-100 font-medium opacity-80 text-sm mt-1">{selectedJob.company} • {applications.length} applications</p>
                  </div>
                  <button
                    onClick={() => setShowApplications(false)}
                    className="px-4 py-3 bg-white/10 rounded-2xl text-white font-bold hover:bg-white/20 transition"
                  >
                    Close
                  </button>
                </div>

                <div className="p-8 max-h-[80vh] overflow-y-auto space-y-6 custom-scrollbar">
                  {applications.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Users size={32} className="text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No applications yet</p>
                    </div>
                  ) : (
                    applications.map((app, idx) => (
                      <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 grid place-items-center text-purple-600 text-xl font-black">
                              {app.student?.name?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{app.student?.name || 'Unknown Student'}</p>
                              <p className="text-xs text-slate-500 flex items-center gap-2">
                                <Mail size={12} /> {app.student?.email || 'No email'}
                              </p>
                              <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">{app.student?.college || 'College not listed'}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'Accepted' || app.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-700' : app.status === 'Rejected' ? 'bg-pink-100 text-pink-700' : 'bg-amber-100 text-amber-700'}`}>
                              {app.status}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest">
                              {app.match?.matchPercentage ?? 0}% Match
                            </span>
                            {app.match?.hybridScore != null && (
                              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                Hybrid {Math.round(app.match.hybridScore * 100)}%
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {app.student?.skills?.slice(0, 5).map((skill, skillIdx) => (
                            <span key={skillIdx} className="px-3 py-1 text-[10px] font-black uppercase text-slate-500 bg-white border border-slate-200 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>

                        {(app.oaSchedule?.date || app.interviewSchedule?.date) && (
                          <div className="space-y-2 mt-3 text-xs text-slate-600">
                            {app.oaSchedule?.date && (
                              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-3">
                                <p className="font-semibold text-slate-800">OA Scheduled</p>
                                <p>{new Date(app.oaSchedule.date).toLocaleString()}</p>
                              </div>
                            )}
                            {app.interviewSchedule?.date && (
                              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-3">
                                <p className="font-semibold text-slate-800">Interview Scheduled</p>
                                <p>{new Date(app.interviewSchedule.date).toLocaleString()}</p>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="grid gap-3 md:grid-cols-3">
                          {app.status !== 'Shortlisted' && app.status !== 'Accepted' && app.status !== 'Rejected' && (
                            <button
                              onClick={() => updateApplicationStatus(selectedJob._id, idx, 'Shortlisted')}
                              className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 transition"
                            >
                              <CheckCircle size={16} /> Shortlist
                            </button>
                          )}
                          {(app.status === 'Shortlisted' || app.status === 'OA Scheduled' || app.status === 'Interview Scheduled') && (
                            <button
                              onClick={() => scheduleApplicationEvent(selectedJob._id, idx, 'oa')}
                              className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-cyan-700 transition"
                            >
                              <Calendar size={16} /> Schedule OA
                            </button>
                          )}
                          {(app.status === 'Shortlisted' || app.status === 'OA Scheduled' || app.status === 'Interview Scheduled') && (
                            <button
                              onClick={() => scheduleApplicationEvent(selectedJob._id, idx, 'interview')}
                              className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition"
                            >
                              <Calendar size={16} /> Schedule Interview
                            </button>
                          )}
                          {app.status !== 'Rejected' && (
                            <button
                              onClick={() => updateApplicationStatus(selectedJob._id, idx, 'Rejected')}
                              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-pink-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-pink-50 transition"
                            >
                              <XCircle size={16} /> Reject
                            </button>
                          )}
                          <button
                            onClick={() => updateApplicationStatus(selectedJob._id, idx, 'Under Review')}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition"
                          >
                            <ArrowUpRight size={16} /> Review
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {showCreateModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCreateModal(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white"
              >
                <div className="p-8 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  <h2 className="text-2xl font-bold">Create New Opportunity</h2>
                  <p className="text-purple-100 font-medium opacity-80 text-xs mt-1">Post a professional job listing</p>
                </div>

                <form onSubmit={handleCreateJob} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Job Title</label>
                      <input
                        required
                        type="text"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-300 transition-all"
                        placeholder="e.g. Senior Software Engineer"
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Company Name</label>
                      <input
                        required
                        type="text"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-300 transition-all"
                        placeholder="e.g. Google India"
                        value={newJob.company}
                        onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Job Type</label>
                      <select
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-300 transition-all font-bold"
                        value={newJob.jobType}
                        onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}
                      >
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Internship</option>
                        <option>Contract</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Location</label>
                      <input
                        required
                        type="text"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-300 transition-all font-bold"
                        placeholder="e.g. Hyderabad / Remote"
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Job Description</label>
                    <textarea
                      required
                      rows="4"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-300 transition-all font-bold"
                      placeholder="Describe the role and responsibilities..."
                      value={newJob.description}
                      onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Skills (Comma separated)</label>
                      <input
                        required
                        type="text"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-300 transition-all font-bold"
                        placeholder="React, Node.js, AWS"
                        value={newJob.skillsRequired}
                        onChange={(e) => setNewJob({ ...newJob, skillsRequired: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Application Deadline</label>
                      <input
                        required
                        type="date"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-300 transition-all font-bold"
                        value={newJob.lastDate}
                        onChange={(e) => setNewJob({ ...newJob, lastDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-2 px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black rounded-2xl shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all uppercase tracking-widest text-xs"
                    >
                      Launch Opportunity
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}