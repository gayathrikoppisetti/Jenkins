import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const token = authService.getToken();
  return token ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
