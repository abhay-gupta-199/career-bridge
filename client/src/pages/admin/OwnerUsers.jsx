import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../../components/Navbar'
import OwnerSidebar from '../../components/OwnerSidebar'
import { Search } from 'lucide-react'

export default function OwnerUsers() {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/owner/students')
      setStudents(res.data)
      setFilteredStudents(res.data)
      calculateStats(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const calculateStats = (data) => {
    const total = data.length
    const placed = data.filter((s) => s.isPlaced).length
    const active = data.filter((s) => !s.isBlocked).length
    setStats({
      total,
      placed,
      unplaced: total - placed,
      active,
      placementRate: total ? ((placed / total) * 100).toFixed(1) : 0
    })
  }

  const handleBlock = async (id) => {
    if (!window.confirm('Block this user?')) return
    try {
      await axios.post(`/api/owner/students/${id}/block`)
      fetchStudents()
    } catch (err) {
      alert('Error blocking user')
    }
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
    let result = students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchValue) ||
        s.email.toLowerCase().includes(searchValue)
    )

    if (filterType === 'placed') result = result.filter((s) => s.isPlaced)
    else if (filterType === 'unplaced') result = result.filter((s) => !s.isPlaced)

    setFilteredStudents(result)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <OwnerSidebar />

        <div className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Monitor and manage all registered students</p>
          </div>

          {/* === Stats Overview === */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <p className="text-sm text-gray-600">Total Students</p>
                <h2 className="text-2xl font-bold text-blue-600">{stats.total}</h2>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600">Placed Students</p>
                <h2 className="text-2xl font-bold text-green-600">{stats.placed}</h2>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600">Unplaced Students</p>
                <h2 className="text-2xl font-bold text-yellow-600">{stats.unplaced}</h2>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600">Placement Rate</p>
                <h2 className="text-2xl font-bold text-purple-600">{stats.placementRate}%</h2>
              </div>
            </div>
          )}

          {/* === Filters & Search === */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Search */}
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

            {/* Filters */}
            <div className="flex space-x-2">
              {['all', 'placed', 'unplaced'].map((f) => (
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

          {/* === Table === */}
          <div className="card overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">College</th>
                  <th className="p-3 text-left">Skills</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => (
                    <tr key={s._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-900">{s.name}</td>
                      <td className="p-3 text-gray-700">{s.email}</td>
                      <td className="p-3 text-gray-600">{s.college || 'N/A'}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {s.skills?.slice(0, 2).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {s.skills?.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{s.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            s.isPlaced
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {s.isPlaced ? 'Placed' : 'Unplaced'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleBlock(s._id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Block
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
