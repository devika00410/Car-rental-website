// DashboardRouter.jsx - Create this new component to handle dashboard routing
import React from 'react';
import { useAuth } from '../App';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const DashboardRouter = () => {
  const { admin, user } = useAuth();
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  const isUserLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (admin && isAdminLoggedIn) {
    return <AdminDashboard />;
  }

  if (user && isUserLoggedIn) {
    return <UserDashboard />;
  }

  // If not logged in, you might want to redirect to login
  return (
    <div className="page-container">
      <h1>Access Denied</h1>
      <p>Please log in to access your dashboard.</p>
    </div>
  );
};

export default DashboardRouter;