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
    unreadNotifications: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const agencies = JSON.parse(localStorage.getItem('pendingAgencies') || '[]');
    const storedNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const cars = JSON.parse(localStorage.getItem('cars') || '[]');

    const pendingPaymentBookings = bookings.filter(booking => 
      booking.status === 'pending_payment' || booking.paymentStatus === 'pending'
    );

    const confirmedBookings = bookings.filter(booking => 
      booking.status === 'confirmed' || booking.paymentStatus === 'approved'
    );
    const revenue = confirmedBookings.reduce((sum, booking) => sum + (booking.total || booking.amount || 0), 0);

    const unreadNotifications = storedNotifications.filter(notif => !notif.read).length;

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
    }

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
      } else {
        bookings[bookingIndex].paymentStatus = 'rejected';
        bookings[bookingIndex].status = 'cancelled';
      }
      
      localStorage.setItem('bookings', JSON.stringify(bookings));
      loadDashboardData();
    }
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
      <header className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {admin?.username}</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalUsers}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalCars}</h3>
          <p>Total Cars</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalBookings}</h3>
          <p>Total Bookings</p>
        </div>
        <div className="stat-card">
          <h3>₹{stats.revenue.toLocaleString()}</h3>
          <p>Total Revenue</p>
        </div>
      </div>

      <div className="dashboard-content">
        <nav className="sidebar">
          <div className="nav-section">
            <button 
              onClick={() => setActiveTab('overview')} 
              className={activeTab === 'overview' ? 'nav-btn active' : 'nav-btn'}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('approvals')} 
              className={activeTab === 'approvals' ? 'nav-btn active' : 'nav-btn'}
            >
              Agency Approvals {stats.pendingApprovals > 0 && <span className="badge">{stats.pendingApprovals}</span>}
            </button>
            <button 
              onClick={() => setActiveTab('payments')} 
              className={activeTab === 'payments' ? 'nav-btn active' : 'nav-btn'}
            >
              Payments {stats.pendingPayments > 0 && <span className="badge">{stats.pendingPayments}</span>}
            </button>
            <button 
              onClick={() => setActiveTab('notifications')} 
              className={activeTab === 'notifications' ? 'nav-btn active' : 'nav-btn'}
            >
              Notifications {stats.unreadNotifications > 0 && <span className="badge">{stats.unreadNotifications}</span>}
            </button>
          </div>
        </nav>

        <main className="main-content">
          {activeTab === 'overview' && (
            <div className="tab-content">
              <h2>Platform Overview</h2>
              <div className="recent-notifications">
                <h3>Recent Notifications</h3>
                {notifications.slice(0, 3).map(notification => (
                  <div key={notification.id} className="notification-item">
                    <p>{notification.message}</p>
                    <span>{new Date(notification.timestamp).toLocaleString()}</span>
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
                <p>No pending agency approvals</p>
              ) : (
                <div className="approvals-list">
                  {pendingApprovals.map(agency => (
                    <div key={agency.id} className="approval-item">
                      <div className="agency-info">
                        <h4>{agency.agencyName}</h4>
                        <p>Owner: {agency.owner}</p>
                        <p>Email: {agency.email}</p>
                        <p>Cars: {agency.cars.length}</p>
                      </div>
                      <div className="action-buttons">
                        <button onClick={() => handleAgencyApproval(agency.id, true)} className="btn btn-primary">
                          Approve
                        </button>
                        <button onClick={() => handleAgencyApproval(agency.id, false)} className="btn btn-secondary">
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
                <p>No pending payments</p>
              ) : (
                <div className="table-container">
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
                            <div className="action-buttons">
                              <button onClick={() => handlePaymentApproval(booking.id, true)} className="btn btn-primary">
                                Approve
                              </button>
                              <button onClick={() => handlePaymentApproval(booking.id, false)} className="btn btn-secondary">
                                Reject
                              </button>
                            </div>
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
                <button onClick={markAllNotificationsAsRead} className="btn btn-secondary">
                  Mark all as read
                </button>
              </div>
              
              {notifications.length === 0 ? (
                <p>No notifications</p>
              ) : (
                <div className="notifications-list">
                  {notifications.map(notification => (
                    <div key={notification.id} className="notification-item">
                      <p>{notification.message}</p>
                      <span>{new Date(notification.timestamp).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;