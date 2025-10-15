import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

// 🌐 Public Pages
import LandingPage from './pages/LandingPage'
import About from './pages/About'
import Jobs from './pages/Jobs'
import Login from './pages/Login'
import Signup from './pages/Signup'

// 🎓 Dashboards
import StudentDashboard from './pages/StudentDashboard'
import CollegeDashboard from './pages/college/CollegeDashboard'

// 🧩 Owner (Admin) Pages
import OwnerDashboard from './pages/admin/OwnerDashboard'
import OwnerUsers from './pages/admin/OwnerUsers'
import OwnerDepartments from './pages/admin/OwnerDepartments'
import OwnerOpportunities from './pages/admin/OwnerOpportunities'
import OwnerNotifications from './pages/admin/OwnerNotifications'
import OwnerFeedback from './pages/admin/OwnerFeedback'
import OwnerReports from './pages/admin/OwnerReports'
import OwnerSettings from './pages/admin/OwnerSettings'

// 🔐 Route Protection
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="App">
          <Routes>
            {/* ---------- 🌐 Public Routes ---------- */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ---------- 🎓 Student Dashboard ---------- */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* ---------- 🏫 College Dashboard ---------- */}
            <Route
              path="/college/dashboard/*"
              element={
                <ProtectedRoute role="college">
                  <CollegeDashboard />
                </ProtectedRoute>
              }
            />

            {/* ---------- 🧩 Owner (Admin) Dashboard ---------- */}
            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute role="owner">
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/users"
              element={
                <ProtectedRoute role="owner">
                  <OwnerUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/departments"
              element={
                <ProtectedRoute role="owner">
                  <OwnerDepartments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/opportunities"
              element={
                <ProtectedRoute role="owner">
                  <OwnerOpportunities />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/notifications"
              element={
                <ProtectedRoute role="owner">
                  <OwnerNotifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/feedback"
              element={
                <ProtectedRoute role="owner">
                  <OwnerFeedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/reports"
              element={
                <ProtectedRoute role="owner">
                  <OwnerReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/settings"
              element={
                <ProtectedRoute role="owner">
                  <OwnerSettings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
