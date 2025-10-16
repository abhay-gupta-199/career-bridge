import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { HiOutlineMail, HiOutlineLockClosed, HiUserCircle } from 'react-icons/hi'
import { motion } from 'framer-motion'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
}

// Typewriter hook
const useTypewriter = (text, speed = 150) => {
  const [displayed, setDisplayed] = useState('')
  const [index, setIndex] = useState(0)
  const [forward, setForward] = useState(true)

  useEffect(() => {
    let frame
    let lastTime = 0

    const step = (time) => {
      if (!lastTime) lastTime = time
      const delta = time - lastTime

      if (delta > speed) {
        if (forward) {
          if (index < text.length) {
            setDisplayed(text.slice(0, index + 1))
            setIndex(i => i + 1)
          } else {
            setForward(false)
          }
        } else {
          if (index > 0) {
            setDisplayed(text.slice(0, index - 1))
            setIndex(i => i - 1)
          } else {
            setForward(true)
          }
        }
        lastTime = time
      }

      frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [index, forward, text, speed])

  return displayed
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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

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

  const animatedText = useTypewriter('Welcome to Career Bridge', 150) // Typewriter effect

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://t3.ftcdn.net/jpg/01/04/49/14/360_F_104491427_Z7Xm1j8BqyUesq51nXRbHibOrjr7Vblv.jpg')" }}
        animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 30, ease: 'easeInOut' }}
      />

      {/* Signup Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 border border-purple-200 rounded-3xl shadow-2xl w-[440px] max-h-[85vh] p-8 relative z-10 flex flex-col"
      >
        {/* Typewriter Heading */}
        <h1 className="text-center text-2xl font-extrabold text-[#4B0082] mb-4">
          {animatedText}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="inline-block w-2 bg-[#4B0082] ml-1 h-6 align-middle"
          />
        </h1>

        {/* Sign up heading */}
        <h2 className="text-center text-lg font-bold text-[#4B0082] mb-2">
          Create your account
        </h2>
        <p className="text-center text-sm text-[#4B0082]/90 mb-6">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#4B0082] hover:text-[#6a1b9a]">
            Sign in
          </Link>
        </p>

        {/* Form Container with internal scroll */}
        <div className="flex-1 overflow-y-auto pr-2">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-[#4B0082]">Account Type</label>
              <div className="relative mt-1">
                <HiUserCircle className="absolute top-1/2 left-3 -translate-y-1/2 text-[#4B0082]/70 w-5 h-5" />
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-10 h-10 border border-purple-300 rounded-md shadow-sm focus:ring-[#4B0082] focus:border-[#4B0082] text-[#4B0082] bg-purple-50"
                  required
                >
                  <option value="student">Student</option>
                  <option value="college">College</option>
                  <option value="owner">Administrator</option>
                </select>
              </div>
            </div>

            {/* Name */}
            <InputField
              id="name"
              label={formData.role === 'college' ? 'College Name' : 'Full Name'}
              placeholder={formData.role === 'college' ? 'Enter college name' : 'Enter your full name'}
              value={formData.name}
              onChange={handleChange}
              icon={<HiUserCircle />}
            />

            {/* Email */}
            <InputField
              id="email"
              label="Email Address"
              placeholder="you@example.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              icon={<HiOutlineMail />}
            />

            {/* Conditional Fields */}
            {formData.role === 'student' && (
              <>
                <InputField id="skills" label="Skills (comma-separated)" placeholder="e.g., React, Node.js" value={formData.skills} onChange={handleChange} icon={<HiUserCircle />} />
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
                    className="w-full mt-1 h-16 px-3 py-2 border border-purple-300 rounded-md shadow-sm focus:ring-[#4B0082] focus:border-[#4B0082] text-[#4B0082] bg-purple-50"
                    placeholder="Brief description of your college"
                  />
                </div>
                <InputField id="establishedYear" label="Established Year" placeholder="1990" type="number" value={formData.establishedYear} onChange={handleChange} icon={<HiUserCircle />} />
              </>
            )}

            {/* Password */}
            <InputField id="password" label="Password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} icon={<HiOutlineLockClosed />} />
            <InputField id="confirmPassword" label="Confirm Password" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} icon={<HiOutlineLockClosed />} />

            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-[#4B0082] text-white font-medium text-lg hover:bg-[#6a1b9a] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>
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
        className="w-full pl-10 h-10 border border-purple-300 rounded-md shadow-sm focus:ring-[#4B0082] focus:border-[#4B0082] text-[#4B0082] bg-purple-50"
        placeholder={placeholder}
      />
    </div>
  </div>
)

export default Signup
