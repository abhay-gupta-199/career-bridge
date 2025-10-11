import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'
import axios from 'axios'

const StudentDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New job posted for React Developer!', time: '2 hours ago', type: 'job' },
    { id: 2, message: 'Your application for Software Engineer has been reviewed', time: '1 day ago', type: 'application' },
    { id: 3, message: 'Complete your profile to get better job recommendations', time: '3 days ago', type: 'profile' }
  ])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchJobs()
    fetchApplications()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/student/jobs')
      setJobs(response.data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/api/student/applications')
      setApplications(response.data)
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

  const applyForJob = async (jobId) => {
    try {
      await axios.post(`/api/student/jobs/${jobId}/apply`)
      alert('Application submitted successfully!')
      fetchApplications()
    } catch (error) {
      alert('Error applying for job')
    }
  }

  const roadmaps = {
    'Frontend Development': [
      'Learn HTML, CSS, and JavaScript fundamentals',
      'Master a framework like React, Vue, or Angular',
      'Learn responsive design and CSS frameworks',
      'Understand version control with Git',
      'Learn build tools like Webpack or Vite',
      'Practice with real projects and build a portfolio'
    ],
    'Backend Development': [
      'Learn a programming language (Node.js, Python, Java)',
      'Understand databases (SQL and NoSQL)',
      'Learn API development and RESTful services',
      'Master authentication and security',
      'Learn cloud platforms (AWS, Azure, GCP)',
      'Understand microservices architecture'
    ],
    'Data Science': [
      'Learn Python or R programming',
      'Master statistics and mathematics',
      'Learn data manipulation with Pandas',
      'Understand machine learning algorithms',
      'Learn data visualization tools',
      'Work on real-world data projects'
    ]
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here's what's happening with your career journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Applications</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Skills</p>
              <p className="text-2xl font-bold text-gray-900">{user?.skills?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 0115 0v5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Profile Complete</p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Jobs</h3>
          <div className="space-y-3">
            {jobs.slice(0, 3).map((job) => (
              <div key={job._id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{job.title}</h4>
                <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {job.skillsRequired?.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h3>
          <div className="space-y-3">
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Available Jobs</h1>
        <p className="text-gray-600">Find your next career opportunity</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-lg text-gray-600">{job.company}</p>
                  <p className="text-sm text-gray-500">{job.location} • {job.jobType}</p>
                  <p className="text-gray-700 mt-2">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.skillsRequired?.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => applyForJob(job._id)}
                  className="btn-primary ml-4"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderRoadmaps = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Career Roadmaps</h1>
        <p className="text-gray-600">Plan your learning journey with these structured paths</p>
      </div>

      <div className="space-y-6">
        {Object.entries(roadmaps).map(([title, steps]) => (
          <div key={title} className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-600 text-sm font-medium">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600">Stay updated with your career progress</p>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="card">
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-gray-900">{notification.message}</p>
                <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your personal information and preferences</p>
      </div>

      <div className="card">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-gray-900">{user?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">College</label>
              <p className="mt-1 text-gray-900">{user?.college || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
              <p className="mt-1 text-gray-900">{user?.graduationYear || 'Not specified'}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Skills</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {user?.skills?.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                  {skill}
                </span>
              )) || <span className="text-gray-500">No skills added</span>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Resume</label>
            {user?.resume ? (
              <a 
                href={user.resume} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-1 text-primary-600 hover:text-primary-700"
              >
                View Resume
              </a>
            ) : (
              <p className="mt-1 text-gray-500">No resume uploaded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard()
      case 'jobs':
        return renderJobs()
      case 'roadmaps':
        return renderRoadmaps()
      case 'notifications':
        return renderNotifications()
      case 'profile':
        return renderProfile()
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'dashboard' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'jobs' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Jobs
              </button>
              <button
                onClick={() => setActiveTab('roadmaps')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'roadmaps' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Roadmaps
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'notifications' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'profile' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Profile
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
