import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Lock,
  Building2,
  GraduationCap,
  ShieldCheck,
  Upload,
  ArrowRight,
  Globe,
  MapPin,
  Calendar,
  Sparkles,
  ChevronLeft
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'

const Signup = () => {
  const [isSignup, setIsSignup] = useState(true)
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resumeFileName, setResumeFileName] = useState("")

  const navigate = useNavigate()
  const { register, login, verifyOtp, requestOtp } = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    skills: "",
    resumeFile: null,
    college: "",
    graduationYear: "",
    location: "",
    website: "",
    description: "",
    establishedYear: ""
  })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      y: -15,
      transition: { duration: 0.3 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === "resumeFile") {
      const file = files[0]
      if (file) {
        const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        if (!allowed.includes(file.type)) {
          setError("Upload only PDF or DOCX")
          return
        }
        if (file.size > 10 * 1024 * 1024) {
          setError("File must be below 10 MB")
          return
        }
        setResumeFileName(file.name)
        setFormData({ ...formData, resumeFile: file })
        setError("")
      }
      return
    }
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (isSignup) {
      if (!showOTP) {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match")
          setLoading(false)
          return
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters")
          setLoading(false)
          return
        }

        let userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }

        if (formData.role === "student") {
          userData = { ...userData, skills: formData.skills, resumeFile: formData.resumeFile, college: formData.college, graduationYear: formData.graduationYear }
        } else if (formData.role === "college") {
          userData = { ...userData, location: formData.location, website: formData.website, description: formData.description, establishedYear: formData.establishedYear }
        }

        const res = await register(userData, formData.role)
        if (res.success) {
          navigate(`/${res.user.role}/dashboard`)
          setLoading(false)
          return
        }
        if (res.requiresOtp) {
          setShowOTP(true)
          sessionStorage.setItem("pendingOtp", JSON.stringify({ email: formData.email, role: formData.role }))
          setLoading(false)
          return
        }
        setError(res.message)
      } else {
        const pending = JSON.parse(sessionStorage.getItem("pendingOtp") || "null")
        const res = await verifyOtp(pending.email, otp)
        if (res.success) {
          sessionStorage.removeItem("pendingOtp")
          navigate(`/${res.user.role}/dashboard`)
        } else setError(res.message || "OTP failed")
      }
    } else {
      if (!showOTP) {
        const res = await login(formData.email, formData.password, formData.role)
        if (res.success) {
          navigate(`/${res.user.role}/dashboard`)
          setLoading(false)
          return
        }
        if (res.requiresOtp) {
          setShowOTP(true)
          sessionStorage.setItem("pendingOtp", JSON.stringify({ email: formData.email, role: formData.role }))
          setLoading(false)
          return
        }
        setError(res.message || "Login failed")
      } else {
        const pending = JSON.parse(sessionStorage.getItem("pendingOtp") || "null")
        const res = await verifyOtp(pending.email, otp)
        if (res.success) {
          sessionStorage.removeItem("pendingOtp")
          navigate(`/${res.user.role}/dashboard`)
        } else setError(res.message || "OTP failed")
      }
    }
    setLoading(false)
  }

  const handleResend = async () => {
    setLoading(true)
    const pending = JSON.parse(sessionStorage.getItem("pendingOtp") || "null")
    const res = await requestOtp(pending.email, pending.role)
    setError(res.message)
    setLoading(false)
  }

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#050010] font-sans">
      {/* Dynamic Career Guidance Background: Sophisticated Library/Workspace */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1.05, 1.1, 1.05],
            rotate: [0, 2, 0],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2073&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#050010] via-[#1a0033]/85 to-[#050010]" />
      </div>

      {/* Floating Educational 'Sparks' of Knowledge */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
              y: [0, -100 - Math.random() * 150],
              x: (Math.random() - 0.5) * 80
            }}
            transition={{
              duration: 12 + Math.random() * 12,
              repeat: Infinity,
              delay: Math.random() * 8
            }}
            className="absolute rounded-full bg-purple-400/30 blur-[2px]"
            style={{
              width: 3 + Math.random() * 4,
              height: 3 + Math.random() * 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Animated Nebulous Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, -30, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={isSignup ? 'signup' : 'login'}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative z-10 w-full max-w-xl mx-auto px-6"
        >
          {/* ULTRA-COMPACT PROFILE: Shorter internal height, wide width */}
          <GlassCard className="p-0 border-white/20 shadow-[0_64px_128px_-16px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-3xl rounded-[2.75rem] bg-white/[0.02]" glow>
            {/* Condensed Header */}
            <div className="pt-8 px-10 text-center bg-gradient-to-b from-white/10 to-transparent border-b border-white/5">
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="inline-block p-3.5 rounded-[1.25rem] bg-gradient-to-br from-[#050010] to-[#240046] border border-white/15 shadow-2xl mb-4"
              >
                <ShieldCheck className="text-white" size={28} />
              </motion.div>
              <h1 className="text-3xl font-black text-white tracking-tighter leading-none mb-1.5 drop-shadow-sm">Career Bridge</h1>
              <p className="text-purple-400 text-[10px] font-black uppercase tracking-[0.4em] opacity-80">
                {isSignup ? "Profile Initialization" : "System Access"}
              </p>
            </div>

            {/* Premium Toggle */}
            <div className="flex p-1.5 mx-12 mt-6 bg-black/60 rounded-[1.1rem] border border-white/10 shadow-inner">
              <button
                className={`flex-1 py-3 rounded-[0.9rem] text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${isSignup ? "bg-white text-[#1a0033] shadow-2xl scale-[1.02]" : "text-white/40 hover:text-white"}`}
                onClick={() => { setIsSignup(true); setError(""); setShowOTP(false); }}
              >
                Sign Up
              </button>
              <button
                className={`flex-1 py-3 rounded-[0.9rem] text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${!isSignup ? "bg-white text-[#1a0033] shadow-2xl scale-[1.02]" : "text-white/40 hover:text-white"}`}
                onClick={() => { setIsSignup(false); setError(""); setShowOTP(false); }}
              >
                Login
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 pt-6">
              {/* ULTRA-SHRUNK INTERNAL HEIGHT: max-h-[220px] for widescreen profile */}
              <div className="space-y-5 max-h-[220px] overflow-y-auto px-2 custom-scrollbar pr-4">
                {!showOTP && (
                  <div className="space-y-3.5">
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1 text-center block w-full">Role</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'student', name: 'Student', icon: User, color: 'blue' },
                        { id: 'college', name: 'College', icon: Building2, color: 'indigo' },
                        { id: 'owner', name: 'Admin', icon: ShieldCheck, color: 'purple' }
                      ].map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, role: r.id })}
                          className={`relative flex flex-col items-center gap-1.5 p-3.5 rounded-2xl border transition-all duration-500 ${formData.role === r.id ? "bg-white/15 border-white shadow-xl scale-[1.05]" : "bg-black/40 border-white/5 hover:bg-black/60"}`}
                        >
                          <r.icon size={20} className={formData.role === r.id ? "text-white" : "text-white/20"} />
                          <span className={`text-[9px] font-black uppercase tracking-widest ${formData.role === r.id ? "text-white" : "text-white/20"}`}>{r.name}</span>
                          {formData.role === r.id && (
                            <motion.div layoutId="activeRole" className="absolute inset-0 rounded-2xl border-2 border-white/40" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!showOTP ? (
                  <>
                    <AnimatePresence mode="popLayout">
                      {isSignup && (
                        <motion.div
                          key="signup-fields"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                        >
                          <InputField
                            name="name"
                            label={formData.role === "college" ? "Institutional Title" : "Name"}
                            icon={formData.role === "college" ? Building2 : User}
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={formData.role === "college" ? "Full University Name" : "Your full name"}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <InputField name="email" label="Email" type="email" icon={Mail} value={formData.email} onChange={handleChange} placeholder="name@careerbridge.com" />

                    <AnimatePresence mode="popLayout">
                      {isSignup && formData.role === "student" && (
                        <motion.div key="student-fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 pt-1">
                          <InputField name="skills" label="Skills" icon={Sparkles} value={formData.skills} onChange={handleChange} placeholder="e.g. React, Data Science" />
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Resume (PDF)</label>
                            <div className="relative group">
                              <input type="file" name="resumeFile" accept=".pdf,.docx" onChange={handleChange} className="hidden" id="resume-upload" />
                              <label htmlFor="resume-upload" className="flex items-center gap-3.5 px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl hover:bg-black/60 hover:border-white/30 transition-all cursor-pointer">
                                <Upload size={18} className="text-purple-400" />
                                <span className="text-[12px] text-white/80 font-black truncate">{resumeFileName || "DEPLOY RELEVANT DOC (MAX 10MB)"}</span>
                              </label>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <InputField name="college" label="Institution" icon={GraduationCap} value={formData.college} onChange={handleChange} placeholder="College" />
                            <InputField name="graduationYear" label="Batch" icon={Calendar} type="number" value={formData.graduationYear} onChange={handleChange} placeholder="YYYY" />
                          </div>
                        </motion.div>
                      )}

                      {isSignup && formData.role === "college" && (
                        <motion.div key="college-fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 pt-1">
                          <div className="grid grid-cols-2 gap-3">
                            <InputField name="location" label="Coordinates" icon={MapPin} value={formData.location} onChange={handleChange} placeholder="City, State" />
                            <InputField name="website" label="Domain URL" icon={Globe} value={formData.website} onChange={handleChange} placeholder="https://..." />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Legacy Narrative</label>
                            <textarea
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-bold text-white focus:ring-2 focus:ring-purple-500/30 outline-none transition-all h-20 font-bold resize-none placeholder:text-white/5 shadow-inner"
                              placeholder="Describe institutional mission..."
                            />
                          </div>
                          <InputField name="establishedYear" label="Epoch" icon={Calendar} type="number" value={formData.establishedYear} onChange={handleChange} placeholder="19XX" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <InputField name="password" label="Password" type="password" icon={Lock} value={formData.password} onChange={handleChange} placeholder="••••••••" />
                      {isSignup && <InputField name="confirmPassword" label="Confirm Password" type="password" icon={Lock} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />}
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8 py-6"
                  >
                    <div className="text-center">
                      <div className="w-14 h-14 bg-white/5 text-white rounded-[1.25rem] flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-2xl">
                        <Mail size={28} />
                      </div>
                      <p className="text-white font-black text-lg tracking-tight uppercase">Verify your email</p>
                      <p className="text-white/30 text-[10px] font-black mt-1">Dispatched to <span className="text-white">{formData.email}</span></p>
                    </div>

                    <div className="space-y-4">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="••••••"
                        className="w-full bg-black/60 border border-white/20 rounded-2xl px-6 py-5 text-center text-4xl font-black tracking-[0.4em] text-white focus:ring-2 focus:ring-white/50 outline-none transition-all shadow-inner"
                        maxLength={6}
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setShowOTP(false)}
                        className="p-5 bg-white/5 border border-white/10 rounded-2xl text-white/30 hover:text-white hover:bg-white/10 transition-all shadow-lg"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-white text-[#050010] py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-white/5 hover:brightness-90 active:scale-95 transition-all"
                      >
                        {loading ? "Decrypting..." : "Finalize Authorization"}
                      </button>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-[9px] font-black uppercase tracking-widest shadow-lg"
                  >
                    <Lock size={14} className="shrink-0" />
                    {error}
                  </motion.div>
                )}
              </div>

              {!showOTP && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-10 py-5 rounded-[1.5rem] bg-white text-[#050010] font-black uppercase tracking-[0.3em] text-[11px] shadow-[0_20px_50px_-10px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      {isSignup ? "Initialize Profile" : "Secure Launch"}
                      <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                    </>
                  )}
                </button>
              )}

              {!showOTP && (
                <p className="mt-8 text-center text-white/20 text-[9px] font-black uppercase tracking-[0.2em]">
                  {isSignup ? "Authorized Operator?" : "New Deployment?"}{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignup(!isSignup)}
                    className="text-white hover:text-white transition-all border-b-2 border-white/20 pb-0.5 ml-1"
                  >
                    {isSignup ? "Navigate to Login" : "Begin Enrollment"}
                  </button>
                </p>
              )}
            </form>
          </GlassCard>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

const InputField = ({ name, label, type = "text", value, onChange, icon: Icon, placeholder }) => (
  <div className="space-y-1.5 group">
    <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1 group-focus-within:text-white transition-colors">{label}</label>
    <div className="relative flex items-center">
      {Icon && <Icon className="absolute left-4 text-white/20 group-focus-within:text-white transition-colors" size={18} />}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${Icon ? "pl-14" : "px-6"} pr-6 py-4 bg-white/[0.04] border border-white/10 rounded-2xl text-[14px] font-bold text-white focus:ring-1 focus:ring-white/30 focus:border-white/20 outline-none transition-all placeholder:text-white/5 shadow-inner`}
      />
    </div>
  </div>
)

export default Signup
