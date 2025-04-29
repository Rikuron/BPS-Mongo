import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!token) {
    // Not authenticated, redirect to login
    return <Navigate to="/official" replace />;
  }

  if (adminOnly && !isAdmin) {
    // Not an admin when admin-only route is accessed
    return <Navigate to="/official/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;