import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {/* Smaller glowing AI logo */}
            <svg
              className="w-10 h-10"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer glowing circle */}
              <circle cx="32" cy="32" r="30" stroke="url(#gradGlow)" strokeWidth="3" filter="url(#glow)"/>
              
              {/* Connected nodes */}
              <circle cx="20" cy="24" r="3" fill="#4F46E5" filter="url(#glow)"/>
              <circle cx="44" cy="24" r="3" fill="#6366F1" filter="url(#glow)"/>
              <circle cx="32" cy="40" r="3" fill="#8B5CF6" filter="url(#glow)"/>
              
              {/* Connecting lines */}
              <line x1="20" y1="24" x2="32" y2="40" stroke="#A78BFA" strokeWidth="2" filter="url(#glow)"/>
              <line x1="32" y1="40" x2="44" y2="24" stroke="#818CF8" strokeWidth="2" filter="url(#glow)"/>
              <line x1="20" y1="24" x2="44" y2="24" stroke="#6366F1" strokeWidth="2" filter="url(#glow)"/>
              
              {/* Gradients & glow */}
              <defs>
                <linearGradient id="gradGlow" x1="0" y1="0" x2="64" y2="64">
                  <stop offset="0%" stopColor="#4F46E5"/>
                  <stop offset="50%" stopColor="#6366F1"/>
                  <stop offset="100%" stopColor="#8B5CF6"/>
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.5" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
            </svg>

            <span className="text-white text-2xl font-bold tracking-tight">
              Career Bridge
            </span>
          </Link>

          {/* Menu Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              About
            </Link>
            <Link
              to="/jobs"
              className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Jobs
            </Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={`/${user.role}/dashboard`}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-md text-base font-medium hover:from-blue-600 hover:to-indigo-600 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-md text-base font-medium hover:from-blue-600 hover:to-indigo-600 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
