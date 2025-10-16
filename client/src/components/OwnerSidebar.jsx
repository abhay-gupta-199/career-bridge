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

  const gradientStyle = {
    background: 'linear-gradient(135deg, #10002b 0%, #4b006e 50%, #240046 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    <aside className="w-64 h-screen flex flex-col bg-white shadow-lg border-r border-gray-200">
      
      {/* Sidebar Header */}
      <div className="p-6 flex flex-col items-center text-center border-b border-gray-200">
        <div
          className="flex items-center justify-center w-14 h-14 rounded-xl shadow-lg"
          style={{ background: 'linear-gradient(135deg, #10002b 0%, #4b006e 100%)' }}
        >
          <FaTachometerAlt className="text-white text-2xl" />
        </div>
        <h2 className="mt-3 text-lg font-semibold text-gray-900">Admin Panel</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-4 space-y-2 px-3">
        {links.map(link => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-[#10002b] via-[#4b006e] to-[#240046] text-white shadow-lg"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-[#f0f0f5] hover:via-[#e0e0f0] hover:to-[#ffffff] hover:text-[#240046]"
              }`}
            >
              <span
                className="text-lg"
                style={isActive ? gradientStyle : { color: '#4b006e' }}
              >
                {link.icon}
              </span>
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-5 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">© 2025 Career Bridge</p>
      </div>
    </aside>
  );
};

export default OwnerSidebar;
