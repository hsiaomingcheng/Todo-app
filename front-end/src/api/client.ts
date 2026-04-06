import axios from "axios";

const api = axios.create({
  baseURL: "/api", // /api is the prefix for all API routes defined in the backend
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Or from your auth state
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;