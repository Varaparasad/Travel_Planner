import React from 'react';
import { useApp } from '../context/AppContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { isAuthenticated } = useApp();

  // If user is authenticated, render the child route (e.g., HomePage)
  // Otherwise, redirect them to the /login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;