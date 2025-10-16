import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { HiOutlineMail, HiOutlineLockClosed, HiUserCircle } from 'react-icons/hi'
import { motion } from 'framer-motion'

// Fade-in animation for card
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
}

// Professional typewriter hook
import { useEffect } from 'react'
const useTypewriter = (text, speed = 200) => {
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

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'student' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const animatedText = useTypewriter('CareerBridge', 200) // professional typing effect

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await login(formData.email, formData.password, formData.role)
    if (result.success) navigate(`/${result.user.role}/dashboard`)
    else setError(result.message)
    setLoading(false)
  }

  // Generate floating bubbles
  const bubbles = Array.from({ length: 25 }).map((_, i) => ({
    left: Math.random() * 100 + '%',
    size: 15 + Math.random() * 25,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 5,
  }))

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with blur & subtle movement */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center filter blur-sm opacity-80"
        style={{ backgroundImage: "url('https://t3.ftcdn.net/jpg/01/04/49/14/360_F_104491427_Z7Xm1j8BqyUesq51nXRbHibOrjr7Vblv.jpg')" }} // <-- PUT YOUR IMAGE LINK HERE
        animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 30, ease: 'easeInOut' }}
      />

      {/*
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-purple-300/50"
          style={{ width: b.size, height: b.size, left: b.left }}
          initial={{ y: -50, opacity: 0.7 }}
          animate={{ y: '110vh', opacity: 0.4 }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
          }}
        />
      ))}*/}

      {/* Login Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 border border-purple-200 rounded-3xl shadow-2xl p-10 w-full max-w-lg relative z-10"
      >
        {/* Animated Heading */}
        <h1 className="text-center text-4xl font-extrabold text-[#4B0082] mb-4 tracking-wide">
          {animatedText}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="inline-block w-2 bg-[#4B0082] ml-1 h-6 align-middle"
          />
        </h1>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-[#4B0082] rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            CB
          </div>
        </div>

        {/* Sign In */}
        <h2 className="text-center text-2xl font-bold text-[#4B0082] mb-2">Sign in to your account</h2>
        <p className="text-center text-sm text-[#4B0082]/90 mb-6">
          New here?{' '}
          <Link to="/signup" className="font-medium text-[#4B0082] hover:text-[#6a1b9a]">
            Create an account
          </Link>
        </p>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#4B0082]">Password</label>
            <div className="relative mt-1">
              <HiOutlineLockClosed className="absolute top-1/2 left-3 -translate-y-1/2 text-[#4B0082]/70 w-5 h-5" />
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 h-11 border border-purple-300 rounded-md shadow-sm focus:ring-[#4B0082] focus:border-[#4B0082] text-[#4B0082] bg-purple-50"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#4B0082] text-white font-medium text-lg hover:bg-[#6a1b9a] transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default Login
