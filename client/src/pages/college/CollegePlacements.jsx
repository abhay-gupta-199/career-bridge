import React, { useState } from "react";

const CollegePlacements = ({ students, updatePlacementStatus }) => {
  const [search, setSearch] = useState("");

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      (student.placedCompany || "").toLowerCase().includes(search.toLowerCase()) ||
      (student.isPlaced ? "placed" : "unplaced").includes(search.toLowerCase())
  );

  // Summary stats
  const totalStudents = students.length;
  const placedStudents = students.filter(s => s.isPlaced).length;
  const unplacedStudents = totalStudents - placedStudents;
  const placementRate = totalStudents ? Math.round((placedStudents / totalStudents) * 100) : 0;

  // Top companies
  const companyCountMap = {};
  students.forEach(s => {
    if (s.isPlaced && s.placedCompany) {
      companyCountMap[s.placedCompany] = (companyCountMap[s.placedCompany] || 0) + 1;
    }
  });
  const topCompanies = Object.entries(companyCountMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="flex-1 p-6 bg-gray-50 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Placements</h1>
        <p className="text-gray-600">Manage and track student placements</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <div className="text-blue-600 text-3xl">🎓</div>
          <div>
            <p className="text-gray-500 text-sm">Total Students</p>
            <p className="font-bold text-gray-900 text-xl">{totalStudents}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <div className="text-green-600 text-3xl">✅</div>
          <div>
            <p className="text-gray-500 text-sm">Placed Students</p>
            <p className="font-bold text-gray-900 text-xl">{placedStudents}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <div className="text-red-600 text-3xl">⚠️</div>
          <div>
            <p className="text-gray-500 text-sm">Unplaced Students</p>
            <p className="font-bold text-gray-900 text-xl">{unplacedStudents}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <div className="text-yellow-600 text-3xl">📈</div>
          <div>
            <p className="text-gray-500 text-sm">Placement Rate</p>
            <p className="font-bold text-gray-900 text-xl">{placementRate}%</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-end mb-2">
        <input
          type="text"
          placeholder="Search by name, company, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Placements Table */}
      <div className="card overflow-x-auto bg-white shadow rounded p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student._id} className={student.isPlaced ? "bg-green-50" : "bg-yellow-50"}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.placedCompany || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    student.isPlaced ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {student.isPlaced ? "Placed" : "Unplaced"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      const isPlaced = !student.isPlaced;
                      const placedCompany = isPlaced ? prompt("Enter company name:") : "";
                      if (isPlaced && placedCompany) {
                        updatePlacementStatus(student._id, isPlaced, placedCompany);
                      } else if (!isPlaced) {
                        updatePlacementStatus(student._id, isPlaced);
                      }
                    }}
                    className={`px-3 py-1 text-xs rounded ${
                      student.isPlaced ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {student.isPlaced ? "Mark Unplaced" : "Mark Placed"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Companies Section */}
      {topCompanies.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Placed Companies</h3>
          <ul className="space-y-2">
            {topCompanies.map((company, i) => (
              <li key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{company.name}</span>
                <span className="font-bold text-gray-900">{company.count} Students</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CollegePlacements;
