import React, { useState, useEffect } from 'react';
import './CompanyDashboard.css';

const CompanyDashboard = () => {
  const [cars, setCars] = useState([]);
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    rentedCars: 0,
    pendingApproval: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      // Simulating API call with mock data
      const mockCars = [
        { id: 1, model: 'Toyota Camry', status: 'Available', earnings: '$120' },
        { id: 2, model: 'Honda Civic', status: 'Rented', earnings: '$150' },
        { id: 3, model: 'BMW X5', status: 'Pending Approval', earnings: '$0' }
      ];
      
      const mockStats = {
        totalCars: 3,
        availableCars: 1,
        rentedCars: 1,
        pendingApproval: 1,
        totalEarnings: '$270'
      };
      
      setCars(mockCars);
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };

  return (
    <div className="company-dashboard">
      <header className="dashboard-header">
        <h1>Company Dashboard</h1>
        <p>Manage your fleet and track performance</p>
      </header>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🚗</div>
          <div className="stat-content">
            <h3>Total Cars</h3>
            <p className="stat-number">{stats.totalCars}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Available Cars</h3>
            <p className="stat-number">{stats.availableCars}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Rented Cars</h3>
            <p className="stat-number">{stats.rentedCars}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Approval</h3>
            <p className="stat-number">{stats.pendingApproval}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💵</div>
          <div className="stat-content">
            <h3>Total Earnings</h3>
            <p className="stat-number">{stats.totalEarnings}</p>
          </div>
        </div>
      </div>
      
      <div className="cars-section">
        <div className="section-header">
          <h2>Your Cars</h2>
          <button className="add-car-btn">+ Add New Car</button>
        </div>
        
        <div className="cars-list">
          {cars.map(car => (
            <div key={car.id} className="car-card">
              <div className="car-info">
                <h3>{car.model}</h3>
                <span className={`status-badge status-${car.status.toLowerCase().replace(' ', '-')}`}>
                  {car.status}
                </span>
              </div>
              <div className="car-earnings">
                <p>Earnings: {car.earnings}</p>
              </div>
              <div className="car-actions">
                <button className="btn-edit">Edit</button>
                <button className="btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;