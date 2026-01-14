import axios from 'axios'

// Base URL of backend: prefer VITE_API_URL, fallback to localhost:5003/api
const DEFAULT_BASE = 'http://localhost:5003/api'
const base = import.meta?.env?.VITE_API_URL || DEFAULT_BASE

const API = axios.create({
  baseURL: base,
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



