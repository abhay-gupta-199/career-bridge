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
  FaBriefcase
} from "react-icons/fa";
import { Routes, Route } from "react-router-dom";

// Import feature pages
import CollegeStudents from "./CollegeStudents";
import CollegeStatistics from "./CollegeStatistics";
import CollegePlacements from "./CollegePlacements";
import CollegeProfile from "./CollegeProfile";

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
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default CollegeDashboard;
