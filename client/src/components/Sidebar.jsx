import { NavLink } from "react-router-dom";
import { 
  FaHome, 
  FaBriefcase, 
  FaClipboardList, 
  FaMapMarkedAlt, 
  FaBell, 
  FaUserGraduate, 
  FaRobot 
} from "react-icons/fa";

const Sidebar = () => {
  const links = [
    { name: "Dashboard", path: "/student/dashboard", icon: <FaHome /> },
    { name: "Jobs", path: "/student/jobs", icon: <FaBriefcase /> },
    { name: "Applications", path: "/student/applications", icon: <FaClipboardList /> },
    { name: "Roadmaps", path: "/student/roadmaps", icon: <FaMapMarkedAlt /> },
    { name: "AI Recommendations", path: "/student/ai-recommendations", icon: <FaRobot /> },
    { name: "Notifications", path: "/student/notifications", icon: <FaBell /> },
    { name: "Profile", path: "/student/profile", icon: <FaUserGraduate /> },
  ];

  return (
    <div className="w-64 h-screen bg-white shadow-lg flex flex-col border-r border-gray-200">
      {/* Sidebar Header */}
      <div className="p-6 flex flex-col items-center text-center border-b border-gray-200">
        <div
          className="flex items-center justify-center w-14 h-14 rounded-xl shadow-lg"
          style={{ background: 'linear-gradient(135deg, #10002b 0%, #4b006e 100%)' }}
        >
          <FaUserGraduate className="text-white text-2xl" />
        </div>
        <h1 className="mt-3 text-lg font-semibold text-gray-900">Student Panel</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-4 space-y-2 px-3">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-[#10002b] via-[#4b006e] to-[#240046] text-white shadow-lg"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-[#f0f0f5] hover:via-[#e0e0f0] hover:to-[#ffffff] hover:text-[#240046]"
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
      <div className="p-5 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">© 2025 Career Bridge</p>
      </div>
    </div>
  );
};

export default Sidebar;
