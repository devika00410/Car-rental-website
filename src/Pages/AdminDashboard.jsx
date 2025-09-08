import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { admin, adminLogout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCars: 0,
    totalBookings: 0,
    revenue: 0,
    pendingApprovals: 0,
    pendingPayments: 0,
    activeAgencies: 0,
    unreadNotifications: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Load data from localStorage
    const agencies = JSON.parse(localStorage.getItem('pendingAgencies') || '[]');
    const storedNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const cars = JSON.parse(localStorage.getItem('cars') || '[]');
    const approvedAgencies = JSON.parse(localStorage.getItem('agencies') || '[]');

    // Filter pending payments
    const pendingPaymentBookings = bookings.filter(booking => 
      booking.status === 'pending_payment' || booking.paymentStatus === 'pending'
    );

    // Calculate revenue
    const confirmedBookings = bookings.filter(booking => 
      booking.status === 'confirmed' || booking.paymentStatus === 'approved'
    );
    const revenue = confirmedBookings.reduce((sum, booking) => sum + (booking.total || booking.amount || 0), 0);

    // Count unread notifications
    const unreadNotifications = storedNotifications.filter(notif => !notif.read).length;

    // Update state
    setPendingApprovals(agencies);
    setNotifications(storedNotifications);
    setPendingPayments(pendingPaymentBookings);
    
    setStats({
      totalUsers: users.length,
      totalCars: cars.length,
      totalBookings: bookings.length,
      revenue: revenue,
      pendingApprovals: agencies.length,
      pendingPayments: pendingPaymentBookings.length,
      activeAgencies: approvedAgencies.length,
      unreadNotifications: unreadNotifications
    });
  };

  const handleAgencyApproval = (agencyId, approve) => {
    const agencies = JSON.parse(localStorage.getItem('pendingAgencies') || '[]');
    const agency = agencies.find(a => a.id === agencyId);
    
    if (approve) {
      const approvedAgencies = JSON.parse(localStorage.getItem('agencies') || '[]');
      approvedAgencies.push({
        ...agency,
        approved: true,
        approvedDate: new Date().toISOString()
      });
      localStorage.setItem('agencies', JSON.stringify(approvedAgencies));

      const existingCars = JSON.parse(localStorage.getItem('cars') || '[]');
      const newCars = agency.cars.map(car => ({
        ...car,
        agencyId: agency.id,
        agencyName: agency.agencyName,
        approved: true
      }));
      localStorage.setItem('cars', JSON.stringify([...existingCars, ...newCars]));

      // Create notification
      const newNotification = {
        id: Date.now().toString(),
        type: 'agency_approved',
        message: `Agency "${agency.agencyName}" has been approved`,
        timestamp: new Date().toISOString(),
        read: false
      };
      const updatedNotifications = [...notifications, newNotification];
      localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
    }

    // Remove from pending
    const updatedAgencies = agencies.filter(a => a.id !== agencyId);
    localStorage.setItem('pendingAgencies', JSON.stringify(updatedAgencies));
    loadDashboardData();
  };

  const handlePaymentApproval = (bookingId, approve) => {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);
    
    if (bookingIndex !== -1) {
      if (approve) {
        bookings[bookingIndex].paymentStatus = 'approved';
        bookings[bookingIndex].status = 'confirmed';
        
        const newNotification = {
          id: Date.now().toString(),
          type: 'payment_approved',
          message: `Payment approved for booking ${bookings[bookingIndex].id}`,
          timestamp: new Date().toISOString(),
          read: false,
          bookingId: bookingId
        };
        const updatedNotifications = [...notifications, newNotification];
        localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
      } else {
        bookings[bookingIndex].paymentStatus = 'rejected';
        bookings[bookingIndex].status = 'cancelled';
      }
      
      localStorage.setItem('bookings', JSON.stringify(bookings));
      loadDashboardData();
    }
  };

  const markNotificationAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
    loadDashboardData();
  };

  const markAllNotificationsAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
    localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
    loadDashboardData();
  };

  const handleLogout = () => {
    adminLogout();
    window.location.href = '/';
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {admin?.username}</p>
          <div className="header-right">
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚗</div>
          <div className="stat-content">
            <h3>{stats.totalCars}</h3>
            <p>Total Cars</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>₹{stats.revenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Left Sidebar */}
        <div className="sidebar">
          <div className="sidebar-section">
            <h3>Quick Actions</h3>
            <button onClick={() => setActiveTab('overview')} className="sidebar-btn">
              📊 Overview
            </button>
            <button onClick={() => setActiveTab('approvals')} className="sidebar-btn">
              ✅ Agency Approvals {stats.pendingApprovals > 0 && <span className="badge">{stats.pendingApprovals}</span>}
            </button>
            <button onClick={() => setActiveTab('payments')} className="sidebar-btn">
              💰 Payments {stats.pendingPayments > 0 && <span className="badge">{stats.pendingPayments}</span>}
            </button>
            <button onClick={() => setActiveTab('notifications')} className="sidebar-btn">
              🔔 Notifications {stats.unreadNotifications > 0 && <span className="badge">{stats.unreadNotifications}</span>}
            </button>
          </div>

          <div className="sidebar-section">
            <h3>Pending Actions</h3>
            <div className="pending-item">
              <span>⏰ Agency Approvals</span>
              <span className="count">{stats.pendingApprovals}</span>
            </div>
            <div className="pending-item">
              <span>📋 Payment Approvals</span>
              <span className="count">{stats.pendingPayments}</span>
            </div>
            <div className="pending-item">
              <span>🔔 Unread Notifications</span>
              <span className="count">{stats.unreadNotifications}</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          {activeTab === 'overview' && (
            <div className="tab-content">
              <h2>Platform Overview</h2>
              <p>Welcome to your admin dashboard. Manage agencies, approve payments, and monitor platform performance.</p>
              
              <div className="recent-notifications">
                <h3>Recent Notifications</h3>
                {notifications.slice(0, 3).map(notification => (
                  <div key={notification.id} className="notification-card">
                    <div className={`status-dot ${notification.read ? 'read' : 'unread'}`}></div>
                    <div className="notification-content">
                      <p>{notification.message}</p>
                      <span>{new Date(notification.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && <p>No notifications yet</p>}
              </div>
            </div>
          )}

          {activeTab === 'approvals' && (
            <div className="tab-content">
              <h2>Agency Approval Requests</h2>
              {pendingApprovals.length === 0 ? (
                <p className="empty-state">No pending agency approvals</p>
              ) : (
                <div className="approvals-list">
                  {pendingApprovals.map(agency => (
                    <div key={agency.id} className="approval-card">
                      <div className="agency-info">
                        <h4>{agency.agencyName}</h4>
                        <p>Owner: {agency.owner}</p>
                        <p>Email: {agency.email}</p>
                        <p>Cars: {agency.cars.length}</p>
                      </div>
                      <div className="approval-actions">
                        <button onClick={() => handleAgencyApproval(agency.id, true)} className="btn-success">
                          Approve
                        </button>
                        <button onClick={() => handleAgencyApproval(agency.id, false)} className="btn-danger">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="tab-content">
              <h2>Payment Approvals</h2>
              {pendingPayments.length === 0 ? (
                <p className="empty-state">No pending payments</p>
              ) : (
                <div className="payments-table">
                  <table>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Car</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingPayments.map(booking => (
                        <tr key={booking.id}>
                          <td>{booking.user?.name || 'Unknown'}</td>
                          <td>{booking.car?.name || 'Unknown'}</td>
                          <td>₹{booking.total || booking.amount || 0}</td>
                          <td>{new Date(booking.date).toLocaleDateString()}</td>
                          <td>
                            <button onClick={() => handlePaymentApproval(booking.id, true)} className="btn-success">
                              Approve
                            </button>
                            <button onClick={() => handlePaymentApproval(booking.id, false)} className="btn-danger">
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="tab-content">
              <div className="notifications-header">
                <h2>All Notifications</h2>
                <button onClick={markAllNotificationsAsRead} className="btn-secondary">
                  Mark all as read
                </button>
              </div>
              
              {notifications.length === 0 ? (
                <p className="empty-state">No notifications</p>
              ) : (
                <div className="notifications-list">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="notification-content">
                        <p>{notification.message}</p>
                        <span>{new Date(notification.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;