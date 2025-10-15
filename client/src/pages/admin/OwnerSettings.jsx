import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import OwnerSidebar from '../../components/OwnerSidebar'
import { useTheme } from '../../contexts/ThemeContext'

export default function OwnerSettings() {
  const { isDarkMode, toggleTheme } = useTheme()

  // Notification states
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    inApp: true,
  })

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications')
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications))
  }, [])

  // Save notification changes
  const toggleNotification = (type) => {
    const updated = { ...notifications, [type]: !notifications[type] }
    setNotifications(updated)
    localStorage.setItem('notifications', JSON.stringify(updated))
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />

      <div className="flex flex-1">
        <OwnerSidebar />

        <main className="flex-1 p-6 space-y-6">
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="mb-6">Configure admin preferences</p>

          {/* Theme Toggle */}
          <div className={`rounded-lg p-6 flex items-center justify-between ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white shadow'}`}>
            <div>
              <h3 className="text-lg font-semibold">Theme</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Toggle between Light and Dark mode
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`px-4 py-2 rounded ${isDarkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-900 text-white'}`}
            >
              {isDarkMode ? 'Dark' : 'Light'}
            </button>
          </div>

          {/* Notifications */}
          <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white shadow'}`}>
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            <div className="flex flex-col gap-2">
              {['email', 'sms', 'inApp'].map((type) => (
                <label key={type} className="flex items-center justify-between">
                  <span className="capitalize">{type}</span>
                  <input
                    type="checkbox"
                    checked={notifications[type]}
                    onChange={() => toggleNotification(type)}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* System Configurations */}
          <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white shadow'}`}>
            <h3 className="text-lg font-semibold mb-2">System Configurations</h3>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Manage API keys, integrations, and platform settings.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
