import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function BookingPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    license: ''
  });
  
  const [carDetails, setCarDetails] = useState({
    name: 'Toyota Innova',
    type: 'SUV',
    price: 2500
  });
  
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});

  // Load user data from localStorage if available
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
    
    // In a real app, you would get car details from location state or context
    const savedCarDetails = localStorage.getItem('selectedCar');
    if (savedCarDetails) {
      setCarDetails(JSON.parse(savedCarDetails));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!userData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    if (!userData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Phone validation (Indian phone numbers)
    if (!userData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(userData.phone)) {
      newErrors.phone = 'Please enter a valid Indian phone number';
    }
    
    // License validation
    if (!userData.license.trim()) {
      newErrors.license = 'License number is required';
    }
    
    // Terms validation
    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Save user data to localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Navigate to payment page
      navigate('/payment');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold">Complete Your Booking</h1>
          <p className="text-blue-100">Please fill in your details to confirm your booking</p>
        </div>
        
        <div className="p-6">
          {/* Car Details Summary */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Car Details</h2>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-600">Car Model</p>
                <p className="font-medium">{carDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Car Type</p>
                <p className="font-medium">{carDetails.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="font-medium text-green-600">₹{carDetails.price}/day</p>
              </div>
            </div>
          </div>
          
          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your 10-digit phone number"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Driving License Number</label>
              <input
                type="text"
                name="license"
                value={userData.license}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.license ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your driving license number"
              />
              {errors.license && <p className="text-red-500 text-xs mt-1">{errors.license}</p>}
            </div>
            
            {/* Terms and Conditions */}
            <div className="flex items-start mt-6">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={() => setAgreeToTerms(!agreeToTerms)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I agree to the <span className="text-blue-600 cursor-pointer">Terms and Conditions</span>
                </label>
                <p className="text-gray-500">By checking this box, you agree to our rental terms and conditions.</p>
                {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
              </div>
            </div>
            
            {/* Price Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mt-6">
              <h3 className="font-semibold text-gray-800 mb-2">Price Summary</h3>
              <div className="flex justify-between mb-1">
                <span>Daily Rate</span>
                <span>₹{carDetails.price}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Number of Days</span>
                <span>3 days</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Insurance</span>
                <span>₹500</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Taxes & Fees</span>
                <span>₹300</span>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold">
                <span>Total Amount</span>
                <span className="text-green-600">₹{carDetails.price * 3 + 800}</span>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors mt-6"
            >
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;