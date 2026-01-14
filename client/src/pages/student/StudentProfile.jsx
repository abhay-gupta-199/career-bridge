import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, GraduationCap, BookOpen, FileText, Upload, Edit2, Save, X } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../contexts/AuthContext'
import API from '../../api/axios'
import GlassCard from '../../components/ui/GlassCard'
import GradientCard from '../../components/ui/GradientCard'
import SkeletonLoader from '../../components/ui/SkeletonLoader'

const StudentProfile = () => {
  const { user, setUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    graduationYear: '',
    skills: '',
  })
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadError, setUploadError] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [saveLoading, setSaveLoading] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await API.get('/student/profile')
      setProfile(res.data)
      setFormData({
        name: res.data.name || '',
        college: res.data.college || '',
        graduationYear: res.data.graduationYear || '',
        skills: (res.data.skills || []).join(', '),
      })
    } catch (err) {
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      setSaveLoading(true)
      const res = await API.put('/student/profile', formData)
      setProfile(res.data.student)
      setUser(res.data.student)
      setEditing(false)
    } catch (err) {
      console.error('Error updating profile:', err)
    } finally {
      setSaveLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        setUploadMessage('Please upload a PDF or DOCX file')
        setUploadError(true)
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadMessage('File size must be less than 10MB')
        setUploadError(true)
        return
      }
      setSelectedFile(file)
      setUploadMessage('')
      setUploadError(false)
    }
  }

  const handleResumeUpload = async () => {
    if (!selectedFile) {
      setUploadMessage('Please select a file first')
      setUploadError(true)
      return
    }

    setUploading(true)
    setUploadMessage('')
    setUploadError(false)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append('resume', selectedFile)

      const res = await API.post('/student/upload-resume', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const profileRes = await API.get('/student/profile')
      setProfile(profileRes.data)
      setFormData({
        name: profileRes.data.name || '',
        college: profileRes.data.college || '',
        graduationYear: profileRes.data.graduationYear || '',
        skills: (profileRes.data.skills || []).join(', '),
      })

      setUploadMessage(`✅ Success! ${res.data.skills?.length || 0} skills extracted from your resume.`)
      setUploadError(false)
      setSelectedFile(null)

      const fileInput = document.getElementById('resume-upload')
      if (fileInput) fileInput.value = ''
    } catch (err) {
      console.error('Error uploading resume:', err)
      setUploadMessage(err.response?.data?.message || 'Error uploading resume. Please try again.')
      setUploadError(true)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-8">
            <SkeletonLoader count={4} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full">
                  <User className="text-purple-600" size={32} />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-gray-900">My Profile</h1>
                  <p className="text-gray-600 text-lg">Manage your career information</p>
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${editing
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                  }`}
              >
                {editing ? (
                  <>
                    <X className="w-4 h-4" /> Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" /> Edit Profile
                  </>
                )}
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Personal Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard glow className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <User className="text-purple-600" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                  </div>

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Full Name</label>
                      {editing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                        />
                      ) : (
                        <p className="text-gray-800 font-semibold text-lg">{profile?.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Email
                      </label>
                      <p className="text-gray-800 font-medium">{profile?.email}</p>
                    </div>

                    {/* College */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" /> College/University
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          name="college"
                          value={formData.college}
                          onChange={handleChange}
                          placeholder="Enter your college name"
                          className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium">{profile?.college || 'Not provided'}</p>
                      )}
                    </div>

                    {/* Graduation Year */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Graduation Year</label>
                      {editing ? (
                        <input
                          type="text"
                          name="graduationYear"
                          value={formData.graduationYear}
                          onChange={handleChange}
                          placeholder="e.g., 2024"
                          className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium">{profile?.graduationYear || 'Not provided'}</p>
                      )}
                    </div>

                    {/* Profile Completion */}
                    {profile?.profileCompletion !== undefined && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Profile Completion</label>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                            <motion.div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${profile.profileCompletion}%` }}
                              transition={{ duration: 1, delay: 0.3 }}
                            />
                          </div>
                          <span className="text-lg font-bold text-purple-600">{profile.profileCompletion}%</span>
                        </div>
                      </div>
                    )}

                    {/* Save Button */}
                    {editing && (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={handleSave}
                        disabled={saveLoading}
                        className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {saveLoading ? (
                          <>Saving...</>
                        ) : (
                          <>
                            <Save className="w-4 h-4" /> Save Changes
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Resume Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard glow className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Upload className="text-blue-600" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Resume Upload</h2>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    Upload your resume (PDF or DOCX) to automatically extract and save your skills.
                  </p>

                  <div className="space-y-4">
                    <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-blue-50/50 hover:bg-blue-50 transition">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-8 h-8 text-blue-500" />
                        <span className="text-sm font-semibold text-blue-700">
                          {selectedFile ? selectedFile.name : 'Choose Resume or Drag & Drop'}
                        </span>
                        <span className="text-xs text-blue-600">PDF or DOCX • Max 10MB</span>
                      </div>
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>

                    {uploadMessage && (
                      <div className={`p-3 rounded-lg text-sm ${uploadError
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : 'bg-green-100 text-green-700 border border-green-200'
                        }`}>
                        {uploadMessage}
                      </div>
                    )}

                    <button
                      onClick={handleResumeUpload}
                      disabled={!selectedFile || uploading}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                    >
                      {uploading ? 'Uploading & Parsing...' : 'Upload & Extract Skills'}
                    </button>

                    {profile?.resume && (
                      <p className="text-xs text-gray-600">
                        📄 Current: {profile.resume.split('/').pop()}
                      </p>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Right: Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard glow className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BookOpen className="text-green-600" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
                </div>

                {editing ? (
                  <div>
                    <textarea
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="Enter skills separated by commas"
                      className="w-full px-4 py-2 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none transition h-32"
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile?.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-sm font-semibold border border-green-200"
                        >
                          {skill}
                        </motion.span>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-8">
                        No skills yet. Upload a resume to extract skills automatically or edit to add manually.
                      </p>
                    )}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default StudentProfile
