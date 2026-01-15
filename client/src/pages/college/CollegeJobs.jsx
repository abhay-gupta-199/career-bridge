import React, { useState, useEffect } from 'react'
import { FaBriefcase, FaPlus, FaBell, FaTrash, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaSearch, FaFilter } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import API from '../../api/axios'
import GlassCard from '../../components/ui/GlassCard'

const CollegeJobs = () => {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [formLoading, setFormLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        description: '',
        skillsRequired: '',
        location: '',
        jobType: 'Full-time',
        salary: { min: '', max: '' },
        experience: { min: 0 }
    })

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            setLoading(true)
            const res = await API.get('/college/jobs')
            setJobs(res.data)
        } catch (err) {
            console.error('Error fetching jobs:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        if (name.includes('.')) {
            const [parent, child] = name.split('.')
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setFormLoading(true)
            const data = {
                ...formData,
                skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()).filter(Boolean),
                salary: {
                    ...formData.salary,
                    min: formData.salary.min === '' ? null : Number(formData.salary.min),
                    max: formData.salary.max === '' ? null : Number(formData.salary.max)
                },
                experience: {
                    ...formData.experience,
                    min: formData.experience.min === '' ? 0 : Number(formData.experience.min),
                    max: formData.experience.max === '' || formData.experience.max === undefined ? null : Number(formData.experience.max)
                }
            }
            await API.post('/college/jobs', data)
            setShowModal(false)
            setFormData({
                title: '',
                company: '',
                description: '',
                skillsRequired: '',
                location: '',
                jobType: 'Full-time',
                salary: { min: '', max: '' },
                experience: { min: 0 }
            })
            fetchJobs()
            alert('✅ Job posted successfully!')
        } catch (err) {
            alert('❌ Error posting job')
            console.error(err)
        } finally {
            setFormLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job posting?')) return
        try {
            await API.delete(`/college/jobs/${id}`)
            fetchJobs()
        } catch (err) {
            alert('❌ Error deleting job')
        }
    }

    const handleNotify = async (id) => {
        try {
            const res = await API.post(`/college/jobs/${id}/notify`)
            alert(`✅ ${res.data.message}`)
        } catch (err) {
            alert('❌ Error sending notifications')
        }
    }

    return (
        <div className="flex-1 p-6 md:p-8 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 min-h-screen space-y-8 overflow-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                        <FaBriefcase className="text-purple-600" />
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Job Management
                        </span>
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg">Create and broadcast job opportunities to your students</p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black shadow-lg hover:shadow-xl transition-all"
                >
                    <FaPlus /> Post New Job
                </motion.button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            ) : jobs.length === 0 ? (
                <GlassCard className="p-20 flex flex-col items-center text-center">
                    <FaBriefcase className="text-6xl text-purple-200 mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900">No jobs posted yet</h3>
                    <p className="text-gray-500 mt-2 max-w-md">Start by creating your first job posting and notifying your students.</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-8 text-purple-600 font-bold hover:underline"
                    >
                        Create your first job listing →
                    </button>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {jobs.map((job) => (
                        <GlassCard key={job._id} glow className="p-8 group">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-purple-600 transition-colors">{job.title}</h3>
                                    <p className="text-lg font-bold text-gray-600">{job.company}</p>
                                </div>
                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleNotify(job._id)}
                                        className="p-3 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                                        title="Notify Students"
                                    >
                                        <FaBell />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDelete(job._id)}
                                        className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                        title="Delete Job"
                                    >
                                        <FaTrash />
                                    </motion.button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-2 text-gray-500 font-medium bg-gray-50 p-3 rounded-xl">
                                    <FaMapMarkerAlt className="text-purple-500" /> {job.location}
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 font-medium bg-gray-50 p-3 rounded-xl">
                                    <FaClock className="text-purple-500" /> {job.jobType}
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 font-medium bg-gray-50 p-3 rounded-xl col-span-2">
                                    <FaMoneyBillWave className="text-purple-500" />
                                    ₹{job.salary.min?.toLocaleString()} - ₹{job.salary.max?.toLocaleString()} {job.salary.currency || 'INR'}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-gray-600 line-clamp-3 leading-relaxed">{job.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {job.skillsRequired.map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-white border border-purple-100 text-purple-700 text-xs font-bold rounded-full">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400">Posted on {new Date(job.createdAt).toLocaleDateString()}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {job.isActive ? 'Active' : 'Closed'}
                                </span>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}

            {/* Modal for Creating New Job */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                <h2 className="text-3xl font-black">Post a New Opportunity</h2>
                                <p className="opacity-80 mt-1">Fill in the details to reach your students</p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Job Title</label>
                                        <input
                                            required
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                                            placeholder="e.g. Software Engineer"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Company Name</label>
                                        <input
                                            required
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                                            placeholder="e.g. Tech Corp"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Description</label>
                                    <textarea
                                        required
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all resize-none"
                                        placeholder="Tell students about the role..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Skills Required (comma separated)</label>
                                    <input
                                        required
                                        type="text"
                                        name="skillsRequired"
                                        value={formData.skillsRequired}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                                        placeholder="e.g. React, Node.js, Python"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Location</label>
                                        <input
                                            required
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                                            placeholder="e.g. Remote, Mumbai"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Job Type</label>
                                        <select
                                            name="jobType"
                                            value={formData.jobType}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all appearance-none"
                                        >
                                            <option>Full-time</option>
                                            <option>Part-time</option>
                                            <option>Contract</option>
                                            <option>Internship</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Min Salary (₹)</label>
                                        <input
                                            type="number"
                                            name="salary.min"
                                            value={formData.salary.min}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Max Salary (₹)</label>
                                        <input
                                            type="number"
                                            name="salary.max"
                                            value={formData.salary.max}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Min Experience (Years)</label>
                                        <input
                                            type="number"
                                            name="experience.min"
                                            value={formData.experience.min}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Max Experience (Years)</label>
                                        <input
                                            type="number"
                                            name="experience.max"
                                            value={formData.experience.max || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-10 p-2 bg-gray-50 rounded-3xl">
                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-black shadow-lg hover:bg-purple-700 transition-all disabled:opacity-50"
                                    >
                                        {formLoading ? 'Posting...' : 'Confirm & Post'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-4 bg-white text-gray-600 rounded-2xl font-black border border-gray-200 hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CollegeJobs
