import axios from 'axios'

// Base URL of backend
const API = axios.create({
  baseURL: 'http://localhost:5003/api',
  withCredentials: true,
})

// Add token automatically if present in localStorage
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

export default API
