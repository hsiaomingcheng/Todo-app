import axios from "axios";

const api = axios.create({
  // In dev, Vite proxies /api -> the local backend, so the relative path
  // works with no config. In production the frontend and backend are
  // deployed to separate origins (see DEPLOYMENT.md), so VITE_API_URL
  // points straight at the deployed backend's /api prefix.
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor, add the token to the request header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor, if the response status is 401
// it means the token is invalid, so remove the token and redirect to the login page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;