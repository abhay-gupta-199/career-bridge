import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    // Student specific fields
    skills: '',
    resume: '',
    college: '',
    graduationYear: '',
    // College specific fields
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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

    // Prepare data based on role
    let userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password
    }

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
    } else {
      setError(result.message)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">CB</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 input-field"
                required
              >
                <option value="student">Student</option>
                <option value="college">College</option>
                <option value="owner">Administrator</option>
              </select>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {formData.role === 'college' ? 'College Name' : 'Full Name'}
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder={formData.role === 'college' ? 'Enter college name' : 'Enter your full name'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {formData.role === 'student' && (
              <>
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                    Skills (comma-separated)
                  </label>
                  <div className="mt-1">
                    <input
                      id="skills"
                      name="skills"
                      type="text"
                      value={formData.skills}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., React, Node.js, Python"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                    Resume Link (URL)
                  </label>
                  <div className="mt-1">
                    <input
                      id="resume"
                      name="resume"
                      type="url"
                      value={formData.resume}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="https://example.com/resume.pdf"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="college" className="block text-sm font-medium text-gray-700">
                    College Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="college"
                      name="college"
                      type="text"
                      value={formData.college}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter your college name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">
                    Graduation Year
                  </label>
                  <div className="mt-1">
                    <input
                      id="graduationYear"
                      name="graduationYear"
                      type="number"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="2024"
                    />
                  </div>
                </div>
              </>
            )}

            {formData.role === 'college' && (
              <>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <div className="mt-1">
                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="City, State"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <div className="mt-1">
                    <input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Brief description of your college"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="establishedYear" className="block text-sm font-medium text-gray-700">
                    Established Year
                  </label>
                  <div className="mt-1">
                    <input
                      id="establishedYear"
                      name="establishedYear"
                      type="number"
                      value={formData.establishedYear}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="1990"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-gray-50"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
