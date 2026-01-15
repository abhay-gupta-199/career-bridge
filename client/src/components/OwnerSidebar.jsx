import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Megaphone,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const OwnerSidebar = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const links = [
    { name: "Dashboard", path: "/owner/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/owner/users", icon: Users },
    { name: "Colleges", path: "/owner/departments", icon: Building2 },
    { name: "Opportunities", path: "/owner/opportunities", icon: Briefcase },
    { name: "Announcements", path: "/owner/notifications", icon: Megaphone },
    { name: "Feedback", path: "/owner/feedback", icon: MessageSquare },
    { name: "Reports", path: "/owner/reports", icon: BarChart3 },
    { name: "Settings", path: "/owner/settings", icon: Settings },
  ];

  const gradientStyle = {
    background: 'linear-gradient(135deg, #10002b 0%, #4b006e 50%, #240046 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    <aside className="w-72 h-screen flex flex-col bg-white shadow-2xl shadow-indigo-500/5 sticky top-0 z-50 border-r border-gray-100/50 flex-shrink-0">
      {/* Sidebar Header */}
      <div className="p-8 pb-6 flex flex-col items-center">
        <div className="relative">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #10002b 0%, #4b006e 100%)' }}
          >
            <ShieldCheck className="text-white" size={28} />
          </div>
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-xl font-bold text-slate-800">
            Owner Portal
          </h2>
          <div className="flex items-center gap-1.5 mt-1 justify-center">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-xs font-medium text-slate-400">Administrator</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-6 space-y-2 px-4">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
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
                  <link.icon size={20} />
                </span>
                <span>{link.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-6 border-t border-slate-100 mt-auto">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-all duration-200 group"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>

        <div className="mt-6 flex flex-col items-center gap-1">
          <p className="text-xs font-semibold text-slate-300">Career Bridge</p>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Admin Panel</p>
        </div>
      </div>
    </aside>
  );
};

export default OwnerSidebar;
