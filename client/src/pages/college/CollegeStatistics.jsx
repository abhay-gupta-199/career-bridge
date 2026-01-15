import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CollegeStatistics = ({ statistics }) => {
  if (!statistics) return null;

  // Determine top skill for summary card
  const topSkill = statistics.topSkills?.reduce((prev, curr) => (prev.count > curr.count ? prev : curr), { skill: "-", count: 0 });

  return (
    <div className="flex-1 p-6 md:p-8 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 min-h-screen overflow-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-900">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Statistics & Insights
          </span>
        </h1>
        <p className="text-gray-600 mt-2 text-lg">Analytics to help you monitor and improve student outcomes</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 flex items-center gap-6 group hover:shadow-xl transition-all">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform">
            <span className="text-3xl">🎓</span>
          </div>
          <div>
            <p className="text-gray-500 font-semibold text-sm">Total Students</p>
            <p className="font-black text-gray-900 text-3xl">{statistics.totalStudents}</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 flex items-center gap-6 group hover:shadow-xl transition-all">
          <div className="p-4 bg-pink-100 text-pink-600 rounded-2xl group-hover:scale-110 transition-transform">
            <span className="text-3xl">💡</span>
          </div>
          <div>
            <p className="text-gray-500 font-semibold text-sm">Top Skill</p>
            <p className="font-black text-gray-900 text-2xl">{topSkill.skill} ({topSkill.count})</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 flex items-center gap-6 group hover:shadow-xl transition-all">
          <div className="p-4 bg-green-100 text-green-600 rounded-2xl group-hover:scale-110 transition-transform">
            <span className="text-3xl">📈</span>
          </div>
          <div>
            <p className="text-gray-500 font-semibold text-sm">Placement Rate</p>
            <p className="font-black text-gray-900 text-3xl">{statistics.placementRate}%</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graduation Year Distribution */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Graduation Year Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statistics.yearDistribution}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" fill="url(#purpleGradient)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#6D28D9" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skills Distribution */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Top Skills Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statistics.topSkills?.slice(0, 10)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
              <XAxis type="number" hide />
              <YAxis dataKey="skill" type="category" width={100} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" fill="url(#pinkGradient)" radius={[0, 6, 6, 0]} />
              <defs>
                <linearGradient id="pinkGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#BE185D" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Companies */}
      {statistics.topCompanies && statistics.topCompanies.length > 0 && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Top Placed Companies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {statistics.topCompanies.slice(0, 5).map((company, i) => (
              <div key={i} className="flex flex-col items-center p-4 bg-purple-50/50 rounded-xl border border-purple-100 hover:border-purple-300 transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                  <span className="text-purple-600 font-bold text-xl">{company.name.charAt(0)}</span>
                </div>
                <span className="text-gray-800 font-bold text-center mb-1 line-clamp-1">{company.name}</span>
                <span className="text-purple-600 font-black text-lg">{company.placedStudents}</span>
                <span className="text-gray-500 text-xs">Students</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeStatistics;
