import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Target,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import GlassCard from "../../components/ui/GlassCard";

const CollegeStatistics = ({ statistics }) => {
  if (!statistics) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Processing Analytics...</p>
    </div>
  );

  const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  // Determine top skill for summary card
  const topSkill = statistics.topSkills?.reduce((prev, curr) => (prev.count > curr.count ? prev : curr), { skill: "-", count: 0 });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Analytics & Insights
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-gray-500 font-medium">Deep dive into institutional performance metrics</p>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={10} /> Real-time Data
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Total Enrollment', value: statistics.totalStudents, icon: Users, color: 'indigo', sub: 'Student Database' },
          { title: 'Dominant Skill', value: topSkill.skill, icon: Target, color: 'emerald', sub: `${topSkill.count} Proficiency Count` },
          { title: 'Success Rate', value: `${statistics.placementRate}%`, icon: TrendingUp, color: 'amber', sub: 'Placement Benchmark' }
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard glow={i === 2} className="p-6 border-white/60 group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-${card.color}-50 text-${card.color}-600 group-hover:scale-110 transition-transform duration-500`}>
                  <card.icon size={24} />
                </div>
              </div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.title}</h3>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-2">{card.sub}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graduation Year Distribution */}
        <GlassCard className="p-8 border-white/60" glow={false}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Calendar size={20} className="text-indigo-600" /> Graduation Timeline
              </h3>
              <p className="text-xs text-slate-400 font-medium">Distribution of candidates by batch year</p>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statistics.yearDistribution}>
                <defs>
                  <linearGradient id="colorYear" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorYear)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Skills Distribution */}
        <GlassCard className="p-8 border-white/60" glow={false}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 size={20} className="text-emerald-600" /> Talent Density
              </h3>
              <p className="text-xs text-slate-400 font-medium">Top 5 technical competencies in pool</p>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statistics.topSkills?.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="skill"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                  width={100}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Bar
                  dataKey="count"
                  fill="#10b981"
                  radius={[0, 8, 8, 0]}
                  barSize={32}
                >
                  {statistics.topSkills?.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Outcome Pie */}
        <GlassCard className="p-8 border-white/60 flex flex-col items-center justify-center text-center" glow={false}>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Outcome Ratio</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Placed', value: statistics.placedStudents },
                    { name: 'Unplaced', value: statistics.unplacedStudents }
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f1f5f9" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-slate-900">{statistics.placementRate}%</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Overall Placement Efficacy</p>
          </div>
        </GlassCard>

        {/* Top Companies */}
        <div className="lg:col-span-2">
          <GlassCard className="p-8 border-white/60 h-full" glow={false}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Target size={20} className="text-amber-500" /> Strategic Partners
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Hiring Entities</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(statistics.topCompanies || []).length === 0 ? (
                <div className="md:col-span-2 text-center py-10 opacity-30">
                  <p className="text-[10px] font-black uppercase tracking-widest">Awaiting company participation data...</p>
                </div>
              ) : (
                statistics.topCompanies.slice(0, 4).map((company, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-amber-200 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-amber-600 shadow-sm">{company.name.charAt(0)}</div>
                      <span className="font-bold text-slate-700">{company.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900 leading-none">{company.placedStudents}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Offers</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default CollegeStatistics;

