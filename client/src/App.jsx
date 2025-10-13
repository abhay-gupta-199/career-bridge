import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import StudentDashboard from './pages/StudentDashboard'
import CollegeDashboard from './pages/college/CollegeDashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/college/dashboard/*" 
            element={
              <ProtectedRoute role="college">
                <CollegeDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/owner/dashboard" 
            element={
              <ProtectedRoute role="owner">
                <OwnerDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
