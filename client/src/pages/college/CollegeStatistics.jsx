import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CollegeStatistics = ({ statistics }) => {
  if (!statistics) return null;

  // Determine top skill for summary card
  const topSkill = statistics.topSkills?.reduce((prev, curr) => (prev.count > curr.count ? prev : curr), { skill: "-", count: 0 });

  return (
    <div className="flex-1 p-6 bg-gray-50 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Statistics & Insights</h1>
        <p className="text-gray-600">Analytics to help you monitor and improve student outcomes</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <div className="text-blue-600 text-3xl">🎓</div>
          <div>
            <p className="text-gray-500 text-sm">Total Students</p>
            <p className="font-bold text-gray-900 text-xl">{statistics.totalStudents}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <div className="text-green-600 text-3xl">💡</div>
          <div>
            <p className="text-gray-500 text-sm">Top Skill</p>
            <p className="font-bold text-gray-900 text-xl">{topSkill.skill} ({topSkill.count})</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <div className="text-yellow-600 text-3xl">📈</div>
          <div>
            <p className="text-gray-500 text-sm">Average Placement Rate</p>
            <p className="font-bold text-gray-900 text-xl">{statistics.placementRate}%</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graduation Year Distribution */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Graduation Year Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statistics.yearDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skills Distribution */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Skills Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statistics.topSkills?.slice(0, 10)} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="skill" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Companies */}
      {statistics.topCompanies && statistics.topCompanies.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Placed Companies</h3>
          <ul className="space-y-2">
            {statistics.topCompanies.slice(0, 5).map((company, i) => (
              <li key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{company.name}</span>
                <span className="font-bold text-gray-900">{company.placedStudents} Students</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CollegeStatistics;
