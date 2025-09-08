import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentPage.css';

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, booking, car, total } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // If no booking data, redirect back
  if (!location.state) {
    navigate('/booking');
    return null;
  }

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setPaymentError('');

   
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2;
      
      if (isSuccess) {
        setPaymentSuccess(true);
        
        // Create booking record for admin dashboard
        const bookingRecord = {
          id: Date.now().toString(),
          user,
          booking,
          car,
          total,
          paymentMethod,
          status: 'confirmed',
          date: new Date().toISOString(),
          paymentId: `PAY${Date.now()}`
        };
        
        // Store in localStorage for admin dashboard
        const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        localStorage.setItem('bookings', JSON.stringify([...existingBookings, bookingRecord]));
        
        // Also store in a separate notifications array for admin
        const notifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
        const notification = {
          id: Date.now().toString(),
          type: 'new_booking',
          message: `New booking from ${user.name} for ${car.name}`,
          timestamp: new Date().toISOString(),
          read: false,
          bookingId: bookingRecord.id
        };
        localStorage.setItem('adminNotifications', JSON.stringify([...notifications, notification]));
      } else {
        setPaymentError('Payment failed. Please try again or use a different payment method.');
      }
      setProcessing(false);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="payment-container">
        <div className="payment-success">
          <div className="success-icon">✓</div>
          <h2>Payment Successful!</h2>
          <p>Your booking has been confirmed. A confirmation email has been sent to {user.email}.</p>
          
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <div className="summary-item">
              <span>Booking ID:</span>
              <span>{`BK${Date.now()}`}</span>
            </div>
            <div className="summary-item">
              <span>Vehicle:</span>
              <span>{car.name} ({car.model})</span>
            </div>
            <div className="summary-item">
              <span>Duration:</span>
              <span>{booking.duration} days</span>
            </div>
            <div className="summary-item">
              <span>Pickup Date:</span>
              <span>{new Date(booking.pickupDate).toLocaleDateString()}</span>
            </div>
            <div className="summary-item">
              <span>Total Amount:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          
          <button 
            className="btn-primary" 
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-form">
        <div className="payment-header">
          <h2>Complete Payment</h2>
          <p>Total Amount: {formatCurrency(total)}</p>
        </div>

        <div className="booking-details-preview">
          <h3>Booking Details</h3>
          <p><strong>Vehicle:</strong> {car.name} ({car.model})</p>
          <p><strong>Duration:</strong> {booking.duration} days</p>
          <p><strong>Pickup:</strong> {new Date(booking.pickupDate).toLocaleDateString()}</p>
          <p><strong>Driver Option:</strong> {booking.driverOption === 'with' ? 'With Driver' : 'Self Drive'}</p>
        </div>

        <form onSubmit={handlePayment}>
          <div className="payment-methods">
            <h3>Select Payment Method</h3>
            <div className="method-options">
              <label className={`method-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="card" 
                  checked={paymentMethod === 'card'} 
                  onChange={() => setPaymentMethod('card')} 
                />
                <span>Credit/Debit Card</span>
              </label>
              
              <label className={`method-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="upi" 
                  checked={paymentMethod === 'upi'} 
                  onChange={() => setPaymentMethod('upi')} 
                />
                <span>UPI</span>
              </label>
              
              <label className={`method-option ${paymentMethod === 'netbanking' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="netbanking" 
                  checked={paymentMethod === 'netbanking'} 
                  onChange={() => setPaymentMethod('netbanking')} 
                />
                <span>Net Banking</span>
              </label>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="card-details">
              <div className="form-group">
                <label>Card Number</label>
                <input 
                  type="text" 
                  name="number" 
                  value={cardDetails.number} 
                  onChange={handleCardInputChange} 
                  placeholder="1234 5678 9012 3456" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Cardholder Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={cardDetails.name} 
                  onChange={handleCardInputChange} 
                  placeholder="John Doe" 
                  required 
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input 
                    type="text" 
                    name="expiry" 
                    value={cardDetails.expiry} 
                    onChange={handleCardInputChange} 
                    placeholder="MM/YY" 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>CVV</label>
                  <input 
                    type="text" 
                    name="cvv" 
                    value={cardDetails.cvv} 
                    onChange={handleCardInputChange} 
                    placeholder="123" 
                    required 
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div className="form-group">
              <label>UPI ID</label>
              <input 
                type="text" 
                placeholder="yourname@upi" 
                required 
              />
            </div>
          )}

          {paymentMethod === 'netbanking' && (
            <div className="form-group">
              <label>Select Bank</label>
              <select required>
                <option value="">Select your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
              </select>
            </div>
          )}

          {paymentError && <div className="error-message">{paymentError}</div>}

          <button 
            type="submit" 
            className="btn-primary pay-button"
            disabled={processing}
          >
            {processing ? 'Processing Payment...' : `Pay ${formatCurrency(total)}`}
          </button>
        </form>
      </div>
    </div>
  );
}

