import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaBuilding, 
  FaBriefcase, 
  FaBell, 
  FaCommentDots, 
  FaFileAlt, 
  FaCog 
} from "react-icons/fa";

const OwnerSidebar = () => {
  const { pathname } = useLocation();
  const { isDarkMode } = useTheme();

  const links = [
    { name: "Dashboard", path: "/owner/dashboard", icon: <FaTachometerAlt /> },
    { name: "Users", path: "/owner/users", icon: <FaUsers /> },
    { name: "Departments", path: "/owner/departments", icon: <FaBuilding /> },
    { name: "Opportunities", path: "/owner/opportunities", icon: <FaBriefcase /> },
    { name: "Notifications", path: "/owner/notifications", icon: <FaBell /> },
    { name: "Feedback", path: "/owner/feedback", icon: <FaCommentDots /> },
    { name: "Reports", path: "/owner/reports", icon: <FaFileAlt /> },
    { name: "Settings", path: "/owner/settings", icon: <FaCog /> },
  ];

  return (
    <aside className={`w-64 h-screen flex flex-col shadow-lg border-r 
      ${isDarkMode 
        ? "bg-gray-900 text-gray-200 border-gray-700" 
        : "bg-gradient-to-b from-blue-50 to-blue-100 text-gray-800 border-blue-200"}`}>
      
      {/* Sidebar Header */}
      <div className={`p-6 flex flex-col items-center text-center border-b 
        ${isDarkMode ? "border-gray-700" : "border-blue-200"}`}>
        <div className={`flex items-center justify-center w-14 h-14 rounded-xl shadow-lg 
          ${isDarkMode ? "bg-gray-800 text-white" : "bg-gradient-to-br from-blue-500 to-indigo-500 text-white"}`}>
          <FaTachometerAlt className="text-2xl" />
        </div>
        <h2 className={`mt-3 text-lg font-semibold ${isDarkMode ? "text-gray-200" : "text-blue-800"}`}>
          Admin Panel
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-4 space-y-2 px-3">
        {links.map(link => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive
                  ? `${isDarkMode ? "bg-gray-700 text-white shadow-md" : "bg-blue-600 text-white shadow-md"}`
                  : `${isDarkMode ? "text-gray-200 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"}`
              }`}
            >
              <span className={`text-lg ${isActive ? "text-white" : isDarkMode ? "text-gray-200" : "text-blue-600"}`}>
                {link.icon}
              </span>
              <span className="flex-1">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`p-5 border-t text-center ${isDarkMode ? "border-gray-700 text-gray-500" : "border-blue-200 text-gray-500"}`}>
        <p className="text-xs">© 2025 Career Bridge</p>
      </div>
    </aside>
  );
};

export default OwnerSidebar;
