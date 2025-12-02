import { useEffect, useState } from 'react'
import API from '../../api/axios'
import Navbar from '../../components/Navbar'
import OwnerSidebar from '../../components/OwnerSidebar'
import { Search, Plus, X } from 'lucide-react'

export default function OwnerOpportunities() {
  const [jobs, setJobs] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [stats, setStats] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    skillsRequired: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    experienceMin: '0',
    experienceMax: '',
    jobType: 'Full-time'
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await API.get('/owner/jobs')
      setJobs(res.data)
      setFiltered(res.data)
      calculateStats(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const calculateStats = (data) => {
    const total = data.length
    const active = data.filter((j) => j.isActive).length
    const pending = data.filter((j) => !j.isActive).length
    const avgApplications =
      total > 0
        ? (
            data.reduce(
              (sum, j) => sum + (j.applications?.length || 0),
              0
            ) / total
          ).toFixed(1)
        : 0

    setStats({ total, active, pending, avgApplications })
  }

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setSearch(value)
    filterData(value, filter)
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    filterData(search, newFilter)
  }

  const filterData = (searchValue, filterType) => {
    let result = jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(searchValue) ||
        j.company.toLowerCase().includes(searchValue)
    )
    if (filterType === 'active') result = result.filter((j) => j.isActive)
    else if (filterType === 'inactive') result = result.filter((j) => !j.isActive)
    setFiltered(result)
  }

  const handleApprove = async (id) => {
    if (!window.confirm('Activate this opportunity?')) return
    try {
      await API.put(`/owner/jobs/${id}`, { isActive: true })
      fetchJobs()
    } catch (err) {
      alert('Error activating job')
    }
  }

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this job?')) return
    try {
      await API.put(`/owner/jobs/${id}`, { isActive: false })
      fetchJobs()
    } catch (err) {
      alert('Error deactivating job')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this opportunity permanently?')) return
    try {
      await API.delete(`/owner/jobs/${id}`)
      fetchJobs()
    } catch (err) {
      alert('Error deleting job')
    }
  }

  const handleCreateJob = async (e) => {
    e.preventDefault()
    setCreating(true)
    
    try {
      const jobData = {
        title: formData.title,
        company: formData.company,
        description: formData.description,
        skillsRequired: formData.skillsRequired,
        location: formData.location,
        salary: {
          min: parseInt(formData.salaryMin) || 0,
          max: parseInt(formData.salaryMax) || 0,
          currency: 'INR'
        },
        experience: {
          min: parseInt(formData.experienceMin) || 0,
          max: parseInt(formData.experienceMax) || 0
        },
        jobType: formData.jobType
      }

      const res = await API.post('/owner/jobs', jobData)
      const parsedCount = res.data?.job?.parsedSkillsCount ?? res.data?.parsedSkillsCount ?? 0
      const studentsNotified = res.data?.studentsNotified ?? 0
      alert(`Job created successfully! ${parsedCount} skills parsed. ${studentsNotified} students notified.`)
      
      // Reset form
      setFormData({
        title: '',
        company: '',
        description: '',
        skillsRequired: '',
        location: '',
        salaryMin: '',
        salaryMax: '',
        experienceMin: '0',
        experienceMax: '',
        jobType: 'Full-time'
      })
      setShowCreateForm(false)
      fetchJobs()
    } catch (err) {
      alert('Error creating job: ' + (err.response?.data?.message || err.message))
    } finally {
      setCreating(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <OwnerSidebar />

        <div className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Opportunity Management</h1>
              <p className="text-gray-600">
                Create, approve, deactivate, or manage posted opportunities
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              {showCreateForm ? 'Cancel' : 'Create New Job'}
            </button>
          </div>

          {/* Create Job Form */}
          {showCreateForm && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Job Opportunity</h2>
              <p className="text-sm text-gray-600 mb-4">
                Fill in the job details. The system will automatically parse the job description to extract skills and match with students.
              </p>
              
              <form onSubmit={handleCreateJob} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Min (₹)</label>
                    <input
                      type="number"
                      name="salaryMin"
                      value={formData.salaryMin}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Max (₹)</label>
                    <input
                      type="number"
                      name="salaryMax"
                      value={formData.salaryMax}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Min (years)</label>
                    <input
                      type="number"
                      name="experienceMin"
                      value={formData.experienceMin}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Max (years)</label>
                    <input
                      type="number"
                      name="experienceMax"
                      value={formData.experienceMax}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description (JD) * - Skills will be automatically extracted
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    placeholder="Enter the complete job description. The system will automatically parse skills from this text."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Skills (comma-separated, optional)
                  </label>
                  <input
                    type="text"
                    name="skillsRequired"
                    value={formData.skillsRequired}
                    onChange={handleInputChange}
                    placeholder="e.g., JavaScript, Python, React"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {creating ? 'Creating...' : 'Create Job & Match Students'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* === Stats Overview === */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <p className="text-sm text-gray-600">Total Opportunities</p>
                <h2 className="text-2xl font-bold text-blue-600">{stats.total}</h2>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600">Active</p>
                <h2 className="text-2xl font-bold text-green-600">{stats.active}</h2>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600">Inactive</p>
                <h2 className="text-2xl font-bold text-yellow-600">{stats.pending}</h2>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600">Avg Applications</p>
                <h2 className="text-2xl font-bold text-purple-600">
                  {stats.avgApplications}
                </h2>
              </div>
            </div>
          )}

          {/* === Search + Filter === */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-1/3">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search by title or company"
                className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-2">
              {['all', 'active', 'inactive'].map((f) => (
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

          {/* === Jobs List === */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length > 0 ? (
              filtered.map((job) => (
                <div
                  key={job._id}
                  className="card border border-gray-200 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {job.company} • {job.location}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        job.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm mt-2 line-clamp-3">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.skillsRequired?.slice(0, 4).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skillsRequired?.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{job.skillsRequired.length - 4}
                      </span>
                    )}
                  </div>

                  {job.parsedSkills?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Parsed JD Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.parsedSkills.slice(0, 6).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.parsedSkills.length > 6 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{job.parsedSkills.length - 6}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 text-xs text-gray-500">
                    <p>
                      Salary: ₹{job.salary?.min} - ₹{job.salary?.max}
                    </p>
                    <p>
                      Experience: {job.experience?.min} - {job.experience?.max} yrs
                    </p>
                    <p>
                      Posted on: {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                    <p>Applicants: {job.applications?.length || 0}</p>
                  </div>

                  {/* === Actions === */}
                  <div className="mt-4 flex justify-between items-center">
                    <div className="space-x-2">
                      {!job.isActive ? (
                        <button
                          onClick={() => handleApprove(job._id)}
                          className="text-green-600 hover:underline text-sm"
                        >
                          Activate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDeactivate(job._id)}
                          className="text-yellow-600 hover:underline text-sm"
                        >
                          Deactivate
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No opportunities found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
