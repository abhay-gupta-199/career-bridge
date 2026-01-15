import React, { useState } from 'react'
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUserGraduate,
  FaSearch,
  FaFilter,
  FaDownload,
  FaEdit,
  FaBuilding,
  FaUniversity
} from 'react-icons/fa'
import { motion } from 'framer-motion'
import AnimatedBadge from '../../components/ui/AnimatedBadge'

const CollegeStudents = ({ students, updatePlacementStatus, loading, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [editingStudent, setEditingStudent] = useState(null)
  const [placementForm, setPlacementForm] = useState({ isPlaced: false, placedCompany: '' })

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.skills?.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'placed' && student.isPlaced) ||
      (filterStatus === 'unplaced' && !student.isPlaced)

    return matchesSearch && matchesFilter
  })

  const handlePlacementUpdate = async (studentId) => {
    await updatePlacementStatus(studentId, placementForm.isPlaced, placementForm.placedCompany)
    setEditingStudent(null)
    if (onRefresh) onRefresh()
  }

  const exportData = () => {
    const csv = [
      ['Name', 'Email', 'University', 'Skills', 'Graduation Year', 'Status', 'Placed Company'],
      ...filteredStudents.map((s) => [
        s.name,
        s.email,
        s.college || 'N/A', // University column data in export
        s.skills?.join('; '),
        s.graduationYear,
        s.isPlaced ? 'Placed' : 'Unplaced',
        s.placedCompany || '-'
      ])
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'students.csv'
    a.click()
  }

  return (
    <div className="flex-1 p-6 md:p-8 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 min-h-screen overflow-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
          <FaUserGraduate className="text-purple-600" />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Student Records
          </span>
        </h1>
        <p className="text-gray-600 mt-2 text-lg">Manage and track your students' progress and placements</p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 mb-8 space-y-4"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative group">
              <FaSearch className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, email, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <FaFilter className="absolute left-4 top-3.5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-12 pr-8 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 appearance-none shadow-sm cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="placed">Placed</option>
                <option value="unplaced">Unplaced</option>
              </select>
            </div>
          </div>

          {/* Export */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportData}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
          >
            <FaDownload /> Export CSV
          </motion.button>
        </div>

        {/* Stats */}
        <div className="flex gap-6 flex-wrap pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm bg-purple-50 px-3 py-1.5 rounded-lg text-purple-700 font-medium">
            <span className="text-purple-400">Total:</span>
            <span className="text-lg">{students.length}</span>
          </div>
          <div className="flex items-center gap-2 text-sm bg-green-50 px-3 py-1.5 rounded-lg text-green-700 font-medium">
            <span className="text-green-400">Placed:</span>
            <span className="text-lg">{students.filter((s) => s.isPlaced).length}</span>
          </div>
          <div className="flex items-center gap-2 text-sm bg-red-50 px-3 py-1.5 rounded-lg text-red-700 font-medium">
            <span className="text-red-400">Unplaced:</span>
            <span className="text-lg">{students.filter((s) => !s.isPlaced).length}</span>
          </div>
        </div>
      </motion.div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/50 border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserGraduate className="text-4xl text-gray-400" />
          </div>
          <p className="text-gray-500 text-xl font-medium">No students found matching your criteria</p>
          <button
            onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
            className="mt-4 text-purple-600 font-semibold hover:underline"
          >
            Clear filters
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">University</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Skills</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredStudents.map((student, index) => (
                  <React.Fragment key={student._id}>
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-purple-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center font-bold text-xs">
                            {student.name.charAt(0)}
                          </div>
                          <p className="font-semibold text-gray-900">{student.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaUniversity className="text-gray-400" />
                          {student.college || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {student.skills?.slice(0, 2).map((skill, i) => (
                            <AnimatedBadge
                              key={i}
                              text={skill}
                              variant="skill"
                              className="text-[10px] px-2 py-0.5"
                            />
                          ))}
                          {student.skills?.length > 2 && (
                            <span className="text-xs text-gray-400 font-medium px-1">+{student.skills.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{student.graduationYear || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.isPlaced ? (
                          <AnimatedBadge text="Placed" variant="success" icon={<FaCheckCircle />} />
                        ) : (
                          <AnimatedBadge text="Unplaced" variant="danger" icon={<FaTimesCircle />} className="bg-red-100 text-red-700" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {student.placedCompany ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <FaBuilding /> {student.placedCompany}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setEditingStudent(student._id)
                            setPlacementForm({
                              isPlaced: student.isPlaced,
                              placedCompany: student.placedCompany || ''
                            })
                          }}
                          className="text-gray-400 hover:text-purple-600 transition-colors p-2 rounded-full hover:bg-purple-50"
                        >
                          <FaEdit className="text-lg" />
                        </motion.button>
                      </td>
                    </motion.tr>
                    {editingStudent === student._id && (
                      <tr className="bg-purple-50/50 border-t-2 border-b-2 border-purple-100">
                        <td colSpan="8" className="px-6 py-6">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg border border-purple-100"
                          >
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                              <FaEdit className="text-purple-500" /> Update Placement Status
                            </h3>

                            <div className="space-y-4">
                              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer" onClick={() => setPlacementForm({ ...placementForm, isPlaced: !placementForm.isPlaced })}>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${placementForm.isPlaced ? 'bg-purple-600 border-purple-600' : 'bg-white border-gray-300'}`}>
                                  {placementForm.isPlaced && <FaCheckCircle className="text-white text-xs" />}
                                </div>
                                <span className="text-gray-700 font-medium select-none">Mark student as Placed</span>
                              </div>

                              {placementForm.isPlaced && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                >
                                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Placed at Company
                                  </label>
                                  <div className="relative">
                                    <FaBuilding className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                      type="text"
                                      autoFocus
                                      value={placementForm.placedCompany}
                                      onChange={(e) =>
                                        setPlacementForm({
                                          ...placementForm,
                                          placedCompany: e.target.value
                                        })
                                      }
                                      placeholder="e.g. Google, Microsoft, Amazon"
                                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                                    />
                                  </div>
                                </motion.div>
                              )}

                              <div className="flex gap-3 pt-2">
                                <button
                                  onClick={() => handlePlacementUpdate(student._id)}
                                  className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium shadow-md hover:shadow-lg disabled:opacity-50"
                                  disabled={placementForm.isPlaced && !placementForm.placedCompany}
                                >
                                  Save Changes
                                </button>
                                <button
                                  onClick={() => setEditingStudent(null)}
                                  className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default CollegeStudents
