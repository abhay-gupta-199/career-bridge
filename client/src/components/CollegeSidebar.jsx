import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Briefcase,
  PlusCircle,
  ListTodo,
  School,
  LogOut
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const CollegeSidebar = () => {
  const { logout } = useAuth();

  const links = [
    { name: "Dashboard", path: "/college/dashboard", icon: LayoutDashboard },
    { name: "Students", path: "/college/dashboard/students", icon: Users },
    { name: "Statistics", path: "/college/dashboard/statistics", icon: BarChart3 },
    { name: "Placements", path: "/college/dashboard/placements", icon: Briefcase },
    { name: "Post Job", path: "/college/dashboard/post-job", icon: PlusCircle, badge: "NEW" },
    { name: "My Jobs", path: "/college/dashboard/jobs", icon: ListTodo },
  ];

  return (
    <aside className="w-64 h-full bg-white shadow-lg flex flex-col border-r border-gray-200">
      {/* Sidebar Header */}
      <div className="p-6 flex flex-col items-center text-center border-b border-gray-200">
        <div
          className="flex items-center justify-center w-14 h-14 rounded-2xl shadow-xl bg-gradient-to-br from-[#10002b] to-[#4b006e]"
        >
          <School className="text-white" size={32} />
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900 tracking-tight">College Panel</h2>
        <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-1">Management Hub</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-6 space-y-1.5 px-4 overflow-y-auto custom-scrollbar">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 group ${isActive
                ? "bg-gradient-to-r from-[#10002b] via-[#4b006e] to-[#240046] text-white shadow-lg shadow-purple-900/20"
                : "text-slate-500 hover:bg-purple-50 hover:text-[#4b006e]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon
                  size={20}
                  className={isActive ? "text-white" : "text-[#4b006e] group-hover:text-[#4b006e] transition-colors"}
                />
                <span className="flex-1">{link.name}</span>
                {link.badge && (
                  <span className="flex h-5 w-10 items-center justify-center rounded-full bg-pink-500 text-[10px] font-black uppercase text-white ring-2 ring-white">
                    {link.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span>Sign Out</span>
        </button>
        <div className="mt-4 text-center">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">© 2025 Career Bridge</p>
        </div>
      </div>
    </aside>
  );
};

export default CollegeSidebar;

