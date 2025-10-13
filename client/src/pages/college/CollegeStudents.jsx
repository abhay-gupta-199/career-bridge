import React from "react";
import { FaCheckCircle, FaTimesCircle, FaUserGraduate } from "react-icons/fa";

const CollegeStudents = ({ students, updatePlacementStatus, loading }) => {
  return (
    <div className="flex-1 p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaUserGraduate className="text-blue-600" /> Students
        </h1>
        <p className="text-gray-600">Manage your college's student records efficiently</p>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-primary-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Graduation Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {student.skills?.slice(0, 2).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">{skill}</span>
                      ))}
                      {student.skills?.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{student.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.graduationYear || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                      student.isPlaced ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {student.isPlaced ? <FaCheckCircle /> : <FaTimesCircle />}
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
                      className={`px-3 py-1 text-xs rounded font-medium transition ${
                        student.isPlaced
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {student.isPlaced ? "Mark Unplaced" : "Mark Placed"}
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CollegeStudents;
