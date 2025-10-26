import React from 'react';
import { useApp } from '../context/AppContext';
import { Navigate, Outlet } from 'react-router-dom';

const GuestRoute = () => {
  const { isAuthenticated } = useApp();

  // If user is NOT authenticated, render the child route (e.g., LoginPage)
  // Otherwise, redirect them to the main page (/)
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default GuestRoute;