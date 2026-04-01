import axios from "axios";

const api = axios.create({
  baseURL: "/api", // /api is the prefix for all API routes defined in the backend
  headers: { "Content-Type": "application/json" },
});

export default api;