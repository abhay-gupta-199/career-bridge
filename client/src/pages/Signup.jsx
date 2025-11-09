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
          if (index < text.length) setDisplayed(text.slice(0, index + 1)), setIndex(i => i + 1)
          else setForward(false)
        } else {
          if (index > 0) setDisplayed(text.slice(0, index - 1)), setIndex(i => i - 1)
          else setForward(true)
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
    name: '', email: '', password: '', confirmPassword: '', role: 'student',
    skills: '', resume: '', college: '', graduationYear: '', location: '',
    website: '', description: '', establishedYear: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState('')

  const { register, verifyOtp, requestOtp } = useAuth()
  const navigate = useNavigate()
  const animatedText = useTypewriter('Welcome to Career Bridge', 150)

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!showOTP) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
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
      if (result.success) {
        navigate(`/${result.user.role}/dashboard`)
        setLoading(false)
        return
      }
      if (result.requiresOtp) {
        setShowOTP(true)
        sessionStorage.setItem('pendingOtp', JSON.stringify({ email: formData.email, role: formData.role }))
        setLoading(false)
        return
      }

      setError(result.message)
      setLoading(false)
    } else {
      // OTP verification
      const pending = JSON.parse(sessionStorage.getItem('pendingOtp') || 'null')
      const email = pending?.email
      const role = pending?.role
      const res = await verifyOtp(email, otp)
      if (res.success) {
        sessionStorage.removeItem('pendingOtp')
        navigate(`/${res.user.role}/dashboard`)
      } else setError(res.message || 'OTP verification failed')
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setLoading(true)
    setError('')
    const pending = JSON.parse(sessionStorage.getItem('pendingOtp') || 'null')
    const email = pending?.email
    const role = pending?.role
    const res = await requestOtp(email, role)
    if (res.success) setError(res.message)
    else setError(res.message || 'Failed to resend OTP')
    setLoading(false)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center filter blur-sm"
        style={{ backgroundImage: "url('https://t3.ftcdn.net/jpg/01/04/49/14/360_F_104491427_Z7Xm1j8BqyUesq51nXRbHibOrjr7Vblv.jpg')" }}
        animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 30, ease: 'easeInOut' }}
      />

      {/* Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 border border-purple-200 rounded-3xl shadow-2xl w-[440px] max-h-[85vh] p-8 relative z-10 flex flex-col"
      >
        <h1 className="text-center text-2xl font-extrabold text-[#4B0082] mb-4">{animatedText}</h1>

        <h2 className="text-center text-lg font-bold text-[#4B0082] mb-2">Create your account</h2>
        <p className="text-center text-sm text-[#4B0082]/90 mb-6">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#4B0082] hover:text-[#6a1b9a]">Sign in</Link>
        </p>

        <div className="flex-1 overflow-y-auto pr-2">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!showOTP && (
              <>
                <InputField id="role" label="Account Type" type="select" value={formData.role} onChange={handleChange} options={['student','college','owner']} />
                <InputField id="name" label={formData.role==='college'?'College Name':'Full Name'} value={formData.name} onChange={handleChange} />
                <InputField id="email" label="Email" value={formData.email} onChange={handleChange} type="email" />
                {formData.role==='student' && <>
                  <InputField id="skills" label="Skills" value={formData.skills} onChange={handleChange} />
                  <InputField id="resume" label="Resume Link" value={formData.resume} onChange={handleChange} />
                  <InputField id="college" label="College Name" value={formData.college} onChange={handleChange} />
                  <InputField id="graduationYear" label="Graduation Year" value={formData.graduationYear} onChange={handleChange} type="number" />
                </>}
                {formData.role==='college' && <>
                  <InputField id="location" label="Location" value={formData.location} onChange={handleChange} />
                  <InputField id="website" label="Website" value={formData.website} onChange={handleChange} />
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-[#4B0082]">Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="w-full mt-1 h-16 px-3 py-2 border border-purple-300 rounded-md shadow-sm focus:ring-[#4B0082] focus:border-[#4B0082] bg-purple-50"/>
                  </div>
                  <InputField id="establishedYear" label="Established Year" value={formData.establishedYear} onChange={handleChange} type="number" />
                </>}
                <InputField id="password" label="Password" value={formData.password} onChange={handleChange} type="password" />
                <InputField id="confirmPassword" label="Confirm Password" value={formData.confirmPassword} onChange={handleChange} type="password" />
              </>
            )}

            {showOTP && (
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="space-y-4">
                <p className="text-sm text-[#4B0082]/80">OTP sent to <strong>{formData.email}</strong></p>
                <input type="text" value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter OTP" className="w-full pl-3 h-11 border rounded-md" required/>
                <div className="flex gap-3">
                  <button type="submit" disabled={loading} className="flex-1 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition">{loading?'Verifying...':'Verify OTP'}</button>
                  <button type="button" onClick={handleResend} disabled={loading} className="py-3 px-3 border rounded">Resend</button>
                </div>
              </motion.div>
            )}

            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">{error}</div>}

            {!showOTP && <button type="submit" disabled={loading} className="w-full py-2 rounded-lg bg-[#4B0082] text-white font-medium text-lg hover:bg-[#6a1b9a] transition duration-200 disabled:opacity-50">{loading?'Creating account...':'Create account'}</button>}
          </form>
        </div>
      </motion.div>
    </div>
  )
}

const InputField = ({id,label,type='text',value,onChange,options=[]}) => {
  if(type==='select'){
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-[#4B0082]">{label}</label>
        <select id={id} name={id} value={value} onChange={onChange} className="w-full mt-1 h-10 border border-purple-300 rounded-md shadow-sm focus:ring-[#4B0082] focus:border-[#4B0082] bg-purple-50 text-[#4B0082]">
          {options.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    )
  }
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#4B0082]">{label}</label>
      <input id={id} name={id} type={type} value={value} onChange={onChange} placeholder={label} className="w-full mt-1 h-10 px-3 border border-purple-300 rounded-md shadow-sm focus:ring-[#4B0082] focus:border-[#4B0082] bg-purple-50 text-[#4B0082]" />
    </div>
  )
}

export default Signup
