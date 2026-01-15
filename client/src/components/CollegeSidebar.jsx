import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaChartBar,
  FaBriefcase,
  FaUniversity
} from "react-icons/fa";

const CollegeSidebar = () => {
  const links = [
    { name: "Dashboard", path: "/college/dashboard", icon: <FaHome /> },
    { name: "Students", path: "/college/dashboard/students", icon: <FaUsers /> },
    { name: "Statistics", path: "/college/dashboard/statistics", icon: <FaChartBar /> },
    { name: "Jobs", path: "/college/dashboard/jobs", icon: <FaBriefcase /> },
    { name: "Placements", path: "/college/dashboard/placements", icon: <FaBriefcase /> },
  ];

  const gradientStyle = {
    background: 'linear-gradient(135deg, #10002b 0%, #4b006e 50%, #240046 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    <div className="w-64 h-screen bg-white shadow-xl flex flex-col border-r border-gray-200">
      {/* Sidebar Header */}
      <div className="p-6 flex flex-col items-center text-center border-b border-gray-100">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-xl shadow-md mb-3"
          style={{ background: 'linear-gradient(135deg, #10002b 0%, #4b006e 100%)' }}
        >
          <FaUniversity className="text-white text-2xl" />
        </div>
        <h1 className="text-lg font-bold text-gray-800">College Portal</h1>
        <p className="text-xs text-gray-500 mt-1">Manage Students & Placements</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-6 space-y-2 px-4">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end={link.path === "/college/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                ? "bg-gradient-to-r from-[#10002b] via-[#4b006e] to-[#240046] text-white shadow-lg translate-x-1"
                : "text-gray-700 hover:bg-gradient-to-r hover:from-[#f0f0f5] hover:via-[#e0e0f0] hover:to-[#ffffff] hover:text-[#240046] hover:translate-x-1"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="text-lg"
                  style={isActive ? {
                    background: 'linear-gradient(135deg, #10002b, #4b006e, #240046)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  } : { color: '#4b006e' }}
                >
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 text-center">
          <p className="text-xs font-semibold text-blue-800">Career Bridge</p>
          <p className="text-[10px] text-blue-600 mt-1">Empowering Future Careers</p>
        </div>
      </div>
    </div>
  );
};

export default CollegeSidebar;
