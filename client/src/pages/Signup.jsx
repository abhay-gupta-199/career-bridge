import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

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

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === "resumeFile") {
      const file = files[0]
      if (file) {
        const allowed = ["application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

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

    // ----------------------- SIGNUP -------------------------
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
          userData = {
            ...userData,
            skills: formData.skills,
            resumeFile: formData.resumeFile,
            college: formData.college,
            graduationYear: formData.graduationYear,
          }
        }

        if (formData.role === "college") {
          userData = {
            ...userData,
            location: formData.location,
            website: formData.website,
            description: formData.description,
            establishedYear: formData.establishedYear,
          }
        }

        const res = await register(userData, formData.role)

        if (res.success) {
          navigate(`/${res.user.role}/dashboard`)
          setLoading(false)
          return
        }

        if (res.requiresOtp) {
          setShowOTP(true)
          sessionStorage.setItem("pendingOtp",
            JSON.stringify({ email: formData.email, role: formData.role }))
          setLoading(false)
          return
        }

        setError(res.message)
        setLoading(false)
        return
      }

      // ------------------ OTP VERIFY (SIGNUP) -------------------
      const pending = JSON.parse(sessionStorage.getItem("pendingOtp") || "null")
      const res = await verifyOtp(pending.email, otp)

      if (res.success) {
        sessionStorage.removeItem("pendingOtp")
        navigate(`/${res.user.role}/dashboard`)
      } else setError(res.message || "OTP failed")

      setLoading(false)
      return
    }

    // ------------------------ LOGIN ------------------------
    if (!showOTP) {
      const res = await login(formData.email, formData.password, formData.role)

      if (res.success) {
        navigate(`/${res.user.role}/dashboard`)
        setLoading(false)
        return
      }

      if (res.requiresOtp) {
        setShowOTP(true)
        sessionStorage.setItem("pendingOtp",
          JSON.stringify({ email: formData.email, role: formData.role }))
        setLoading(false)
        return
      }

      setError(res.message || "Login failed")
      setLoading(false)
      return
    }

    // ------------------------ OTP VERIFY (LOGIN) ------------------------
    const pending = JSON.parse(sessionStorage.getItem("pendingOtp") || "null")
    const res = await verifyOtp(pending.email, otp)

    if (res.success) {
      sessionStorage.removeItem("pendingOtp")
      navigate(`/${res.user.role}/dashboard`)
    } else setError(res.message || "OTP failed")

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
    <div className="min-h-screen flex flex-col md:flex-row">

      <motion.div
        className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://t3.ftcdn.net/jpg/01/04/49/14/360_F_104491427_Z7Xm1j8BqyUesq51nXRbHibOrjr7Vblv.jpg')" }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 20 }}
      />

      <div className="flex-1 flex justify-center items-center p-6 bg-gray-50">
        <motion.div
          className="bg-white/30 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-6 w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className="text-center text-3xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
            Welcome to Career Bridge
          </h1>

          {/* Toggle */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              className={`py-1 px-4 rounded-lg font-medium ${isSignup ? "bg-purple-700 text-white" : "bg-purple-100 text-purple-700"}`}
              onClick={() => setIsSignup(true)}
            >
              Sign Up
            </button>

            <button
              className={`py-1 px-4 rounded-lg font-medium ${!isSignup ? "bg-purple-700 text-white" : "bg-purple-100 text-purple-700"}`}
              onClick={() => setIsSignup(false)}
            >
              Login
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">

            {/* SIGNUP - NO OTP */}
            {isSignup && !showOTP && (
              <>
                <InputField id="role" label="Account Type" type="select" value={formData.role} onChange={handleChange} options={["student", "college", "owner"]} />
                <InputField id="name" label={formData.role === "college" ? "College Name" : "Full Name"} value={formData.name} onChange={handleChange} />
                <InputField id="email" label="Email" type="email" value={formData.email} onChange={handleChange} />

                {formData.role === "student" && (
                  <>
                    <InputField id="skills" label="Skills" value={formData.skills} onChange={handleChange} />

                    <div>
                      <label className="block text-sm font-medium text-purple-700">Resume (PDF/DOCX)</label>
                      <input type="file" name="resumeFile" accept=".pdf,.docx" onChange={handleChange} className="mt-1" />
                      {resumeFileName && <p className="text-purple-700 text-sm">{resumeFileName}</p>}
                    </div>

                    <InputField id="college" label="College" value={formData.college} onChange={handleChange} />
                    <InputField id="graduationYear" label="Graduation Year" type="number" value={formData.graduationYear} onChange={handleChange} />
                  </>
                )}

                {formData.role === "college" && (
                  <>
                    <InputField id="location" label="Location" value={formData.location} onChange={handleChange} />
                    <InputField id="website" label="Website" value={formData.website} onChange={handleChange} />

                    <label className="block text-sm font-medium text-purple-700">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded p-2 h-16" />

                    <InputField id="establishedYear" label="Established Year" type="number" value={formData.establishedYear} onChange={handleChange} />
                  </>
                )}

                <InputField id="password" label="Password" type="password" value={formData.password} onChange={handleChange} />
                <InputField id="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} />
              </>
            )}

            {/* LOGIN - NO OTP */}
            {!isSignup && !showOTP && (
              <>
                <InputField id="role" label="Account Type" type="select" value={formData.role} onChange={handleChange} options={["student", "college", "owner"]} />
                <InputField id="email" label="Email" type="email" value={formData.email} onChange={handleChange} />
                <InputField id="password" label="Password" type="password" value={formData.password} onChange={handleChange} />
              </>
            )}

            {/* OTP */}
            {showOTP && (
              <OTPSection
                email={formData.email}
                otp={otp}
                setOtp={setOtp}
                loading={loading}
                handleResend={handleResend}
              />
            )}

            {error && (
              <motion.div
                className="bg-red-100 border border-red-300 px-3 py-2 rounded text-red-700 text-sm"
                animate={{ x: [-5, 5, -5, 5, 0] }}
              >
                {error}
              </motion.div>
            )}

            {!showOTP && (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-lg hover:scale-105 transition"
              >
                {loading ? "Processing..." : isSignup ? "Create Account" : "Login"}
              </button>
            )}

          </form>
        </motion.div>
      </div>
    </div>
  )
}

// Input component
const InputField = ({ id, label, type = "text", value, onChange, options = [] }) => {
  const name = id
  if (type === "select") {
    return (
      <div>
        <label className="block text-sm font-medium text-purple-700">{label}</label>
        <select name={name} value={value} onChange={onChange} className="w-full h-10 border rounded bg-purple-50">
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    )
  }
  return (
    <div>
      <label className="block text-sm font-medium text-purple-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-10 px-3 border rounded bg-purple-50"
      />
    </div>
  )
}

const OTPSection = ({ email, otp, setOtp, loading, handleResend }) => (
  <div className="space-y-4">
    <p className="text-purple-700">OTP sent to <strong>{email}</strong></p>

    <input
      type="text"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      placeholder="Enter OTP"
      className="w-full border px-3 h-11 rounded"
    />

    <div className="flex gap-3">
      <button type="submit" disabled={loading} className="flex-1 bg-green-500 py-2 rounded text-white">
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <button type="button" onClick={handleResend} className="border px-3 rounded">
        Resend
      </button>
    </div>
  </div>
)

export default Signup
