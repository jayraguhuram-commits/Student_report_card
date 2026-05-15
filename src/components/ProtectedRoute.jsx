import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('session_token');

  if (!token) {
    // If no token exists, redirect back to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
