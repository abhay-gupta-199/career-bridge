import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import CollegeSidebar from "../../components/CollegeSidebar";
import Navbar from "../../components/Navbar";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  FaGraduationCap,
  FaUsers,
  FaBuilding,
  FaChartLine,
  FaBell,
  FaBriefcase,
  FaPlus,
  FaEye
} from "react-icons/fa";
import { Routes, Route } from "react-router-dom";

// Import feature pages
import CollegeStudents from "./CollegeStudents";
import CollegeStatistics from "./CollegeStatistics";
import CollegePlacements from "./CollegePlacements";
import CollegeProfile from "./CollegeProfile";

// College Job Posting Component
const CollegeJobPosting = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    skillsRequired: "",
    location: "",
    salary: { min: "", max: "", currency: "INR" },
    experience: { min: "0", max: "" },
    jobType: "Full-time"
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      salary: { ...prev.salary, [name]: value }
    }));
  };

  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      experience: { ...prev.experience, [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.description) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/college/jobs", {
        ...formData,
        salary: formData.salary.min || formData.salary.max ? formData.salary : undefined,
        experience: formData.experience.max ? formData.experience : undefined
      });

      alert(`✅ Job posted successfully! ${res.data.collegeStudentsNotified || 0} students notified`);
      setSuccess(true);
      setFormData({
        title: "",
        company: "",
        description: "",
        skillsRequired: "",
        location: "",
        salary: { min: "", max: "", currency: "INR" },
        experience: { min: "0", max: "" },
        jobType: "Full-time"
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(`❌ Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FaPlus className="text-green-600" /> Post New Job
        </h1>
        <p className="text-gray-600">Create job opportunities for your students</p>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          ✅ Job posted successfully! Your college students have been notified.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Software Engineer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company *</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Bangalore, India"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type</label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed job description, responsibilities, and requirements"
            rows="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Required Skills</label>
          <input
            type="text"
            name="skillsRequired"
            value={formData.skillsRequired}
            onChange={handleChange}
            placeholder="e.g., Python, React, MongoDB (comma-separated)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Min Salary</label>
            <input
              type="number"
              name="min"
              value={formData.salary.min}
              onChange={handleSalaryChange}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Max Salary</label>
            <input
              type="number"
              name="max"
              value={formData.salary.max}
              onChange={handleSalaryChange}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
            <select
              name="currency"
              value={formData.salary.currency}
              onChange={handleSalaryChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>INR</option>
              <option>USD</option>
              <option>EUR</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Min Experience (years)</label>
            <input
              type="number"
              name="min"
              value={formData.experience.min}
              onChange={handleExperienceChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Max Experience (years)</label>
            <input
              type="number"
              name="max"
              value={formData.experience.max}
              onChange={handleExperienceChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
        >
          {loading ? "Posting..." : "📤 Post Job for College Students"}
        </button>
      </form>
    </div>
  );
};

// College Jobs List Component
const CollegeJobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [showApplications, setShowApplications] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/college/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId) => {
    try {
      const res = await axios.get(`/api/college/jobs/applications/${jobId}`);
      setApplications(res.data.applications);
      setShowApplications(true);
    } catch (err) {
      alert("Error fetching applications");
    }
  };

  const updateApplicationStatus = async (jobId, appIndex, newStatus) => {
    try {
      await axios.put(`/api/college/jobs/${jobId}/applications/${appIndex}`, { 
        status: newStatus 
      });
      alert(`✅ Application status updated to ${newStatus}`);
      fetchApplications(jobId);
    } catch (err) {
      alert("Error updating application");
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FaBriefcase className="text-blue-600" /> Posted Jobs
        </h1>
        <p className="text-gray-600">Manage job postings and view student applications</p>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 py-8">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No jobs posted yet. Create your first job opportunity!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map(job => (
            <div key={job._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                  <p className="text-gray-600">{job.company} • {job.location}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {job.jobType}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.skillsRequired?.slice(0, 5).map((skill, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedJob(job);
                    fetchApplications(job._id);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  <FaEye size={16} /> View Applications ({job.applications?.length || 0})
                </button>
                <button
                  onClick={() => alert("Edit feature coming soon")}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applications Modal */}
      {showApplications && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Applications for {selectedJob.title}
              </h2>
              <button
                onClick={() => setShowApplications(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {applications.length === 0 ? (
              <p className="text-center text-gray-600 py-8">No applications yet</p>
            ) : (
              <div className="space-y-4 p-6">
                {applications.map((app, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{app.student?.name}</p>
                        <p className="text-sm text-gray-600">{app.student?.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        app.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-3">
                      {app.status !== 'Accepted' && (
                        <button
                          onClick={() => updateApplicationStatus(selectedJob._id, idx, 'Accepted')}
                          className="text-xs px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          ✓ Accept
                        </button>
                      )}
                      {app.status !== 'Rejected' && (
                        <button
                          onClick={() => updateApplicationStatus(selectedJob._id, idx, 'Rejected')}
                          className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          ✕ Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const CollegeDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchStudents();
    fetchStatistics();
    fetchNotifications();
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/college/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await axios.get("/api/college/statistics");
      setStatistics(res.data);
    } catch (err) {
      console.error("Error fetching statistics:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/api/college/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const updatePlacementStatus = async (studentId, isPlaced, placedCompany = "") => {
    try {
      await axios.put(`/api/college/students/${studentId}/placement`, { isPlaced, placedCompany });
      fetchStudents();
      fetchStatistics();
      alert("Placement status updated successfully! ✅");
    } catch (err) {
      alert("Error updating placement status ❌");
    }
  };

  // === Dashboard Home Content ===
  const DashboardHome = () => (
    <>
      {/* Dashboard Header */}
      <div className="p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaGraduationCap className="text-blue-600" /> Welcome, {user?.name}!
          </h1>
          <p className="text-gray-600">Here's an overview of your college's performance</p>
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative bg-white p-2 rounded-full shadow hover:bg-blue-50 transition"
          >
            <FaBell className="text-blue-600 text-xl" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
              <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-700">Notifications</p>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Close
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-sm p-3">No recent notifications</p>
                ) : (
                  notifications.map((note, i) => (
                    <div
                      key={i}
                      className="p-3 border-b last:border-none flex items-start gap-2 hover:bg-blue-50 transition"
                    >
                      <span>{note.icon || "🔔"}</span>
                      <p className="text-gray-700 text-sm">{note.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <FaUsers className="text-blue-600 text-3xl" />
            <div>
              <p className="text-gray-500 text-sm">Total Students</p>
              <p className="font-bold text-gray-900 text-xl">{statistics.totalStudents}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <FaBriefcase className="text-green-600 text-3xl" />
            <div>
              <p className="text-gray-500 text-sm">Placed Students</p>
              <p className="font-bold text-gray-900 text-xl">{statistics.placedStudents}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <FaChartLine className="text-yellow-600 text-3xl" />
            <div>
              <p className="text-gray-500 text-sm">Placement Rate</p>
              <p className="font-bold text-gray-900 text-xl">{statistics.placementRate}%</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <FaBuilding className="text-red-600 text-3xl" />
            <div>
              <p className="text-gray-500 text-sm">Unplaced</p>
              <p className="font-bold text-gray-900 text-xl">{statistics.unplacedStudents}</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {statistics && (
          <>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaChartLine /> Placement Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Placed", value: statistics.placedStudents, color: "#10B981" },
                      { name: "Unplaced", value: statistics.unplacedStudents, color: "#EF4444" }
                    ]}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {[
                      { name: "Placed", value: statistics.placedStudents, color: "#10B981" },
                      { name: "Unplaced", value: statistics.unplacedStudents, color: "#EF4444" }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaGraduationCap /> Top Skills
              </h3>
              <div className="space-y-2">
                {statistics.topSkills?.slice(0, 5).map((skill, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span>{skill.skill}</span>
                    <div className="w-2/3 bg-gray-200 h-2 rounded-full mr-2">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
                        style={{
                          width: `${(skill.count / statistics.totalStudents) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-gray-500 text-sm">{skill.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex flex-1">
        <CollegeSidebar />

        <div className="flex-1 flex flex-col">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route
              path="students"
              element={
                <CollegeStudents
                  students={students}
                  updatePlacementStatus={updatePlacementStatus}
                  loading={loading}
                />
              }
            />
            <Route
              path="statistics"
              element={<CollegeStatistics statistics={statistics} />}
            />
            <Route
              path="placements"
              element={
                <CollegePlacements
                  students={students}
                  updatePlacementStatus={updatePlacementStatus}
                />
              }
            />
            <Route path="profile" element={<CollegeProfile user={user} />} />
            <Route path="post-job" element={<CollegeJobPosting />} />
            <Route path="jobs" element={<CollegeJobsList />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default CollegeDashboard;
