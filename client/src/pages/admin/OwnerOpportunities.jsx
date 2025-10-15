import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../../components/Navbar'
import OwnerSidebar from '../../components/OwnerSidebar'
import { Search } from 'lucide-react'

export default function OwnerOpportunities() {
  const [jobs, setJobs] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/owner/jobs')
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
    if (!window.confirm('Approve or activate this opportunity?')) return
    try {
      await axios.post(`/api/owner/jobs/${id}/approve`)
      fetchJobs()
    } catch (err) {
      alert('Error approving job')
    }
  }

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this job?')) return
    try {
      await axios.post(`/api/owner/jobs/${id}/deactivate`)
      fetchJobs()
    } catch (err) {
      alert('Error deactivating job')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this opportunity permanently?')) return
    try {
      await axios.delete(`/api/owner/jobs/${id}`)
      fetchJobs()
    } catch (err) {
      alert('Error deleting job')
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
            <h1 className="text-3xl font-bold text-gray-900">Opportunity Management</h1>
            <p className="text-gray-600">
              Approve, deactivate, or manage posted opportunities
            </p>
          </div>

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

                  <div className="mt-3 text-xs text-gray-500">
                    <p>
                      Salary: ₹{job.salary?.min} - ₹{job.salary?.max}
                    </p>
                    <p>Experience: {job.experience?.min} - {job.experience?.max} yrs</p>
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
