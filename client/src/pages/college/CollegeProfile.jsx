import React, { useState, useEffect } from 'react'
import { FaCog, FaUser, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaCalendar, FaBell, FaLock, FaSave } from 'react-icons/fa'
import API from '../../api/axios'

const CollegeProfile = ({ user, onUpdate }) => {
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    website: '',
    description: '',
    establishedYear: new Date().getFullYear()
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        location: user.location || '',
        website: user.website || '',
        description: user.description || '',
        establishedYear: user.establishedYear || new Date().getFullYear()
      })
      setProfile(user)
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'establishedYear' ? parseInt(value) : value
    }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      await API.put('/college/profile', formData)
      setProfile({ ...profile, ...formData })
      setEditMode(false)
      alert('✅ Profile updated successfully!')
      if (onUpdate) onUpdate()
    } catch (err) {
      alert('❌ Error updating profile: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      location: profile?.location || '',
      website: profile?.website || '',
      description: profile?.description || '',
      establishedYear: profile?.establishedYear || new Date().getFullYear()
    })
    setEditMode(false)
  }

  return (
    <div className="flex-1 p-6 md:p-8 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 min-h-screen overflow-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
          <FaCog className="text-purple-600" />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            College Settings
          </span>
        </h1>
        <p className="text-gray-600 mt-2 text-lg">Manage your college profile information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-[#10002b] via-[#4b006e] to-[#240046] h-40 relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
        </div>

        <div className="px-8 pb-8">
          <div className="flex flex-col lg:flex-row gap-8 -mt-20">
            {/* Avatar */}
            <div className="flex flex-col items-center lg:items-start group">
              <div className="h-40 w-40 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-6xl font-black shadow-2xl border-8 border-white group-hover:rotate-3 transition-transform duration-500">
                {profile?.name?.charAt(0) || 'C'}
              </div>
              <div className="mt-4 px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-bold border border-purple-200">
                College Administrator
              </div>
            </div>

            {/* Info Summary */}
            <div className="flex-1 mt-24 lg:mt-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Institution Name</p>
                  <p className="text-2xl font-black text-gray-900">{profile?.name}</p>
                </div>
                <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Official Email</p>
                  <p className="text-xl font-bold text-purple-600">{profile?.email}</p>
                </div>
                <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Primary Location</p>
                  <p className="text-lg font-bold text-gray-700">{profile?.location || 'Not Set'}</p>
                </div>
                <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Founded Since</p>
                  <p className="text-lg font-bold text-gray-700">{profile?.establishedYear || 'Not Set'}</p>
                </div>
              </div>

              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black shadow-lg hover:shadow-xl hover:scale-105 transition-all outline-none"
                >
                  Edit Information
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {editMode && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-8 pb-4 border-b border-gray-100">Update Profile Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <FaUser className="text-purple-500" /> Institution Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-medium"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <FaEnvelope className="text-purple-500" /> Official Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-5 py-3 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 font-medium cursor-not-allowed"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <FaMapMarkerAlt className="text-purple-500" /> Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State, Country"
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-medium"
              />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <FaGlobe className="text-purple-500" /> Website URL
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://www.college.edu"
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-medium"
              />
            </div>

            {/* Established Year */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <FaCalendar className="text-purple-500" /> Founding Year
              </label>
              <input
                type="number"
                name="establishedYear"
                value={formData.establishedYear}
                onChange={handleChange}
                min="1800"
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-8 space-y-2">
            <label className="text-sm font-bold text-gray-700">Institution Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-medium"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex gap-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-10 py-3 bg-purple-600 text-white rounded-2xl font-black shadow-lg hover:bg-purple-700 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <FaSave /> {loading ? 'Updating...' : 'Save Profile'}
            </button>
            <button
              onClick={handleCancel}
              className="px-10 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Security & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notifications */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
          <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <FaBell className="text-pink-500" /> Notification Settings
          </h3>
          <div className="space-y-6">
            <label className="flex items-center gap-4 cursor-pointer group p-3 rounded-2xl hover:bg-pink-50 transition-colors">
              <input type="checkbox" defaultChecked className="w-6 h-6 rounded-lg border-gray-300 text-pink-600 focus:ring-pink-500" />
              <div className="flex flex-col">
                <span className="font-bold text-gray-800">Placement Alerts</span>
                <span className="text-sm text-gray-500">Get notified when students get placed</span>
              </div>
            </label>
            <label className="flex items-center gap-4 cursor-pointer group p-3 rounded-2xl hover:bg-pink-50 transition-colors">
              <input type="checkbox" defaultChecked className="w-6 h-6 rounded-lg border-gray-300 text-pink-600 focus:ring-pink-500" />
              <div className="flex flex-col">
                <span className="font-bold text-gray-800">Registration Updates</span>
                <span className="text-sm text-gray-500">New student registrations and profile updates</span>
              </div>
            </label>
            <label className="flex items-center gap-4 cursor-pointer group p-3 rounded-2xl hover:bg-pink-50 transition-colors">
              <input type="checkbox" className="w-6 h-6 rounded-lg border-gray-300 text-pink-600 focus:ring-pink-500" />
              <div className="flex flex-col">
                <span className="font-bold text-gray-800">Weekly Reports</span>
                <span className="text-sm text-gray-500">Receive a weekly summary of portal activity</span>
              </div>
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
          <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <FaLock className="text-purple-600" /> Security Controls
          </h3>
          <div className="space-y-4">
            <button className="w-full py-4 px-6 bg-gray-50 text-gray-700 font-bold rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all flex items-center justify-between group">
              <span>Change Account Password</span>
              <FaLock className="text-gray-400 group-hover:text-purple-600 transition-colors" />
            </button>
            <button className="w-full py-4 px-6 bg-gray-50 text-gray-700 font-bold rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all flex items-center justify-between group">
              <span>Setup Two-Factor Auth</span>
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-lg">Recommended</span>
            </button>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-gray-500 font-bold">Portal Status</span>
              <span className="flex items-center gap-2 font-black text-green-600 uppercase text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50/50 border-2 border-red-100 rounded-3xl p-8 transition-all hover:bg-red-50">
        <h3 className="text-2xl font-black text-red-900 mb-2">Danger Zone</h3>
        <p className="text-red-700 mb-6 font-medium">These actions are permanent and cannot be undone. All college data, student records, and placement history will be purged.</p>
        <button className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg hover:bg-red-700 hover:shadow-red-200 transition-all">
          Request Account Deletion
        </button>
      </div>
    </div>
  )
}

export default CollegeProfile
