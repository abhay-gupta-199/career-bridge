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
                  <p className="text-2xl font-bold text-slate-900">428</p>
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

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-2 text-slate-500">
                            <MapPin size={14} className="text-purple-600" />
                            <span className="text-[10px] font-bold">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-purple-600">
                            {job.jobType}
                          </div>
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
