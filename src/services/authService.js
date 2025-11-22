import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";

export const authService = {
  // Login
  login: async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    // Save token after login
    localStorage.setItem("adminToken", res.data.token);
    return res.data;
  },

  // Register
  register: async (username, email, password) => {
    const res = await axios.post(`${API_URL}/register`, { username, email, password });
    return res.data;
  },

  getToken: () => localStorage.getItem("adminToken"),

  logout: () => localStorage.removeItem("adminToken"),
};
