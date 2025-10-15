import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../../components/Navbar'
import OwnerSidebar from '../../components/OwnerSidebar'
import { Search } from 'lucide-react'

export default function OwnerDepartments() {
  const [departments, setDepartments] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('/api/owner/colleges')
      setDepartments(res.data)
      setFiltered(res.data)
      calculateStats(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const calculateStats = (data) => {
    const total = data.length
    const approved = data.filter((d) => d.isApproved).length
    const pending = total - approved
    const avgPlacement =
      total > 0
        ? (
            data.reduce(
              (sum, d) => sum + (d.placedStudents || 0) / (d.totalStudents || 1),
              0
            ) / total
          ).toFixed(2) * 100
        : 0

    setStats({ total, approved, pending, avgPlacement })
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
    let result = departments.filter(
      (d) =>
        d.name.toLowerCase().includes(searchValue) ||
        d.email.toLowerCase().includes(searchValue)
    )
    if (filterType === 'approved') result = result.filter((d) => d.isApproved)
    else if (filterType === 'pending') result = result.filter((d) => !d.isApproved)
    setFiltered(result)
  }

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this department?')) return
    try {
      await axios.post(`/api/owner/colleges/${id}/approve`)
      fetchDepartments()
    } catch (err) {
      alert('Error approving department')
    }
  }

  const handleReject = async (id) => {
    if (!window.confirm('Reject this department?')) return
    try {
      await axios.post(`/api/owner/colleges/${id}/reject`)
      fetchDepartments()
    } catch (err) {
      alert('Error rejecting department')
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
            <h1 className="text-3xl font-bold text-gray-900">Departments / Colleges</h1>
            <p className="text-gray-600">
              Manage all registered departments and approve new ones
            </p>
          </div>

          {/* === Stats Overview === */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <p className="text-sm text-gray-600">Total Departments</p>
                <h2 className="text-2xl font-bold text-blue-600">{stats.total}</h2>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600">Approved</p>
                <h2 className="text-2xl font-bold text-green-600">{stats.approved}</h2>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600">Pending Approval</p>
                <h2 className="text-2xl font-bold text-yellow-600">{stats.pending}</h2>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600">Avg Placement Rate</p>
                <h2 className="text-2xl font-bold text-purple-600">
                  {stats.avgPlacement || 0}%
                </h2>
              </div>
            </div>
          )}

          {/* === Search + Filters === */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-1/3">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search by name or email"
                className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-2">
              {['all', 'approved', 'pending'].map((f) => (
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

          {/* === Department Cards === */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length > 0 ? (
              filtered.map((dept) => (
                <div
                  key={dept._id}
                  className="card border border-gray-200 hover:shadow-lg transition"
                >
                  <h3 className="font-semibold text-lg">{dept.name}</h3>
                  <p className="text-sm text-gray-600">{dept.email}</p>
                  <p className="text-xs text-gray-500">{dept.location}</p>

                  <div className="mt-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Students:</span>
                      <span className="font-medium">{dept.totalStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Placed:</span>
                      <span className="font-medium">{dept.placedStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Established:</span>
                      <span className="font-medium">{dept.establishedYear || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        dept.isApproved
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {dept.isApproved ? 'Approved' : 'Pending'}
                    </span>

                    {!dept.isApproved && (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleApprove(dept._id)}
                          className="text-green-600 hover:underline text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(dept._id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No departments found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
