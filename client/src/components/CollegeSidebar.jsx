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
    { name: "Placements", path: "/college/dashboard/placements", icon: <FaBriefcase /> },
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-gray-800 shadow-md flex flex-col border-r border-blue-200">
      {/* Sidebar Header */}
      <div className="p-6 flex flex-col items-center text-center border-b border-blue-200">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-xl shadow-md">
          <FaUniversity className="text-xl" />
        </div>
        <h1 className="mt-3 text-lg font-semibold text-blue-800">College Panel</h1>

      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-4 space-y-1 px-3">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
              }`
            }
          >
            <span className="text-base">{link.icon}</span>
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-5 border-t border-blue-200 text-center">
        <p className="text-xs text-gray-500">© 2025 Career Bridge</p>
      </div>
    </div>
  );
};

export default CollegeSidebar;
