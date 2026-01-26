import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import CollegeSidebar from "../../components/CollegeSidebar";
import Navbar from "../../components/Navbar";
import API from "../../api/axios";
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
  Cell,
  AreaChart,
  Area
} from "recharts";
import {
  GraduationCap,
  Users,
  Building2,
  TrendingUp,
  Bell,
  Briefcase,
  ArrowUpRight,
  RefreshCcw,
  BookOpen,
  Target,
  Clock,
  Sparkles
} from "lucide-react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "../../components/ui/GlassCard";

// Import feature pages
import CollegeStudents from "./CollegeStudents";
import CollegeStatistics from "./CollegeStatistics";
import CollegePlacements from "./CollegePlacements";
import CollegeProfile from "./CollegeProfile";
import CollegeJobPosting from "./CollegeJobPosting";
import CollegeJobsList from "./CollegeJobsList";

const CollegeDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStudents(),
        fetchStatistics(),
        fetchNotifications()
      ]);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await API.get("/college/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await API.get("/college/statistics");
      setStatistics(res.data);
    } catch (err) {
      console.error("Error fetching statistics:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/college/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const updatePlacementStatus = async (studentId, isPlaced, placedCompany = "") => {
    try {
      await API.put(`/college/students/${studentId}/placement`, { isPlaced, placedCompany });
      fetchAllData();
      alert("Placement status updated successfully! ✅");
    } catch (err) {
      alert("Error updating placement status ❌");
    }
  };

  const getRelativeTime = (date) => {
    const diff = Math.floor((new Date() - date) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  // === Dashboard Home Content ===
  const DashboardHome = () => {
    const navigate = useNavigate();

    return (
      <div className="space-y-8">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              Institutional Overview
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-gray-500 font-medium">Insights and student performance for {user?.name}</p>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1">
                <Clock size={10} /> Last updated: {getRelativeTime(lastUpdated)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchAllData}
              className="flex items-center gap-2 px-6 py-3 bg-white text-[#4b006e] font-black uppercase tracking-widest text-[10px] rounded-2xl border border-[#4b006e]/10 shadow-xl shadow-purple-900/5 hover:bg-purple-50 transition-all"
            >
              <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
              Sync Metrics
            </motion.button>

            {/* Notification Bell */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative bg-white p-3 rounded-2xl shadow-xl border border-slate-100 hover:bg-purple-50 transition-all text-[#4b006e] group"
              >
                <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white">
                    {notifications.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
                  >
                    <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Activity</p>
                      <button onClick={() => setShowNotifications(false)} className="text-[10px] font-bold text-purple-600 hover:underline">Dismiss All</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center bg-white">
                          <Bell className="mx-auto text-slate-200 mb-2" size={32} />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">All caught up!</p>
                        </div>
                      ) : (
                        notifications.map((note, i) => (
                          <div key={i} className="p-4 border-b border-slate-50 last:border-none flex items-start gap-3 hover:bg-purple-50/50 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm">
                              {note.icon || "🔔"}
                            </div>
                            <p className="text-gray-700 text-xs font-medium leading-relaxed">{note.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Total Students', value: statistics?.totalStudents || 0, icon: Users, color: 'purple', sub: 'Active Enrollment', path: 'students' },
            { title: 'Placed Alumni', value: statistics?.placedStudents || 0, icon: GraduationCap, color: 'emerald', sub: 'Successfully Career-Launched', path: 'placements' },
            { title: 'Placement Rate', value: `${statistics?.placementRate || 0}%`, icon: TrendingUp, color: 'pink', sub: 'Institutional Efficiency', path: 'statistics' },
            { title: 'Market Gaps', value: statistics?.unplacedStudents || 0, icon: Target, color: 'amber', sub: 'Ready for Opportunity', path: 'students' }
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard
                glow
                className="p-6 border-white/60 group cursor-pointer hover:border-purple-200"
                onClick={() => navigate(card.path)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl bg-${card.color}-50 text-${card.color}-600 group-hover:scale-110 transition-transform duration-500`}>
                    <card.icon size={24} />
                  </div>
                  <ArrowUpRight className="text-slate-200 group-hover:text-purple-500 transition-colors" size={20} />
                </div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.title}</h3>
                <p className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-2 group-hover:text-purple-600 transition-colors">{card.sub}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Placement Growth/Distribution */}
          <div className="lg:col-span-2">
            <GlassCard className="p-8 border-white/60 h-full" glow={false}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp size={20} className="text-purple-600" /> Career Trajectory
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Student placement distribution & reach</p>
                </div>
              </div>

              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { name: 'Mon', count: 12 },
                    { name: 'Tue', count: 18 },
                    { name: 'Wed', count: 15 },
                    { name: 'Thu', count: 22 },
                    { name: 'Fri', count: 30 },
                    { name: 'Sat', count: 25 },
                    { name: 'Sun', count: 35 },
                  ]}>
                    <defs>
                      <linearGradient id="colorPlacement" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorPlacement)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          {/* Skill Matrix */}
          <GlassCard className="p-8 border-white/60 h-full" glow={false}>
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Sparkles size={20} className="text-pink-600" /> Talent Inventory
              </h3>
              <p className="text-xs text-slate-400 font-medium">Dominant skills across enrollment</p>
            </div>

            <div className="space-y-5">
              {statistics?.topSkills?.slice(0, 6).map((skill, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>{skill.skill}</span>
                    <span className="text-slate-900">{skill.count} Students</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(skill.count / (statistics?.totalStudents || 1)) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50">
              <button
                onClick={() => navigate("statistics")}
                className="w-full py-4 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-purple-50 hover:text-purple-600 transition-all"
              >
                View All Talent Insights
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Student Spotlight / Recent Hires */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
          <GlassCard className="p-6 border-white/60 border-t-4 border-t-emerald-500" glow={false}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tight text-sm">
                <GraduationCap size={18} className="text-emerald-500" /> Recent Placements
              </h3>
              <button onClick={() => navigate("placements")}>
                <ArrowUpRight size={16} className="text-slate-300 hover:text-emerald-500 transition-colors" />
              </button>
            </div>
            <div className="space-y-4">
              {students.filter(s => s.isPlaced).slice(0, 4).map((s, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm">{s.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-none">{s.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Hired at {s.placedCompany}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-white/60 border-t-4 border-t-purple-500" glow={false}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tight text-sm">
                <BookOpen size={18} className="text-purple-500" /> Top Performers
              </h3>
              <button onClick={() => navigate("students")}>
                <ArrowUpRight size={16} className="text-slate-300 hover:text-purple-500 transition-colors" />
              </button>
            </div>
            <div className="space-y-4">
              {students.slice(0, 4).map((s, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-sm">{s.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-none">{s.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{s.skills?.slice(0, 2).join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-white/60 border-t-4 border-t-amber-500" glow={false}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tight text-sm">
                <Building2 size={18} className="text-amber-500" /> Active Hiring
              </h3>
              <button onClick={() => navigate("jobs")}>
                <ArrowUpRight size={16} className="text-slate-300 hover:text-amber-500 transition-colors" />
              </button>
            </div>
            <div className="space-y-4 text-center py-4">
              <p className="text-xs text-slate-400 font-medium px-4">See which companies are actively vetting your student pool through Career Bridge.</p>
              <button
                onClick={() => navigate("jobs")}
                className="mt-2 px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-slate-200 hover:bg-[#4b006e] transition-all"
              >
                View Ecosystem
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <CollegeSidebar />

        <main className="flex-1 h-full overflow-y-auto custom-scrollbar">
          <div className="p-8 min-h-full">
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
        </main>
      </div>
    </div>
  );
};

export default CollegeDashboard;
