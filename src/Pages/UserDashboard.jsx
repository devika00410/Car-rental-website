import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userBookings, setUserBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');

  // Load user bookings from localStorage
  useEffect(() => {
    loadUserBookings();
  }, [user]);

  const loadUserBookings = () => {
    try {
      // Get bookings from localStorage
      let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      
      // If no bookings exist, create sample data for demonstration
      if (bookings.length === 0) {
        bookings = [
          {
            id: 1,
            userId: user?.id || 'user123',
            userEmail: user?.email,
            car: {
              name: 'Toyota Camry',
              make: 'Toyota',
              model: 'Camry',
            },
            amount: 2500,
            pickupDate: '2024-01-15',
            returnDate: '2024-01-18',
            status: 'confirmed',
            pickupLocation: 'City Center Branch'
          },
          {
            id: 2,
            userId: user?.id || 'user123',
            userEmail: user?.email,
            car: {
              name: 'Honda Civic',
              make: 'Honda',
              model: 'Civic',
            },
            amount: 2200,
            pickupDate: '2024-01-20',
            returnDate: '2024-01-22',
            status: 'upcoming',
            pickupLocation: 'Airport Branch'
          }
        ];
        localStorage.setItem('bookings', JSON.stringify(bookings));
      }

      // Filter bookings for current user - improved matching logic
      const userBookings = bookings.filter(booking => {
        // Check multiple possible identifiers
        const matchesUserId = booking.userId === user?.id;
        const matchesUserEmail = booking.userEmail === user?.email;
        const matchesFallbackId = booking.userId === (user?.id || 'user123');
        
        return matchesUserId || matchesUserEmail || matchesFallbackId;
      });
      
      setUserBookings(userBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setUserBookings([]);
    }
  };

  const userStats = {
    totalBookings: userBookings.length,
    upcomingBookings: userBookings.filter(b => b.status === 'upcoming' || b.status === 'confirmed').length,
    completedBookings: userBookings.filter(b => b.status === 'completed').length,
    totalSpent: userBookings.reduce((sum, booking) => sum + (parseFloat(booking.amount) || 0), 0)
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        
        // Reload bookings
        loadUserBookings();
        alert('Booking cancelled successfully!');
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Error cancelling booking. Please try again.');
      }
    }
  };

  const handleNewBooking = () => {
    navigate('/cars');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { class: 'status-confirmed', text: 'Confirmed' },
      upcoming: { class: 'status-upcoming', text: 'Upcoming' },
      completed: { class: 'status-completed', text: 'Completed' },
      cancelled: { class: 'status-cancelled', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { class: 'status-pending', text: 'Pending' };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  // Function to get car name with fallback
  const getCarName = (booking) => {
    if (booking.carName) return booking.carName;
    if (booking.car && booking.car.name) return booking.car.name;
    if (booking.make && booking.model) return `${booking.make} ${booking.model}`;
    return 'Unknown Car';
  };

  return (
    <div className="user-dashboard">
      {/* Header */}
      <header className="user-header">
        <div className="user-header-content">
          <div className="user-welcome-section">
            <h1>Welcome back, {user?.username || user?.email || 'Valued Customer'}!</h1>
            <p>Here's your booking overview and recent activity</p>
          </div>
          <button onClick={handleNewBooking} className="new-booking-btn">
            Book New Car
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="user-stats-grid">
        <div className="user-stat-card">
          <div className="stat-content">
            <h3 className="stat-value">{userStats.totalBookings}</h3>
            <p className="stat-label">Total Bookings</p>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="stat-content">
            <h3 className="stat-value">{userStats.upcomingBookings}</h3>
            <p className="stat-label">Upcoming Trips</p>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="stat-content">
            <h3 className="stat-value">₹{userStats.totalSpent.toLocaleString()}</h3>
            <p className="stat-label">Total Spent</p>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="stat-content">
            <h3 className="stat-value">{userStats.completedBookings}</h3>
            <p className="stat-label">Completed Trips</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="user-tabs">
        <button className={`user-tab ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
          My Bookings
          {userBookings.length > 0 && <span className="tab-badge">{userBookings.length}</span>}
        </button>
        <button className={`user-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          Profile
        </button>
      </div>

      <main className="user-main-content">
        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <div className="section-header">
              <h2>My Bookings</h2>
              <p>Manage your current and upcoming car rentals</p>
            </div>

            {userBookings.length === 0 ? (
              <div className="empty-bookings">
                <h3>No bookings yet</h3>
                <p>Start your journey by booking your first car</p>
                <button onClick={handleNewBooking} className="cta-button">
                  Book Your First Car
                </button>
              </div>
            ) : (
              <div className="bookings-grid">
                {userBookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-details">
                      <h3>{getCarName(booking)}</h3>
                      <div className="booking-meta">
                        <span className="booking-date">
                          {booking.pickupDate} - {booking.returnDate}
                        </span>
                        <span className="booking-amount">₹{booking.amount}</span>
                      </div>
                      <div className="booking-status">
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="booking-info">
                        <p><strong>Booking ID:</strong> {booking.id}</p>
                        <p><strong>Pickup Location:</strong> {booking.pickupLocation}</p>
                      </div>
                    </div>
                    <div className="booking-actions">
                      {(booking.status === 'upcoming' || booking.status === 'confirmed') && (
                        <button 
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="btn-danger"  >
                          Cancel Booking
                        </button>
                      )}
                      <button className="btn-secondary">
                        Contact Support
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Profile Information</h2>
              <p>Manage your account details and preferences</p>
            </div>
            <div className="profile-card">
              <div className="profile-info">
                <h3>{user?.username || user?.email}</h3>
                <p>{user?.email}</p>
                <span className="member-since">Member since {new Date().toLocaleDateString()}</span>
              </div>
              <div className="profile-details">
                <div className="detail-item">
                  <label>Full Name</label>
                  <p>{user?.username || 'Not provided'}</p>
                </div>
                <div className="detail-item">
                  <label>Email Address</label>
                  <p>{user?.email}</p>
                </div>
                <div className="detail-item">
                  <label>Account Type</label>
                  <p>Standard User</p>
                </div>
              </div>
              <button className="edit-profile-btn">Edit Profile</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;