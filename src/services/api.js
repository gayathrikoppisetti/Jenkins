import axios from "axios";

// ✅ Get API URL from .env (fallback to relative "/api" for production)
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // change to true if you use cookies/session auth
});

export default api;
