import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BookingPage.css';

// Reusable Components
const InputField = ({ label, type, name, value, onChange, error, disabled, placeholder, min, max, rows }) => {
  const inputProps = { type, name, value, onChange, disabled, placeholder, min, max, className: error ? 'error' : '' };
  return (
    <div className="form-group">
      <label>{label}</label>
      {type === 'textarea' ? <textarea {...inputProps} rows={rows || 3} /> : <input {...inputProps} />}
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

const RadioOption = ({ label, value, checked, onChange, name }) => (
  <label className="radio-option">
    <input type="radio" name={name} value={value} checked={checked} onChange={onChange} />
    <span>{label}</span>
  </label>
);

const FormRow = ({ children }) => <div className="form-row">{children}</div>;

const SectionTitle = ({ title }) => <h3 className="section-title">{title}</h3>;

const CostLine = ({ label, value }) => (
  <div className="cost-line">
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState({ name: '', email: '', phone: '', altPhone: '', address: '' });
  const [booking, setBooking] = useState({ 
    duration: 1, pickupDate: '', driverOption: 'without', licenseNumber: '', 
    licenseExpiry: '', deliveryOption: 'pickup', destination: '', termsAccepted: false 
  });
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [availability, setAvailability] = useState('checking');

  // Get car data
  useEffect(() => {
    const init = async () => {
      const { car: carFromState, carId: carIdFromState } = location.state || {};

      if (carFromState) {
        setCar(carFromState);
        checkAvailability(carFromState.id);
        setLoading(false);
        return;
      }

      if (!carIdFromState) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch('https://raw.githubusercontent.com/devika00410/Car-rental-API/main/data.json');
        const list = await res.json();
        const found = list.find(c => c.id == carIdFromState);
        if (found) {
          setCar(found);
          setBooking(prev => ({ ...prev, destination: found.destination }));
          checkAvailability(found.id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, [location.state]);

  // Check login status
  useEffect(() => {
    const logged = localStorage.getItem('isLoggedIn') === 'true';
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    
    if (!logged || !name || !email) {
      navigate('/login');
    } else {
      setUser(u => ({ ...u, name, email }));
    }
  }, [navigate]);

  const checkAvailability = (carId) => {
    setTimeout(() => {
      const isAvailable = Math.random() > 0.2;
      setAvailability(isAvailable ? 'available' : 'unavailable');
    }, 800);
  };

  const handleInputChange = (setState) => e => {
    const { name, value, type, checked } = e.target;
    setState(s => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    
    if (!/^\d{10}$/.test(user.phone || '')) errs.phone = 'Enter a valid 10-digit phone number';
    if (user.altPhone && !/^\d{10}$/.test(user.altPhone)) errs.altPhone = 'Enter a valid 10-digit alternate phone number';
    if (!user.address?.trim()) errs.address = 'Address is required';
    if (!booking.pickupDate) errs.pickupDate = 'Pickup date is required';
    if (!booking.destination?.trim()) errs.destination = 'Destination is required';
    
    if (booking.driverOption === 'without') {
      if (!booking.licenseNumber || booking.licenseNumber.length < 8) errs.licenseNumber = 'Valid license number is required when driving yourself';
      if (!booking.licenseExpiry) {
        errs.licenseExpiry = 'License expiry date is required';
      } else if (new Date(booking.licenseExpiry) < new Date()) {
        errs.licenseExpiry = 'License must not be expired';
      }
    }
    
    if (!booking.termsAccepted) errs.termsAccepted = 'You must accept the terms and conditions';
    return errs;
  };

  const calculateTotal = () => {
    if (!car) return 0;
    const base = Number(car.price || 0) * Number(booking.duration || 1);
    const driver = booking.driverOption === 'with' ? 500 * booking.duration : 0;
    const delivery = booking.driverOption === 'without' && booking.deliveryOption === 'delivery' ? 300 : 0;
    return base + driver + delivery;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (availability === 'unavailable') {
      alert('Sorry, this car is not available for the selected dates. Please choose another vehicle.');
      return;
    }
    
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Create a temporary booking record with pending status
      const bookingData = {
        id: `temp_${Date.now()}`,
        user: { ...user },
        booking: { ...booking },
        car: { ...car },
        total: calculateTotal(),
        status: 'pending_payment',
        date: new Date().toISOString()
      };
      
      // Store temporarily
      localStorage.setItem('currentBooking', JSON.stringify(bookingData));
      
      // Navigate to payment page with all necessary data
      navigate('/payment', { 
        state: { 
          user, 
          booking, 
          car, 
          total: calculateTotal() 
        } 
      });
      
    } catch (error) {
      console.error('Error during booking submission:', error);
      alert('There was an error processing your booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="booking-container"><div className="loading">Loading car details...</div></div>;
  
  if (!car) return (
    <div className="booking-container">
      <div className="error-page">
        <h2>Car Not Found</h2>
        <p>The selected car could not be found. Please go back and try again.</p>
        <button className="btn-primary" onClick={() => navigate('/cars')}>Back to Cars</button>
      </div>
    </div>
  );

  return (
    <div className="booking-container">
      <div className="booking-form">
        <div className="form-header">
          <h2>Complete Your Booking</h2>
          <p>Please fill in your details to confirm your reservation</p>
        </div>

        {/* Car Summary */}
        <div className="car-summary">
          <div className="car-image">
            <img src={car.image} alt={car.name} />
            <div className={`availability-badge ${availability}`}>
              {availability === 'available' ? 'Available' : 
               availability === 'unavailable' ? 'Unavailable' : 'Checking availability...'}
            </div>
          </div>
          <div className="car-details">
            <h3>{car.name}</h3>
            <p className="car-model">{car.model}</p>
            <p className="car-specs">{car.fuel_type} • {car.destination} • {car.seats} seats</p>
            <div className="destination-info">
              <strong>Default Pickup Location:</strong> {car.destination || 'Main Office'}
            </div>
            <p className="car-price">{formatCurrency(car.price)} <span>per day</span></p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* User Information */}
          <div className="form-section">
            <SectionTitle title="Your Information" />
            
            <FormRow>
              <InputField label="Full Name" type="text" name="name" value={user.name} 
                onChange={handleInputChange(setUser)} disabled={true} />
              <InputField label="Email Address" type="email" name="email" value={user.email} 
                onChange={handleInputChange(setUser)} disabled={true} />
            </FormRow>

            <FormRow>
              <InputField label="Phone Number *" type="tel" name="phone" value={user.phone} 
                onChange={handleInputChange(setUser)} error={errors.phone} placeholder="Enter your 10-digit phone number" />
              <InputField label="Alternate Phone Number" type="tel" name="altPhone" value={user.altPhone} 
                onChange={handleInputChange(setUser)} error={errors.altPhone} placeholder="Enter alternate phone number (optional)" />
            </FormRow>

            <FormRow>
              <InputField label="Duration (days) *" type="number" name="duration" value={booking.duration} 
                onChange={handleInputChange(setBooking)} min="1" max="30" />
              <InputField label="Destination *" type="text" name="destination" value={booking.destination} 
                onChange={handleInputChange(setBooking)} error={errors.destination} placeholder="Where will you be driving?" />
            </FormRow>

            <InputField label="Address *" type="textarea" name="address" value={user.address} 
              onChange={handleInputChange(setUser)} error={errors.address} placeholder="Your complete address" />
            
            <InputField label="Pickup Date *" type="date" name="pickupDate" value={booking.pickupDate} 
              onChange={handleInputChange(setBooking)} error={errors.pickupDate} min={new Date().toISOString().split('T')[0]} />
          </div>

          {/* Driver Options */}
          <div className="form-section">
            <SectionTitle title="Driver Options" />
            
            <div className="radio-group">
              <RadioOption label="With Professional Driver (+₹500/day)" value="with" 
                name="driverOption" checked={booking.driverOption === 'with'} onChange={handleInputChange(setBooking)} />
              <RadioOption label="Without Driver (I'll drive myself)" value="without" 
                name="driverOption" checked={booking.driverOption === 'without'} onChange={handleInputChange(setBooking)} />
            </div>

            {booking.driverOption === 'without' && (
              <>
                <FormRow>
                  <InputField label="Driver's License Number *" type="text" name="licenseNumber" 
                    value={booking.licenseNumber} onChange={handleInputChange(setBooking)} error={errors.licenseNumber} placeholder="Enter your license number" />
                  <InputField label="License Expiry Date *" type="date" name="licenseExpiry" 
                    value={booking.licenseExpiry} onChange={handleInputChange(setBooking)} error={errors.licenseExpiry} min={new Date().toISOString().split('T')[0]} />
                </FormRow>

                <div className="form-group">
                  <label>Delivery Option *</label>
                  <select name="deliveryOption" value={booking.deliveryOption} 
                    onChange={handleInputChange(setBooking)} className="delivery-select">
                    <option value="pickup">Pickup from Agency</option>
                    <option value="delivery">Home Delivery (+₹300)</option>
                  </select>
                  <p className="delivery-note">
                    {booking.deliveryOption === 'delivery' 
                      ? 'The car will be delivered to your address before the pickup time' 
                      : 'You need to collect the car from our agency office'}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="form-section">
            <label className="checkbox-option">
              <input type="checkbox" name="termsAccepted" checked={booking.termsAccepted} 
                onChange={handleInputChange(setBooking)} />
              <span>I accept the terms and conditions *</span>
            </label>
            {errors.termsAccepted && <span className="error-text">{errors.termsAccepted}</span>}
          </div>

          {/* Total and Submit */}
          <div className="total-section">
            <div className="cost-breakdown">
              <CostLine label={`Base Rental (${booking.duration} days):`} value={formatCurrency(car.price * booking.duration)} />
              
              {booking.driverOption === 'with' && (
                <CostLine label={`Driver Charge (${booking.duration} days):`} value={formatCurrency(500 * booking.duration)} />
              )}
              
              {booking.driverOption === 'without' && booking.deliveryOption === 'delivery' && (
                <CostLine label="Home Delivery Charge:" value={formatCurrency(300)} />
              )}
              
              <div className="cost-total">
                <span>Total Amount:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`btn-primary ${availability === 'unavailable' ? 'disabled' : ''}`}
              disabled={submitting || availability === 'unavailable'}
            >
              {submitting ? 'Processing...' : 
               availability === 'unavailable' ? 'Car Not Available' : 
               `Proceed to Pay ${formatCurrency(calculateTotal())}`}
            </button>
            
            {availability === 'unavailable' && (
              <p className="availability-message">
                This car is currently unavailable. Please select another vehicle or try different dates.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}