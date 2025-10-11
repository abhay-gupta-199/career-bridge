import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Sidebar = () => {
  const { user } = useAuth()

  const studentLinks = [
    { name: 'Dashboard', href: '/student/dashboard', icon: '📊' },
    { name: 'Jobs', href: '/student/jobs', icon: '💼' },
    { name: 'Applications', href: '/student/applications', icon: '📝' },
    { name: 'Roadmaps', href: '/student/roadmaps', icon: '🗺️' },
    { name: 'Notifications', href: '/student/notifications', icon: '🔔' },
    { name: 'Profile', href: '/student/profile', icon: '👤' }
  ]

  const collegeLinks = [
    { name: 'Dashboard', href: '/college/dashboard', icon: '📊' },
    { name: 'Students', href: '/college/students', icon: '👥' },
    { name: 'Statistics', href: '/college/statistics', icon: '📈' },
    { name: 'Placements', href: '/college/placements', icon: '🎯' },
    { name: 'Profile', href: '/college/profile', icon: '👤' }
  ]

  const ownerLinks = [
    { name: 'Dashboard', href: '/owner/dashboard', icon: '📊' },
    { name: 'Jobs', href: '/owner/jobs', icon: '💼' },
    { name: 'Students', href: '/owner/students', icon: '👥' },
    { name: 'Colleges', href: '/owner/colleges', icon: '🏫' },
    { name: 'Analytics', href: '/owner/analytics', icon: '📈' },
    { name: 'Profile', href: '/owner/profile', icon: '👤' }
  ]

  const getLinks = () => {
    switch (user?.role) {
      case 'student':
        return studentLinks
      case 'college':
        return collegeLinks
      case 'owner':
        return ownerLinks
      default:
        return []
    }
  }

  const links = getLinks()

  return (
    <div className="bg-white shadow-lg h-full w-64 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CB</span>
          </div>
          <span className="ml-2 text-lg font-semibold text-gray-900">Career Bridge</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.href}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="text-lg mr-3">{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-medium text-sm">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
