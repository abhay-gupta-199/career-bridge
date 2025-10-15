import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { HiOutlineMail, HiOutlineLockClosed, HiUserCircle } from 'react-icons/hi'
import { motion } from 'framer-motion'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
}

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    skills: '',
    resume: '',
    college: '',
    graduationYear: '',
    location: '',
    website: '',
    description: '',
    establishedYear: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    let userData = { name: formData.name, email: formData.email, password: formData.password }

    if (formData.role === 'student') {
      userData.skills = formData.skills
      userData.resume = formData.resume
      userData.college = formData.college
      userData.graduationYear = formData.graduationYear
    } else if (formData.role === 'college') {
      userData.location = formData.location
      userData.website = formData.website
      userData.description = formData.description
      userData.establishedYear = formData.establishedYear
    }

    const result = await register(userData, formData.role)
    
    if (result.success) navigate(`/${result.user.role}/dashboard`)
    else setError(result.message)
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 border border-purple-200 rounded-3xl shadow-2xl p-10 w-full max-w-lg overflow-hidden"
      >
        {/* Heading */}
        <h1 className="text-center text-3xl font-extrabold text-[#4B0082] mb-4">
          Welcome to Career Bridge
        </h1>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-[#4B0082] rounded-xl flex items-center justify-center text-white text-3xl font-bold">
            CB
          </div>
        </div>

        {/* Sign up heading */}
        <h2 className="text-center text-2xl font-bold text-[#4B0082] mb-2">
          Create your account
        </h2>
        <p className="text-center text-sm text-[#4B0082]/90 mb-6">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#4B0082] hover:text-[#6a1b9a]">
            Sign in
          </Link>
        </p>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Account Type */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-[#4B0082]">Account Type</label>
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

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#4B0082]">
              {formData.role === 'college' ? 'College Name' : 'Full Name'}
            </label>
            <div className="relative mt-1">
              <HiUserCircle className="absolute top-1/2 left-3 -translate-y-1/2 text-[#4B0082]/70 w-5 h-5" />
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 h-11 border border-purple-300 rounded-md shadow-sm focus:ring-[#4B0082] focus:border-[#4B0082] text-[#4B0082] bg-purple-50"
                placeholder={formData.role === 'college' ? 'Enter college name' : 'Enter your full name'}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#4B0082]">Email address</label>
            <div className="relative mt-1">
              <HiOutlineMail className="absolute top-1/2 left-3 -translate-y-1/2 text-[#4B0082]/70 w-5 h-5" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 h-11 border border-purple-300 rounded-md shadow-sm focus:ring-[#4B0082] focus:border-[#4B0082] text-[#4B0082] bg-purple-50"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Conditional Fields */}
          {formData.role === 'student' && (
            <>
              <InputField id="skills" label="Skills (comma-separated)" placeholder="e.g., React, Node.js, Python" value={formData.skills} onChange={handleChange} icon={<HiUserCircle />} />
              <InputField id="resume" label="Resume Link (URL)" placeholder="https://example.com/resume.pdf" value={formData.resume} onChange={handleChange} icon={<HiUserCircle />} />
              <InputField id="college" label="College Name" placeholder="Enter your college name" value={formData.college} onChange={handleChange} icon={<HiUserCircle />} />
              <InputField id="graduationYear" label="Graduation Year" placeholder="2024" type="number" value={formData.graduationYear} onChange={handleChange} icon={<HiUserCircle />} />
            </>
          )}
          {formData.role === 'college' && (
            <>
              <InputField id="location" label="Location" placeholder="City, State" value={formData.location} onChange={handleChange} icon={<HiUserCircle />} />
              <InputField id="website" label="Website" placeholder="https://example.com" value={formData.website} onChange={handleChange} icon={<HiUserCircle />} />
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#4B0082]">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full mt-1 h-20 px-3 py-2 border border-purple-300 rounded-md shadow-sm focus:ring-[#4B0082] focus:border-[#4B0082] text-[#4B0082] bg-purple-50"
                  placeholder="Brief description of your college"
                />
              </div>
              <InputField id="establishedYear" label="Established Year" placeholder="1990" type="number" value={formData.establishedYear} onChange={handleChange} icon={<HiUserCircle />} />
            </>
          )}

          {/* Password */}
          <InputField id="password" label="Password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} icon={<HiOutlineLockClosed />} />
          <InputField id="confirmPassword" label="Confirm Password" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} icon={<HiOutlineLockClosed />} />

          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#4B0082] text-white font-medium text-lg hover:bg-[#6a1b9a] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const InputField = ({ id, label, type='text', placeholder, value, onChange, icon }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-[#4B0082]">{label}</label>
    <div className="relative mt-1">
      <span className="absolute top-1/2 left-3 -translate-y-1/2 text-[#4B0082]/70">{icon}</span>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full pl-10 h-11 border border-purple-300 rounded-md shadow-sm focus:ring-[#4B0082] focus:border-[#4B0082] text-[#4B0082] bg-purple-50"
        placeholder={placeholder}
      />
    </div>
  </div>
)

export default Signup
