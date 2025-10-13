import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const StudentDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([
    {
      id: '1',
      jobTitle: 'Frontend Developer',
      company: 'TechNova Pvt Ltd',
      statusTimeline: ['Applied', 'Submitted', 'Shortlisted', 'Rejected'],
      currentStatus: 'Shortlisted',
    },
    {
      id: '2',
      jobTitle: 'Backend Engineer',
      company: 'CodeWave Solutions',
      statusTimeline: ['Applied', 'Submitted', 'Shortlisted', 'Rejected'],
      currentStatus: 'Submitted',
    },
    {
      id: '3',
      jobTitle: 'Data Analyst Intern',
      company: 'Insight Labs',
      statusTimeline: ['Applied', 'Submitted', 'Shortlisted', 'Rejected'],
      currentStatus: 'Applied',
    },
  ])
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'React Developer', time: '2 hours ago', type: 'job', eligibility: 80 },
    { id: 2, message: 'Your application for Software Engineer has been reviewed', time: '1 day ago', type: 'application' },
    { id: 3, message: 'Complete your profile to get better job recommendations', time: '3 days ago', type: 'profile' }
  ])
  const [loading, setLoading] = useState(false)

  // Hardcoded Job Data + Match Calculation
  useEffect(() => {
    const hardcodedJobs = [
      {
        _id: '1',
        title: 'Frontend Developer',
        company: 'TechNova Pvt Ltd',
        location: 'Remote',
        jobType: 'Full-time',
        description: 'We’re looking for a passionate Frontend Developer skilled in React, Tailwind CSS, and responsive UI design.',
        skillsRequired: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS'],
      },
      {
        _id: '2',
        title: 'Backend Engineer',
        company: 'CodeWave Solutions',
        location: 'Bangalore, India',
        jobType: 'Hybrid',
        description: 'Responsible for building REST APIs, managing databases, and integrating backend services.',
        skillsRequired: ['Node.js', 'Express', 'MongoDB', 'API Development'],
      },
      {
        _id: '3',
        title: 'Data Analyst Intern',
        company: 'Insight Labs',
        location: 'Pune, India',
        jobType: 'Internship',
        description: 'Analyze business data, generate reports, and visualize insights using Python and Power BI.',
        skillsRequired: ['Python', 'Pandas', 'Data Visualization', 'Power BI'],
      },
      {
        _id: '4',
        title: 'Machine Learning Engineer',
        company: 'AIverse Technologies',
        location: 'Noida, India',
        jobType: 'Full-time',
        description: 'Develop and optimize ML models for real-time prediction systems using TensorFlow or PyTorch.',
        skillsRequired: ['Python', 'TensorFlow', 'Scikit-learn', 'ML Algorithms'],
      },
    ]

    setLoading(true)
    setTimeout(() => {
      const updatedJobs = hardcodedJobs.map((job) => {
        if (user?.skills?.length) {
          const matched = job.skillsRequired.filter(skill =>
            user.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
          ).length
          const matchPercent = Math.round((matched / job.skillsRequired.length) * 100)
          return { ...job, matchPercent }
        } else {
          return { ...job, matchPercent: Math.floor(Math.random() * 28) + 70 }
        }
      })
      setJobs(updatedJobs)
      setLoading(false)
    }, 1000)
  }, [user])

  const applyForJob = (jobId) => {
    alert(`Application submitted for Job ID: ${jobId}`)
    const job = jobs.find(j => j._id === jobId)
    setApplications(prev => [...prev, {
      id: jobId,
      jobTitle: job?.title || 'Job',
      company: job?.company || 'Company',
      statusTimeline: ['Applied', 'Submitted', 'Shortlisted', 'Rejected'],
      currentStatus: 'Applied'
    }])
  }

  const roadmaps = {
    'Frontend Development': [
      'Learn HTML, CSS, and JavaScript fundamentals',
      'Master React and responsive design',
      'Understand version control with Git',
      'Work with build tools like Vite or Webpack',
      'Build and deploy personal projects',
    ],
    'Backend Development': [
      'Learn Node.js or Python backend frameworks',
      'Understand databases (SQL & NoSQL)',
      'Learn REST API development',
      'Implement authentication & authorization',
      'Understand cloud deployment basics',
    ],
    'Data Science': [
      'Master Python and Pandas',
      'Learn data cleaning and visualization',
      'Understand ML algorithms',
      'Work on real-world datasets',
      'Build predictive models',
    ],
  }

  // ===== RENDER FUNCTIONS =====

  const renderDashboard = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'Student'}!</h1>
        <p className="text-gray-600 mt-1">Here’s a quick overview of your career progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-5">
          <p className="text-sm text-gray-500">Applications</p>
          <p className="text-3xl font-bold mt-2">{applications.length}</p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-5">
          <p className="text-sm text-gray-500">Skills</p>
          <p className="text-3xl font-bold mt-2">{user?.skills?.length || 0}</p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-5">
          <p className="text-sm text-gray-500">Profile Completion</p>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
            <div className="bg-blue-600 h-3 rounded-full w-4/5"></div>
          </div>
          <p className="text-sm text-blue-700 font-semibold mt-1">85% Complete</p>
        </div>
      </div>
    </div>
  )

  const renderJobs = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map(job => (
            <div key={job._id} className="bg-white shadow-lg rounded-2xl p-5 hover:shadow-xl transition">
              <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
              <p className="text-gray-700 mt-1 font-medium">{job.company} • {job.location}</p>
              <p className="text-sm text-gray-500 mt-1">{job.jobType}</p>
              <p className="mt-2 text-gray-800 font-medium">{job.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {job.skillsRequired.map((skill, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{skill}</span>
                ))}
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-500">Profile Match</p>
                <div className="w-full bg-gray-200 h-2.5 rounded-full mt-1">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${job.matchPercent}%` }}></div>
                </div>
                <p className="text-sm text-blue-700 font-semibold mt-1">{job.matchPercent}% Match</p>
              </div>
              <button
                onClick={() => applyForJob(job._id)}
                className="mt-3 w-32 bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 font-medium"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderApplications = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Your Applications</h1>
      {applications.map(app => (
        <div key={app.id} className="bg-white shadow-lg rounded-2xl p-5">
          <h3 className="text-xl font-semibold text-gray-900">{app.jobTitle}</h3>
          <p className="text-gray-700">{app.company}</p>
          <div className="flex items-center mt-3 space-x-2">
            {app.statusTimeline.map((status, idx) => (
              <div key={idx} className={`px-3 py-1 rounded-full border text-sm font-medium ${
                status === app.currentStatus ? 'bg-blue-600 text-white border-blue-600' :
                idx < app.statusTimeline.indexOf(app.currentStatus) ? 'bg-green-100 text-green-700 border-green-300' :
                'bg-gray-100 text-gray-500 border-gray-200'
              }`}>
                {status}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  const renderNotifications = () => (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
      {notifications.map(n => (
        <div key={n.id} className="bg-white shadow rounded-xl p-4 flex justify-between items-center">
          <p className="text-gray-900 font-medium">
            {n.type === 'job' ? `Hey! You are ${n.eligibility || 70}% eligible for ${n.message}` : n.message}
          </p>
          <p className="text-xs text-gray-500">{n.time}</p>
        </div>
      ))}
    </div>
  )

  const renderProfile = () => (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>

      <div className="bg-white shadow-lg rounded-3xl p-6 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 bg-blue-600 rounded-full flex items-center justify-center text-4xl text-white font-bold shadow-md">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <p className="mt-2 text-gray-600 font-medium">{user?.role || 'Student'}</p>
        </div>

        {/* Details */}
        <div className="flex-1 w-full space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Full Name</p>
              <p className="text-gray-900 font-semibold">{user?.name}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Email</p>
              <p className="text-gray-900 font-semibold">{user?.email}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
              <p className="text-sm text-gray-500 font-medium">College</p>
              <p className="text-gray-900 font-semibold">{user?.college || 'Not specified'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Graduation Year</p>
              <p className="text-gray-900 font-semibold">{user?.graduationYear || 'Not specified'}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500 font-medium">Skills</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {user?.skills?.length ? user.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{skill}</span>
              )) : <p className="text-gray-400 text-sm">No skills added</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderRoadmaps = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Career Roadmaps</h1>
      {Object.entries(roadmaps).map(([title, steps]) => (
        <div key={title} className="bg-white shadow-lg rounded-2xl p-5">
          <h3 className="text-xl font-semibold mb-3">{title}</h3>
          {steps.map((step, i) => (
            <div key={i} className="flex items-center mb-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-700 mr-2">{i + 1}</div>
              <p className="text-gray-700">{step}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard()
      case 'jobs': return renderJobs()
      case 'applications': return renderApplications()
      case 'notifications': return renderNotifications()
      case 'profile': return renderProfile()
      case 'roadmaps': return renderRoadmaps()
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 p-6">{renderContent()}</div>
      </div>
    </div>
  )
}

export default StudentDashboard
