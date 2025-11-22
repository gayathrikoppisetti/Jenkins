import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // if you get an error, try: import jwtDecode from 'jwt-decode';
import { authService } from '../services/authService';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async (token) => {
    try {
      const { data } = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // data should be your full user document (without password)
      setAdminUser(data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Failed to fetch /auth/me:', err?.response?.data || err.message);
      setIsAuthenticated(false);
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = authService.getToken(); // reads localStorage.getItem('adminToken')
    if (!token) {
      setLoading(false);
      return;
    }

    // Optional: decode just to verify it's a valid token (id/role are inside)
    try {
      jwtDecode(token);
    } catch (e) {
      console.error('Invalid token in storage', e);
      authService.logout();
      setLoading(false);
      return;
    }

    fetchMe(token);
  }, [fetchMe]);

  const login = async (token) => {
    localStorage.setItem('adminToken', token);
    await fetchMe(token);
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setAdminUser(null);
    window.location.href = '/admin/login';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
