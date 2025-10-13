import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import axios from 'axios'

const OwnerDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [jobs, setJobs] = useState([])
  const [students, setStudents] = useState([])
  const [colleges, setColleges] = useState([])
  const [dashboardStats, setDashboardStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showJobModal, setShowJobModal] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    description: '',
    skillsRequired: '',
    location: '',
    salary: { min: '', max: '', currency: 'INR' },
    experience: { min: 0, max: '' },
    jobType: 'Full-time'
  })

  useEffect(() => {
    fetchDashboardStats()
    fetchJobs()
    fetchStudents()
    fetchColleges()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/owner/dashboard')
      setDashboardStats(response.data)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    }
  }

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/owner/jobs')
      setJobs(response.data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/owner/students')
      setStudents(response.data)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const fetchColleges = async () => {
    try {
      const response = await axios.get('/api/owner/colleges')
      setColleges(response.data)
    } catch (error) {
      console.error('Error fetching colleges:', error)
    }
  }

  const handleJobSubmit = async (e) => {
    e.preventDefault()
    try {
      const jobData = {
        ...jobForm,
        skillsRequired: jobForm.skillsRequired.split(',').map(skill => skill.trim()),
        salary: {
          min: parseInt(jobForm.salary.min) || 0,
          max: parseInt(jobForm.salary.max) || null,
          currency: jobForm.salary.currency
        },
        experience: {
          min: parseInt(jobForm.experience.min) || 0,
          max: parseInt(jobForm.experience.max) || null
        }
      }

      if (editingJob) {
        await axios.put(`/api/owner/jobs/${editingJob._id}`, jobData)
        alert('Job updated successfully!')
      } else {
        await axios.post('/api/owner/jobs', jobData)
        alert('Job created successfully!')
      }

      setShowJobModal(false)
      setEditingJob(null)
      setJobForm({
        title: '',
        company: '',
        description: '',
        skillsRequired: '',
        location: '',
        salary: { min: '', max: '', currency: 'INR' },
        experience: { min: 0, max: '' },
        jobType: 'Full-time'
      })
      fetchJobs()
    } catch (error) {
      alert('Error saving job')
    }
  }

  const handleEditJob = (job) => {
    setEditingJob(job)
    setJobForm({
      title: job.title,
      company: job.company,
      description: job.description,
      skillsRequired: job.skillsRequired?.join(', ') || '',
      location: job.location,
      salary: {
        min: job.salary?.min || '',
        max: job.salary?.max || '',
        currency: job.salary?.currency || 'INR'
      },
      experience: {
        min: job.experience?.min || 0,
        max: job.experience?.max || ''
      },
      jobType: job.jobType
    })
    setShowJobModal(true)
  }

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`/api/owner/jobs/${jobId}`)
        alert('Job deleted successfully!')
        fetchJobs()
      } catch (error) {
        alert('Error deleting job')
      }
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}! Here's your platform overview</p>
      </div>

      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Colleges</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalColleges}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalJobs}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeJobs}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Jobs</h3>
          <div className="space-y-3">
            {jobs.slice(0, 5).map((job) => (
              <div key={job._id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{job.title}</h4>
                <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    job.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {job.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Students</h3>
          <div className="space-y-3">
            {students.slice(0, 5).map((student) => (
              <div key={student._id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{student.name}</h4>
                <p className="text-sm text-gray-600">{student.email}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{student.college || 'No college'}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    student.isPlaced ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {student.isPlaced ? 'Placed' : 'Unplaced'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderJobs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
          <p className="text-gray-600">Create and manage job postings</p>
        </div>
        <button
          onClick={() => setShowJobModal(true)}
          className="btn-primary"
        >
          Create New Job
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      job.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-lg text-gray-600">{job.company}</p>
                  <p className="text-sm text-gray-500">{job.location} • {job.jobType}</p>
                  <p className="text-gray-700 mt-2">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.skillsRequired?.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 text-sm text-gray-500">
                    <p>Applications: {job.applications?.length || 0}</p>
                    <p>Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEditJob(job)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderStudents = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Students</h1>
        <p className="text-gray-600">View and manage all registered students</p>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  College
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.college || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {student.skills?.slice(0, 2).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                      {student.skills?.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{student.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.isPlaced 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.isPlaced ? 'Placed' : 'Unplaced'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderColleges = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Colleges</h1>
        <p className="text-gray-600">View and manage all registered colleges</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colleges.map((college) => (
          <div key={college._id} className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{college.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{college.location}</p>
            <p className="text-sm text-gray-500 mb-4">{college.email}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Students:</span>
                <span className="font-medium">{college.totalStudents}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Placed Students:</span>
                <span className="font-medium">{college.placedStudents}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Established:</span>
                <span className="font-medium">{college.establishedYear || 'N/A'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard()
      case 'jobs':
        return renderJobs()
      case 'students':
        return renderStudents()
      case 'colleges':
        return renderColleges()
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'jobs' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Jobs
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'students' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab('colleges')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'colleges' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Colleges
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>

      {/* Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingJob ? 'Edit Job' : 'Create New Job'}
              </h3>
              <form onSubmit={handleJobSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Title</label>
                  <input
                    type="text"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    value={jobForm.company}
                    onChange={(e) => setJobForm({...jobForm, company: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                    className="input-field"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Skills Required (comma-separated)</label>
                  <input
                    type="text"
                    value={jobForm.skillsRequired}
                    onChange={(e) => setJobForm({...jobForm, skillsRequired: e.target.value})}
                    className="input-field"
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min Salary</label>
                    <input
                      type="number"
                      value={jobForm.salary.min}
                      onChange={(e) => setJobForm({...jobForm, salary: {...jobForm.salary, min: e.target.value}})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Salary</label>
                    <input
                      type="number"
                      value={jobForm.salary.max}
                      onChange={(e) => setJobForm({...jobForm, salary: {...jobForm.salary, max: e.target.value}})}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min Experience</label>
                    <input
                      type="number"
                      value={jobForm.experience.min}
                      onChange={(e) => setJobForm({...jobForm, experience: {...jobForm.experience, min: e.target.value}})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Experience</label>
                    <input
                      type="number"
                      value={jobForm.experience.max}
                      onChange={(e) => setJobForm({...jobForm, experience: {...jobForm.experience, max: e.target.value}})}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Type</label>
                  <select
                    value={jobForm.jobType}
                    onChange={(e) => setJobForm({...jobForm, jobType: e.target.value})}
                    className="input-field"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    {editingJob ? 'Update Job' : 'Create Job'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowJobModal(false)
                      setEditingJob(null)
                      setJobForm({
                        title: '',
                        company: '',
                        description: '',
                        skillsRequired: '',
                        location: '',
                        salary: { min: '', max: '', currency: 'INR' },
                        experience: { min: 0, max: '' },
                        jobType: 'Full-time'
                      })
                    }}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default OwnerDashboard
