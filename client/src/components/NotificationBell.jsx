import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Loader } from 'lucide-react';
import API from '../api/axios';
import NotificationCard from './NotificationCard';

/**
 * NotificationBell Component
 * Shows notification icon with unread count badge
 * Displays dropdown with recent notifications
 */
const NotificationBell = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications
  useEffect(() => {
    if (!user) return;
    fetchNotifications();

    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/student/notifications');
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await API.put(`/student/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await API.post(`/student/jobs/${jobId}/apply`);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Failed to apply:', error);
      alert('Failed to apply for job');
    }
  };

  const handleCloseNotification = async (notificationId) => {
    if (!notifications.find(n => n._id === notificationId)?.isRead) {
      await handleMarkAsRead(notificationId);
    }
    setNotifications(prev => prev.filter(n => n._id !== notificationId));
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
        title={`${unreadCount} unread notifications`}
      >
        <Bell size={24} />

        {/* Unread Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-white text-blue-600 font-bold text-xs px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader className="animate-spin text-blue-600" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell size={40} className="mx-auto mb-3 text-gray-300" />
                <p>No notifications yet</p>
                <p className="text-xs mt-1">New job matches will appear here</p>
              </div>
            ) : (
              <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                {notifications.map(notification => (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => handleMarkAsRead(notification._id)}
                  >
                    <NotificationCard
                      notification={notification}
                      onClose={() => handleCloseNotification(notification._id)}
                      onApply={handleApply}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="sticky bottom-0 bg-gray-50 border-t p-3 rounded-b-lg">
                <a
                  href="/notifications"
                  className="block w-full text-center text-blue-600 font-medium hover:text-blue-700 transition"
                >
                  View All Notifications →
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close on outside click */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
