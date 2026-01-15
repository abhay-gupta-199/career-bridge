import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import API from '../api/axios'

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

  // -------- SAFE LOCALSTORAGE LOAD (NO JSON ERROR) --------
  useEffect(() => {
    const token = localStorage.getItem('token')
    const rawUser = localStorage.getItem('user')

    let parsedUser = null

    try {
      parsedUser = rawUser ? JSON.parse(rawUser) : null
    } catch (err) {
      console.error("⚠️ Invalid JSON in localStorage. Clearing corrupted user data.")
      localStorage.removeItem("user")
      parsedUser = null
    }

    if (token && parsedUser) {
      setUser(parsedUser)
    }

    setLoading(false)
  }, [])

  // ---------- LOGIN ----------
  const login = async (email, password, role) => {
    try {
      const response = await API.post(
        '/auth/login',
        { email, password, role }
      )

      // If backend says OTP needed
      if (response.data?.requiresOtp) {
        return { success: false, requiresOtp: true, message: response.data.message }
      }

      const { token, user: userData } = response.data

      // Save
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)

      return { success: true, user: userData }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      }
    }
  }

  // ---------- REGISTER ----------
  const register = async (userData, role) => {
    try {
      let response;
      
      // If student has resume file, use FormData
      if (role === 'student' && userData.resumeFile) {
        const formData = new FormData();
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('skills', userData.skills || '');
        formData.append('resume', userData.resumeFile);
        formData.append('college', userData.college || '');
        formData.append('graduationYear', userData.graduationYear || '');
        
        response = await API.post(
          `/auth/register/${role}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
      } else {
        response = await API.post(
          `/auth/register/${role}`,
          userData
        );
      }

      if (response.data?.requiresOtp) {
        // UI should now show OTP input
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

  // ---------- REQUEST OTP ----------
  const requestOtp = async (email, role) => {
    try {
      const response = await API.post(
        '/auth/request-otp',
        { email, role },
        { withCredentials: true }
      )
      return { success: true, message: response.data.message }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send OTP'
      }
    }
  }

  // ---------- VERIFY OTP ----------
  const verifyOtp = async (email, otp) => {
    try {
      const response = await API.post(
        '/auth/verify-otp',
        { email, otp },
        { withCredentials: true }
      )

      const { token, user: userData } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)

      return { success: true, user: userData }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid OTP'
      }
    }
  }

  // ---------- LOGOUT ----------
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
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
