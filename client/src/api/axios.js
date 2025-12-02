import axios from 'axios'

//Base URL of backend
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



