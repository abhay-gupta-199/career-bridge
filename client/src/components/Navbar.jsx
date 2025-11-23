import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Home,
  Info,
  Briefcase,
  LogIn,
  UserPlus,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  UserCircle2,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { to: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
    { to: "/about", label: "About", icon: <Info className="w-5 h-5" /> },
    { to: "/jobs", label: "Jobs", icon: <Briefcase className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg shadow-lg border-b border-white/10"
        style={{
          background:
            "linear-gradient(135deg, rgba(16,0,43,0.95) 0%, rgba(75,0,110,0.95) 60%, rgba(36,0,70,0.95) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between h-16 items-center text-white">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <svg
                className="w-12 h-12 drop-shadow-lg group-hover:scale-110 transition-transform"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.05)" />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="url(#gradSilver)"
                  strokeWidth="3"
                />
                <circle cx="20" cy="24" r="3" fill="#ffffff" />
                <circle cx="44" cy="24" r="3" fill="#ffffff" />
                <circle cx="32" cy="40" r="3" fill="#ffffff" />
                <line x1="20" y1="24" x2="32" y2="40" stroke="#ffffff" strokeWidth="2" />
                <line x1="32" y1="40" x2="44" y2="24" stroke="#ffffff" strokeWidth="2" />
                <line x1="20" y1="24" x2="44" y2="24" stroke="#ffffff" strokeWidth="2" />
                <defs>
                  <linearGradient id="gradSilver" x1="0" y1="0" x2="64" y2="64">
                    <stop offset="0%" stopColor="#e0e0e0" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-2xl font-bold tracking-tight">Career Bridge</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-all ${
                      isActive
                        ? "bg-white text-[#10002b]"
                        : "hover:text-gray-300 hover:bg-white/10"
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                  >
                    <UserCircle2 className="w-6 h-6" />
                    <span className="hidden sm:inline">{user.name || "User"}</span>
                  </button>

                  {showProfile && (
                    <div className="absolute right-0 mt-3 w-48 bg-white text-[#10002b] rounded-xl shadow-lg overflow-hidden">
                      <Link
                        to={`/${user.role}/dashboard`}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition-all"
                        onClick={() => setShowProfile(false)}
                      >
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-gray-100 transition-all"
                      >
                        <LogOut className="w-5 h-5" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 hover:text-gray-100 transition-all"
                  >
                    <LogIn className="w-5 h-5" /> Login
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-base font-medium bg-white text-[#10002b] hover:bg-gradient-to-r hover:from-[#10002b] hover:via-[#4b006e] hover:to-[#240046] hover:text-white transition-all"
                  >
                    <UserPlus className="w-5 h-5" /> Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
                {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden mt-2 pb-4 border-t border-white/20 text-white space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-all"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    to={`/${user.role}/dashboard`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-base font-medium bg-white text-[#10002b] hover:bg-gradient-to-r hover:from-[#10002b] hover:via-[#4b006e] hover:to-[#240046] hover:text-white transition-all mt-2"
                  >
                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-all mt-2"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-all mt-2"
                  >
                    <LogIn className="w-5 h-5" /> Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-base font-medium bg-white text-[#10002b] hover:bg-gradient-to-r hover:from-[#10002b] hover:via-[#4b006e] hover:to-[#240046] hover:text-white transition-all mt-2"
                  >
                    <UserPlus className="w-5 h-5" /> Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* SPACER OUTSIDE NAVBAR */}
      <div className="h-16 md:h-16" aria-hidden="true"></div>
    </>
  );
};

export default Navbar;
