import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('cars');
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({
    name: '',
    type: 'economy',
    image: '',
    price: '',
    color: 'black',
    rating: 5,
    seats: 4,
    location: '',
    make: '',
    model: ''
  });

  // Load cars from localStorage on component mount
  useEffect(() => {
    const savedCars = JSON.parse(localStorage.getItem('adminCars') || '[]');
    setCars(savedCars);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCar(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'rating' || name === 'seats' ? Number(value) : value
    }));
  };

  const handleAddCar = (e) => {
    e.preventDefault();
    
    const carToAdd = {
      ...newCar,
      id: `admin-car-${Date.now()}`,
      price: Number(newCar.price)
    };

    const updatedCars = [...cars, carToAdd];
    setCars(updatedCars);
    localStorage.setItem('adminCars', JSON.stringify(updatedCars));
    
    // Reset form
    setNewCar({
      name: '',
      type: 'economy',
      image: '',
      price: '',
      color: 'black',
      rating: 5,
      seats: 4,
      location: '',
      make: '',
      model: ''
    });

    alert('Car added successfully!');
  };

  const handleDeleteCar = (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      const updatedCars = cars.filter(car => car.id !== carId);
      setCars(updatedCars);
      localStorage.setItem('adminCars', JSON.stringify(updatedCars));
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage cars and bookings</p>
      </header>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'cars' ? 'active' : ''}`} 
          onClick={() => setActiveTab('cars')}
        >
          Manage Cars
        </button>
        <button 
          className={`admin-tab ${activeTab === 'bookings' ? 'active' : ''}`} 
          onClick={() => setActiveTab('bookings')}
        >
          View Bookings
        </button>
      </div>

      <main className="admin-main-content">
        {activeTab === 'cars' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Add New Car</h2>
            </div>

            <form onSubmit={handleAddCar} className="car-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Car Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newCar.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Make</label>
                  <input
                    type="text"
                    name="make"
                    value={newCar.make}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Model</label>
                  <input
                    type="text"
                    name="model"
                    value={newCar.model}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select
                    name="type"
                    value={newCar.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="economy">Economy</option>
                    <option value="luxury">Luxury</option>
                    <option value="suv">SUV</option>
                    <option value="sedan">Sedan</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Price per Day (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={newCar.price}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Color</label>
                  <select
                    name="color"
                    value={newCar.color}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="black">Black</option>
                    <option value="white">White</option>
                    <option value="silver">Silver</option>
                    <option value="gray">Gray</option>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Seats</label>
                  <input
                    type="number"
                    name="seats"
                    value={newCar.seats}
                    onChange={handleInputChange}
                    min="1"
                    max="12"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Rating (1-5)</label>
                  <input
                    type="number"
                    name="rating"
                    value={newCar.rating}
                    onChange={handleInputChange}
                    min="1"
                    max="5"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={newCar.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={newCar.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/car-image.jpg"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Add Car
              </button>
            </form>

            <div className="section-header">
              <h2>Managed Cars ({cars.length})</h2>
            </div>

            {cars.length === 0 ? (
              <div className="empty-state">
                <p>No cars added yet. Add your first car above.</p>
              </div>
            ) : (
              <div className="cars-grid">
                {cars.map(car => (
                  <div key={car.id} className="car-card">
                    <img src={car.image} alt={car.name} className="car-image" />
                    <div className="car-details">
                      <h3>{car.name}</h3>
                      <p>{car.make} {car.model}</p>
                      <p>Type: {car.type}</p>
                      <p>Price: ₹{car.price}/day</p>
                      <p>Color: {car.color}</p>
                      <p>Seats: {car.seats}</p>
                      <p>Rating: {car.rating} ★</p>
                      <p>Location: {car.location}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteCar(car.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>All Bookings</h2>
            </div>
            <div className="empty-state">
              <p>Booking management feature coming soon.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;