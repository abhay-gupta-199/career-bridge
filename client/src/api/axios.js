import axios from 'axios'

// Base URL of backend: prefer VITE_API_URL, fallback to localhost:5002/api
const DEFAULT_BASE = 'http://localhost:5002/api'
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



// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,   // MUST READ FROM .env
// });

// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   }
//   return config;
// });

// export default API;



// const API = axios.create({
//   baseURL: "http://127.0.0.1:5002",  // NO /api here
// });

// // token add auto
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   }
//   return config;
// });

// export default API;



