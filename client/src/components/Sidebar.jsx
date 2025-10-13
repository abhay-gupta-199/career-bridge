import { useAuth } from '../contexts/AuthContext'

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth()

  const studentLinks = [
    { name: 'Dashboard', icon: '📊', tab: 'dashboard' },
    { name: 'Jobs', icon: '💼', tab: 'jobs' },
    { name: 'Applications', icon: '📝', tab: 'applications' },
    { name: 'Roadmaps', icon: '🗺️', tab: 'roadmaps' },
    { name: 'Notifications', icon: '🔔', tab: 'notifications' },
    { name: 'Profile', icon: '👤', tab: 'profile' },
  ]

  const collegeLinks = [
    { name: 'Dashboard', icon: '📊', tab: 'dashboard' },
    { name: 'Students', icon: '👥', tab: 'students' },
    { name: 'Statistics', icon: '📈', tab: 'statistics' },
    { name: 'Placements', icon: '🎯', tab: 'placements' },
    { name: 'Profile', icon: '👤', tab: 'profile' },
  ]

  const ownerLinks = [
    { name: 'Dashboard', icon: '📊', tab: 'dashboard' },
    { name: 'Jobs', icon: '💼', tab: 'jobs' },
    { name: 'Students', icon: '👥', tab: 'students' },
    { name: 'Colleges', icon: '🏫', tab: 'colleges' },
    { name: 'Analytics', icon: '📈', tab: 'analytics' },
    { name: 'Profile', icon: '👤', tab: 'profile' },
  ]

  const getLinks = () => {
    switch (user?.role) {
      case 'student': return studentLinks
      case 'college': return collegeLinks
      case 'owner': return ownerLinks
      default: return []
    }
  }

  const links = getLinks()

  return (
    <div className="bg-white shadow-lg h-screen w-64 flex flex-col">
      

      {/* Sidebar Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => (
          <button
            key={link.name}
            onClick={() => setActiveTab(link.tab)}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium flex items-center ${
              activeTab === link.tab
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <span className="text-lg mr-3">{link.icon}</span>
            {link.name}
          </button>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium text-sm">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
