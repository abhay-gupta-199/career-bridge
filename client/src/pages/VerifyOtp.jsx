import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const VerifyOtp = () => {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { verifyOtp, requestOtp } = useAuth()
  const navigate = useNavigate()

  const pending = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('pendingOtp') || 'null') : null
  const email = pending?.email
  const role = pending?.role

  useEffect(() => {
    if (!email || !role) {
      navigate('/login')
    }
  }, [email, role, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await verifyOtp(email, otp)
    if (res.success) {
      sessionStorage.removeItem('pendingOtp')
      navigate(`/${res.user.role}/dashboard`)
    } else {
      setError(res.message || 'OTP verification failed')
    }

    setLoading(false)
  }

  const handleResend = async () => {
    setLoading(true)
    setError('')
    const res = await requestOtp(email, role)
    if (res.success) setError(res.message)
    else setError(res.message || 'Failed to resend OTP')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Enter the OTP</h2>
        <p className="text-sm text-gray-600 mb-4">An OTP was sent to <strong>{email}</strong>. Enter it below to continue.</p>
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full px-4 py-2 border rounded"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <div className="flex gap-3">
            <button className="flex-1 py-2 bg-indigo-600 text-white rounded" disabled={loading} type="submit">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button type="button" onClick={handleResend} className="py-2 px-3 border rounded" disabled={loading}>
              Resend
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VerifyOtp
