import React, { useState } from "react";

const CollegeProfile = ({ user }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    collegeName: user?.collegeName || "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }
    // Call API to save profile updates
    alert("Profile updated successfully ✅");
    setEditMode(false);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your college profile information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col lg:flex-row gap-6">
        {/* Left - Profile Picture */}
        <div className="flex flex-col items-center lg:items-start gap-4">
          <div className="h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
            {user?.name?.charAt(0) || "C"}
          </div>
          {!editMode && <p className="text-gray-700">{user?.role}</p>}
        </div>

        {/* Right - Details */}
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-500 text-sm">Name</label>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{user?.name}</p>
              )}
            </div>

            <div>
              <label className="text-gray-500 text-sm">Email</label>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{user?.email}</p>
              )}
            </div>

            <div>
              <label className="text-gray-500 text-sm">College Name</label>
              {editMode ? (
                <input
                  type="text"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{user?.collegeName}</p>
              )}
            </div>

            {editMode && (
              <>
                <div>
                  <label className="text-gray-500 text-sm">New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-gray-500 text-sm">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Optional Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <div className="text-blue-600 text-3xl">🎓</div>
          <div>
            <p className="text-gray-500 text-sm">Total Students</p>
            <p className="font-bold text-gray-900 text-xl">120</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <div className="text-green-600 text-3xl">✅</div>
          <div>
            <p className="text-gray-500 text-sm">Placed Students</p>
            <p className="font-bold text-gray-900 text-xl">85</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <div className="text-red-600 text-3xl">⚠️</div>
          <div>
            <p className="text-gray-500 text-sm">Unplaced Students</p>
            <p className="font-bold text-gray-900 text-xl">35</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <div className="text-yellow-600 text-3xl">📈</div>
          <div>
            <p className="text-gray-500 text-sm">Placement Rate</p>
            <p className="font-bold text-gray-900 text-xl">71%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeProfile;
