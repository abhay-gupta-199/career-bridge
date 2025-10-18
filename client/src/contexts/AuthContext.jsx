import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    setLoading(false)
  }, [])

  // Password-based login
  const login = async (email, password, role) => {
    try {
  const response = await axios.post('/api/auth/login', { email, password, role }, { withCredentials: true })
      // If backend indicates 2FA is required, return that to caller so UI can prompt for OTP
      if (response.data?.requiresOtp) {
        return { success: false, requiresOtp: true, message: response.data.message }
      }

      const { token, user: userData } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(userData)

      return { success: true, user: userData }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      }
    }
  }

  // Password-based registration
  const register = async (userData, role) => {
    try {
      const response = await axios.post(`/api/auth/register/${role}`, userData, { withCredentials: true })

      if (response.data?.requiresOtp) {
        // Caller should prompt user for OTP; server stores pending registration in session
        return { success: false, requiresOtp: true, message: response.data.message }
      }

      const { token, user: newUser } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(newUser))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(newUser)

      return { success: true, user: newUser }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      }
    }
  }

  // Request OTP (for login/signup)
  const requestOtp = async (email, role) => {
    try {
      const response = await axios.post('/api/auth/request-otp', { email, role }, { withCredentials: true })
      return { success: true, message: response.data.message }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to send OTP' }
    }
  }

  // Verify OTP
  const verifyOtp = async (email, otp) => {
    try {
      const response = await axios.post('/api/auth/verify-otp', { email, otp }, { withCredentials: true })
      const { token, user: userData } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(userData)

      return { success: true, user: userData }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Invalid OTP' }
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    requestOtp,
    verifyOtp,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
