// src/components/auth/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('token'); // Check if the user is authenticated

  // If not authenticated, redirect to login page
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
