import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      className="sticky top-0 z-50 shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #10002b 0%, #4b006e 60%, #240046 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between h-16 items-center text-white">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <svg
              className="w-14 h-14 drop-shadow-lg"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.05)" />
              <circle cx="32" cy="32" r="28" stroke="url(#gradSilver)" strokeWidth="3" />
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
            <Link className="hover:text-gray-300 transition-colors px-3 py-2 rounded-md text-base font-medium" to="/">Home</Link>
            <Link className="hover:text-gray-300 transition-colors px-3 py-2 rounded-md text-base font-medium" to="/about">About</Link>
            <Link className="hover:text-gray-300 transition-colors px-3 py-2 rounded-md text-base font-medium" to="/jobs">Jobs</Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={`/${user.role}/dashboard`}
                  className="px-4 py-2 rounded-md text-base font-medium bg-white text-[#10002b] hover:bg-gradient-to-r hover:from-[#10002b] hover:via-[#4b006e] hover:to-[#240046] hover:text-white transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:bg-gradient-to-r hover:from-[#10002b] hover:via-[#4b006e] hover:to-[#240046] hover:text-white px-3 py-2 rounded-md text-base font-medium transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link className="hover:bg-gradient-to-r hover:from-[#10002b] hover:via-[#4b006e] hover:to-[#240046] hover:text-white px-3 py-2 rounded-md text-base font-medium transition-all" to="/login">Login</Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md text-base font-medium bg-white text-[#10002b] hover:bg-gradient-to-r hover:from-[#10002b] hover:via-[#4b006e] hover:to-[#240046] hover:text-white transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 pb-4 border-t border-white/20 text-white space-y-1">
            <Link className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gradient-to-r hover:from-[#10002b] hover:via-[#4b006e] hover:to-[#240046] hover:text-white transition-all" to="/">Home</Link>
            <Link className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gradient-to-r hover:from-[#10002b] hover:via-[#4b006e] hover:to-[#240046] hover:text-white transition-all" to="/about">About</Link>
            <Link className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gradient-to-r hover:from-[#10002b] hover:via-[#4b006e] hover:to-[#240046] hover:text-white transition-all" to="/jobs">Jobs</Link>

            {user ? (
              <>
                <Link
                  to={`/${user.role}/dashboard`}
                  className="block px-4 py-2 rounded-md text-base font-medium bg-white text-[#10002b] hover:bg-gradient-to-r hover:from-[#10002b] hover:via-[#4b006e] hover:to-[#240046] hover:text-white transition-all mt-2"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gradient-to-r hover:from-[#10002b] hover:via-[#4b006e] hover:to-[#240046] hover:text-white transition-all mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gradient-to-r hover:from-[#10002b] hover:via-[#4b006e] hover:to-[#240046] hover:text-white transition-all mt-2" to="/login">Login</Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 rounded-md text-base font-medium bg-white text-[#10002b] hover:bg-gradient-to-r hover:from-[#10002b] hover:via-[#4b006e] hover:to-[#240046] hover:text-white transition-all mt-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
