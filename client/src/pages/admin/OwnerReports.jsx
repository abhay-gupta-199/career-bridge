import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import API from '../../api/axios'
import Navbar from '../../components/Navbar'
import OwnerSidebar from '../../components/OwnerSidebar'
import GlassCard from '../../components/ui/GlassCard'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts'
import {
  BarChart3,
  DownloadCloud,
  TrendingUp,
  Users,
  Briefcase,
  Layers,
  Sparkles,
  PieChart as PieIcon,
  Zap,
  RefreshCcw,
  ArrowRight
} from 'lucide-react'

export default function OwnerReports() {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalStudents: 0,
    placedStudents: 0,
    totalJobs: 0,
    topSkills: [],
    placementByCollege: []
  })

  useEffect(() => {
    fetchReportData()
  }, [])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/owner/reports')
      setStats(data)
    } catch (err) {
      console.error(err)
      alert('Failed to load reports data')
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = (data, filename) => {
    const csvRows = []
    const headers = Object.keys(data[0])
    csvRows.push(headers.join(','))
    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = ('' + row[header]).replace(/\"/g, '\\"')
        return `"${escaped}"`
      })
      csvRows.push(values.join(','))
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', `${filename}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleFullExport = async (type) => {
    setLoading(true);
    try {
      const endpoint = type === 'jobs' ? '/owner/reports/export/jobs' : '/owner/reports/export/students';
      const filename = type === 'jobs' ? 'opportunities_full_report' : 'users_full_report';
      const res = await API.get(endpoint);
      exportToCSV(res.data, filename);
    } catch (err) {
      console.error(`Export ${type} error:`, err);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#9333ea', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981']

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex pt-16 h-screen overflow-hidden">
        <OwnerSidebar />

        <main className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Reports & Analytics
              </h1>
              <p className="text-gray-500 font-medium">Cross-platform metrics and data-driven insights</p>
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFullExport('jobs')}
                disabled={loading}
                className="px-6 py-3 bg-white text-purple-600 font-bold rounded-2xl shadow-lg shadow-purple-500/5 hover:bg-purple-50 transition-all flex items-center gap-2 text-xs uppercase tracking-widest border border-purple-100 disabled:opacity-50"
              >
                <DownloadCloud size={18} />
                Export Jobs
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFullExport('students')}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all flex items-center gap-2 text-xs uppercase tracking-widest disabled:opacity-50"
              >
                <DownloadCloud size={18} />
                Export Users
              </motion.button>
            </div>
          </motion.div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Ecosystem Users', val: stats.totalStudents, icon: Users, color: 'purple' },
              { label: 'Placement Rate', val: `${Math.round((stats.placedStudents / (stats.totalStudents || 1)) * 100)}%`, icon: TrendingUp, color: 'pink' },
              { label: 'Market Liquidity', val: stats.totalJobs, icon: Briefcase, color: 'indigo' }
            ].map((m, i) => (
              <GlassCard key={i} className="p-6 border-white/50" glow={false}>
                <div className="flex items-center justify-between pointer-events-none">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
                    <p className="text-3xl font-bold text-slate-800">{m.val}</p>
                  </div>
                  <div className={`p-4 bg-${m.color}-100/50 rounded-3xl text-${m.color}-600`}>
                    <m.icon size={28} />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Skills Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-8 border-white/60 h-full" glow={false}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <Zap size={20} className="text-purple-600" /> Skill Distribution
                    </h3>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Student proficiency metrics</p>
                  </div>
                  <BarChart3 className="text-slate-200" size={32} />
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.topSkills} layout="vertical" margin={{ left: 20 }}>
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                      />
                      <RechartsTooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="count" radius={[0, 10, 10, 0]}>
                        {stats.topSkills.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </motion.div>

            {/* Institution Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-8 border-white/60 h-full" glow={false}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <Layers size={20} className="text-pink-600" /> Institution Metrics
                    </h3>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Placement rates by college</p>
                  </div>
                  <PieIcon className="text-slate-200" size={32} />
                </div>

                <div className="space-y-6">
                  {stats.placementByCollege.map((col, idx) => (
                    <div key={idx} className="group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">{col.name}</span>
                        <span className="text-sm font-bold text-purple-600">{col.rate}%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${col.rate}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className={`h-full bg-gradient-to-r ${idx % 2 === 0 ? 'from-purple-500 to-pink-500' : 'from-pink-500 to-red-500'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 p-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl group-hover:scale-150 transition-all" />
                  <h5 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2">Data Freshness</h5>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">Real-time Feed</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase">Last updated: {new Date().toLocaleTimeString()}</p>
                    </div>
                    <button onClick={fetchReportData} className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all">
                      <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
