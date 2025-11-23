import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'

// Motion Variants
const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } } }

const Signup = () => {
  const [isSignup, setIsSignup] = useState(true)
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'student',
    skills: '', resume: '', college: '', graduationYear: '', location: '',
    website: '', description: '', establishedYear: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState('')

  const { register, login, verifyOtp, requestOtp } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (isSignup) {
      if (!showOTP) {
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); setLoading(false); return }
        if (formData.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return }

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
        if (result.success) { navigate(`/${result.user.role}/dashboard`); setLoading(false); return }
        if (result.requiresOtp) { setShowOTP(true); sessionStorage.setItem('pendingOtp', JSON.stringify({ email: formData.email, role: formData.role })); setLoading(false); return }

        setError(result.message); setLoading(false)
      } else {
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
    } else {
      if (!showOTP) {
        const res = await login(formData.email, formData.password, formData.role)
        if (res.success) { navigate(`/${res.user.role}/dashboard`); setLoading(false); return }
        if (res.requiresOtp) { setShowOTP(true); sessionStorage.setItem('pendingOtp', JSON.stringify({ email: formData.email, role: formData.role })); setLoading(false); return }
        setError(res.message || 'Login failed')
      } else {
        const pending = JSON.parse(sessionStorage.getItem('pendingOtp') || 'null')
        const email = pending?.email
        const role = pending?.role
        const res = await verifyOtp(email, otp)
        if (res.success) { sessionStorage.removeItem('pendingOtp'); navigate(`/${res.user.role}/dashboard`) }
        else setError(res.message || 'OTP verification failed')
      }
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setLoading(true); setError('')
    const pending = JSON.parse(sessionStorage.getItem('pendingOtp') || 'null')
    const email = pending?.email
    const role = pending?.role
    const res = await requestOtp(email, role)
    if (res.success) setError(res.message)
    else setError(res.message || 'Failed to resend OTP')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Animated Image */}
      <motion.div
        className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://t3.ftcdn.net/jpg/01/04/49/14/360_F_104491427_Z7Xm1j8BqyUesq51nXRbHibOrjr7Vblv.jpg')" }}
        animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 bg-purple-900/30"></div>
      </motion.div>

      {/* Right Card */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="relative z-10 bg-white/30 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl w-full max-w-md p-6 flex flex-col overflow-hidden max-h-[85vh]"
        >
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 mb-4"
          >
            Welcome to Career Bridge
          </motion.h1>

          {/* Toggle Buttons */}
          <div className="flex justify-center gap-4 mb-4">
            <button className={`py-1 px-4 rounded-lg font-medium ${isSignup ? 'bg-purple-700 text-white' : 'bg-purple-100 text-purple-700'}`} onClick={() => setIsSignup(true)}>Sign Up</button>
            <button className={`py-1 px-4 rounded-lg font-medium ${!isSignup ? 'bg-purple-700 text-white' : 'bg-purple-100 text-purple-700'}`} onClick={() => setIsSignup(false)}>Login</button>
          </div>

          {/* Scrollable Form */}
          <motion.div
            key={isSignup ? 'signup' : 'login'}
            initial={{ x: isSignup ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isSignup ? -300 : 300, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup ? (
                !showOTP ? (
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
                      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.3}}>
                        <label htmlFor="description" className="block text-sm font-medium text-purple-700">Description</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="w-full mt-1 h-16 px-3 py-2 border border-purple-300 rounded-md shadow-sm focus:ring-purple-400 focus:border-purple-400 bg-purple-50"/>
                      </motion.div>
                      <InputField id="establishedYear" label="Established Year" value={formData.establishedYear} onChange={handleChange} type="number" />
                    </>}
                    <InputField id="password" label="Password" value={formData.password} onChange={handleChange} type="password" />
                    <InputField id="confirmPassword" label="Confirm Password" value={formData.confirmPassword} onChange={handleChange} type="password" />
                  </>
                ) : (
                  <OTPSection email={formData.email} otp={otp} setOtp={setOtp} loading={loading} handleResend={handleResend}/>
                )
              ) : (
                <>
                  <InputField id="role" label="Account Type" type="select" value={formData.role} onChange={handleChange} options={['student','college','owner']} />
                  <InputField id="email" label="Email" value={formData.email} onChange={handleChange} type="email" />
                  <InputField id="password" label="Password" value={formData.password} onChange={handleChange} type="password" />
                  {showOTP && <OTPSection email={formData.email} otp={otp} setOtp={setOtp} loading={loading} handleResend={handleResend}/>}
                </>
              )}

              {error && <motion.div key={error} animate={{ x: [-5,5,-5,5,0] }} transition={{ duration: 0.4 }} className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">{error}</motion.div>}

              {!showOTP && (
                <button type="submit" disabled={loading} className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-lg hover:scale-105 hover:shadow-xl transition transform duration-300">
                  {loading ? (isSignup ? 'Creating account...' : 'Signing in...') : (isSignup ? 'Create account' : 'Sign in')}
                </button>
              )}
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

// InputField Component
const InputField = ({id,label,type='text',value,onChange,options=[]}) => {
  if(type==='select'){
    return (
      <div className="relative">
        <label htmlFor={id} className="block text-sm font-medium text-purple-700">{label}</label>
        <select id={id} name={id} value={value} onChange={onChange} className="w-full mt-1 h-10 border border-purple-300 rounded-md shadow-sm focus:ring-purple-400 focus:border-purple-400 bg-purple-50 text-purple-700">
          {options.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    )
  }
  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-purple-700">{label}</label>
      <input id={id} name={id} type={type} value={value} onChange={onChange} placeholder={label} className="w-full mt-1 h-10 px-3 border border-purple-300 rounded-md shadow-sm focus:ring-purple-400 focus:border-purple-400 bg-purple-50 text-purple-700 transition-all duration-300"/>
    </div>
  )
}

// OTP Section
const OTPSection = ({email, otp, setOtp, loading, handleResend}) => (
  <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="space-y-4">
    <p className="text-sm text-purple-700/80">OTP sent to <strong>{email}</strong></p>
    <input type="text" value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter OTP" className="w-full pl-3 h-11 border rounded-md" required/>
    <div className="flex gap-3">
      <button type="submit" disabled={loading} className="flex-1 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition">{loading?'Verifying...':'Verify OTP'}</button>
      <button type="button" onClick={handleResend} disabled={loading} className="py-3 px-3 border rounded">Resend</button>
    </div>
  </motion.div>
)

export default Signup
