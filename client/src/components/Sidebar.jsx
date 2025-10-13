import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '', icon: '🏠' },
    { name: 'Students', path: 'students', icon: '🎓' },
    { name: 'Statistics', path: 'statistics', icon: '📊' },
    { name: 'Placements', path: 'placements', icon: '💼' },
    { name: 'Profile', path: 'profile', icon: '👤' },
  ]

  return (
    <aside className="bg-white shadow-lg w-64 flex-shrink-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-8">College Panel</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 ${
                  isActive ? 'bg-blue-100 text-blue-600' : ''
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar