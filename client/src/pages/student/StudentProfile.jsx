import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const StudentProfile = () => {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeTab="profile" />

        <div className="flex-1 p-6">
          {/* Hero */}
          <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl p-6 mb-8 shadow-lg flex items-center gap-6">
            <img 
              src={user?.profilePic || '/default-avatar.png'} 
              alt="Profile" 
              className="w-20 h-20 rounded-full border-2 border-purple-300"
            />
            <div>
              <h1 className="text-3xl font-bold text-purple-800">
                Hello, {user?.name || 'Student'}!
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
                <p className="text-gray-800 font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="text-gray-800 font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">College</p>
                <p className="text-gray-800 font-medium">{user?.college}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Graduation Year</p>
                <p className="text-gray-800 font-medium">{user?.graduationYear}</p>
              </div>
            </div>

            {editing && (
              <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Save Changes
              </button>
            )}
          </div>

          {/* Skills */}
          <div className="bg-white shadow-lg rounded-xl p-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {user?.skills?.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentProfile
