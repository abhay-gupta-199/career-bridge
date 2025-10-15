import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { HiOutlineMail, HiOutlineLockClosed, HiUserCircle } from 'react-icons/hi'
import { motion } from 'framer-motion'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
}

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(formData.email, formData.password, formData.role)
    
    if (result.success) {
      navigate(`/${result.user.role}/dashboard`)
    } else {
      setError(result.message)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 border border-purple-200 rounded-3xl shadow-2xl p-10 w-full max-w-lg"
      >
        {/* Welcome Heading */}
        <h1 className="text-center text-3xl font-extrabold text-[#4B0082] mb-4">
          Welcome to Career Bridge
        </h1>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-[#4B0082] rounded-xl flex items-center justify-center text-white text-3xl font-bold">
            CB
          </div>
        </div>

        {/* Sign in Heading */}
        <h2 className="text-center text-2xl font-bold text-[#4B0082] mb-2">
          Sign in to your account
        </h2>
        <p className="text-center text-sm text-[#4B0082]/90 mb-6">
          New here?{' '}
          <Link to="/signup" className="font-medium text-[#4B0082] hover:text-[#6a1b9a]">
            Create an account
          </Link>
        </p>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Account Type */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-[#4B0082]">
              Account Type
            </label>
            <div className="relative mt-1">
              <HiUserCircle className="absolute top-1/2 left-3 -translate-y-1/2 text-[#4B0082]/70 w-5 h-5" />
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 h-11 border border-purple-300 rounded-md shadow-sm focus:ring-[#4B0082] focus:border-[#4B0082] text-[#4B0082] bg-purple-50"
                required
              >
                <option value="student">Student</option>
                <option value="college">College</option>
                <option value="owner">Administrator</option>
              </select>
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#4B0082]">
              Email address
            </label>
            <div className="relative mt-1">
              <HiOutlineMail className="absolute top-1/2 left-3 -translate-y-1/2 text-[#4B0082]/70 w-5 h-5" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 h-11 border border-purple-300 rounded-md shadow-sm focus:ring-[#4B0082] focus:border-[#4B0082] text-[#4B0082] bg-purple-50"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#4B0082]">
              Password
            </label>
            <div className="relative mt-1">
              <HiOutlineLockClosed className="absolute top-1/2 left-3 -translate-y-1/2 text-[#4B0082]/70 w-5 h-5" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 h-11 border border-purple-300 rounded-md shadow-sm focus:ring-[#4B0082] focus:border-[#4B0082] text-[#4B0082] bg-purple-50"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#4B0082] text-white font-medium text-lg hover:bg-[#6a1b9a] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-purple-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100 text-[#4B0082]/70">
              New to Career Bridge?
            </span>
          </div>
        </div>

        {/* Signup Button */}
        <div className="mt-6">
          <Link
            to="/signup"
            className="w-full flex justify-center py-3 rounded-lg border border-[#4B0082] shadow-sm text-sm font-medium text-[#4B0082] bg-white hover:bg-purple-100 hover:text-[#4B0082] transition duration-200 text-lg"
          >
            Create your account
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
