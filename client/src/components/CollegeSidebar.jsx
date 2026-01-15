import { NavLink } from "react-router-dom";
import { 
  FaHome, 
  FaUsers, 
  FaChartBar, 
  FaBriefcase, 
  FaUniversity,
  FaPlus,
  FaList
} from "react-icons/fa";

const CollegeSidebar = () => {
  const links = [
    { name: "Dashboard", path: "/college/dashboard", icon: <FaHome /> },
    { name: "Students", path: "/college/dashboard/students", icon: <FaUsers /> },
    { name: "Statistics", path: "/college/dashboard/statistics", icon: <FaChartBar /> },
    { name: "Placements", path: "/college/dashboard/placements", icon: <FaBriefcase /> },
    { name: "Post Job", path: "/college/dashboard/post-job", icon: <FaPlus />, badge: "NEW" },
    { name: "My Jobs", path: "/college/dashboard/jobs", icon: <FaList /> },
  ];

  const gradientStyle = {
    background: 'linear-gradient(135deg, #10002b 0%, #4b006e 50%, #240046 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    <div className="w-64 h-screen bg-white shadow-lg flex flex-col border-r border-gray-200">
      {/* Sidebar Header */}
      <div className="p-6 flex flex-col items-center text-center border-b border-gray-200">
        <div
          className="flex items-center justify-center w-14 h-14 rounded-xl shadow-lg"
          style={{ background: 'linear-gradient(135deg, #10002b 0%, #4b006e 100%)' }}
        >
          <FaUniversity className="text-white text-2xl" />
        </div>
        <h1 className="mt-3 text-lg font-semibold text-gray-900">College Panel</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-4 space-y-2 px-3">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative ${
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
                  style={isActive ? gradientStyle : { color: '#4b006e' }}
                >
                  {link.icon}
                </span>
                <span>{link.name}</span>
                {link.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {link.badge}
                  </span>
                )}
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

export default CollegeSidebar;
