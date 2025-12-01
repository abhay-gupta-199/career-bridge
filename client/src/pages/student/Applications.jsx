import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import API from '../../api/axios'

const Applications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await API.get('/student/applications')
        setApplications(res.data)
      } catch (err) {
        console.error('Failed to load applications:', err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const statusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800'
    if (status === 'Applied') return 'bg-blue-50 text-blue-800'
    if (status === 'Shortlisted') return 'bg-green-50 text-green-800'
    if (status === 'Rejected') return 'bg-red-50 text-red-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Applications</h1>
            <p className="text-sm text-gray-600">{applications.length} applications</p>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : applications.length === 0 ? (
            <div className="text-gray-600">You have not applied to any jobs yet.</div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.job.id} className="border rounded-lg p-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{app.job.title}</h3>
                    <p className="text-sm text-gray-600">{app.job.company} • {app.job.location}</p>
                    <p className="text-sm text-gray-500 mt-2">Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>

                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(app.status)}`}>{app.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Applications
