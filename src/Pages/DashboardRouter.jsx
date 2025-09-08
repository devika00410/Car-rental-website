
import React from 'react';
import { useAuth } from '../App';
import { Navigate } from 'react-router-dom';

const DashboardRouter = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect based on user role
  switch(user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'agency':
      return <Navigate to="/company-dashboard" replace />;
    default:
      return <Navigate to="/user-dashboard" replace />;
  }
};

export default DashboardRouter;