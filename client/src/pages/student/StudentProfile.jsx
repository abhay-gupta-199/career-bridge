import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../contexts/AuthContext'
import API from '../../api/axios'

const StudentProfile = () => {
  const { user, token, setUser } = useAuth()
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
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
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

    fetchProfile()
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      const res = await API.put('/student/profile', formData)
      setProfile(res.data.student)
      setUser(res.data.student) // update context
      setEditing(false)
    } catch (err) {
      console.error('Error updating profile:', err)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        setUploadMessage('Please upload a PDF or DOCX file')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadMessage('File size must be less than 10MB')
        return
      }
      setSelectedFile(file)
      setUploadMessage('')
    }
  }

  const handleResumeUpload = async () => {
    if (!selectedFile) {
      setUploadMessage('Please select a file first')
      return
    }

    setUploading(true)
    setUploadMessage('')

    try {
      const formData = new FormData()
      formData.append('resume', selectedFile)

      const res = await API.post('/student/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Refresh profile to get updated skills
      const profileRes = await API.get('/student/profile')
      setProfile(profileRes.data)
      setFormData({
        name: profileRes.data.name || '',
        college: profileRes.data.college || '',
        graduationYear: profileRes.data.graduationYear || '',
        skills: (profileRes.data.skills || []).join(', '),
      })

      setUploadMessage(`Success! ${res.data.skills?.length || 0} skills extracted from your resume.`)
      setSelectedFile(null)
      
      // Reset file input
      const fileInput = document.getElementById('resume-upload')
      if (fileInput) fileInput.value = ''
    } catch (err) {
      console.error('Error uploading resume:', err)
      setUploadMessage(err.response?.data?.message || 'Error uploading resume. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div className="p-10 text-center">Loading profile...</div>

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeTab="profile" />

        <div className="flex-1 p-6">
          {/* Hero */}
          <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl p-6 mb-8 shadow-lg flex items-center gap-6">
            <img
              src={profile?.profilePic || '/default-avatar.png'}
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-purple-300"
            />
            <div>
              <h1 className="text-3xl font-bold text-purple-800">
                Hello, {profile?.name || 'Student'}!
              </h1>
              <p className="text-purple-700 mt-1">
                Manage your profile and update your information here.
              </p>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-white shadow-lg rounded-xl p-6 mb-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              <button
                className="text-purple-700 font-semibold hover:underline"
                onClick={() => setEditing(!editing)}
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Full Name</p>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-2 py-1"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{profile?.name}</p>
                )}
              </div>

              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="text-gray-800 font-medium">{profile?.email}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">College</p>
                {editing ? (
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-2 py-1"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{profile?.college}</p>
                )}
              </div>

              <div>
                <p className="text-gray-500 text-sm">Graduation Year</p>
                {editing ? (
                  <input
                    type="text"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-2 py-1"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{profile?.graduationYear}</p>
                )}
              </div>
            </div>

            {editing && (
              <button
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                onClick={handleSave}
              >
                Save Changes
              </button>
            )}
          </div>

          {/* Resume Upload */}
          <div className="bg-white shadow-lg rounded-xl p-6 mb-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Resume Upload</h2>
            <p className="text-gray-600 text-sm mb-4">
              Upload your resume (PDF or DOCX) to automatically extract and save your skills.
            </p>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg cursor-pointer hover:bg-purple-200 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Choose File
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {selectedFile && (
                  <span className="text-sm text-gray-700">
                    Selected: {selectedFile.name}
                  </span>
                )}
              </div>

              {uploadMessage && (
                <div className={`p-3 rounded-lg text-sm ${
                  uploadMessage.includes('Success') 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {uploadMessage}
                </div>
              )}

              <button
                onClick={handleResumeUpload}
                disabled={!selectedFile || uploading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {uploading ? 'Uploading and Parsing...' : 'Upload & Extract Skills'}
              </button>

              {profile?.resume && (
                <p className="text-sm text-gray-600">
                  Current resume: {profile.resume.split('/').pop()}
                </p>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white shadow-lg rounded-xl p-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills</h2>
            {editing ? (
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Comma separated skills"
                className="w-full border border-gray-300 rounded-md px-2 py-1"
              />
            ) : (
              <div className="flex flex-wrap gap-3">
                {profile?.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No skills added yet. Upload a resume to extract skills automatically.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentProfile
