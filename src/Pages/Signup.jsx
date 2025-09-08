import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    agencyName: '',
    agencyAddress: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.role === 'agency') {
      if (!formData.agencyName.trim()) {
        newErrors.agencyName = 'Agency name is required';
      }
      if (!formData.agencyAddress.trim()) {
        newErrors.agencyAddress = 'Agency address is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Save user data to localStorage
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password, 
        role: formData.role,
        agencyName: formData.agencyName,
        agencyAddress: formData.agencyAddress,
        createdAt: new Date().toISOString()
      };

      // Get existing users or create empty array
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      const userExists = existingUsers.find(user => user.email === formData.email);
      if (userExists) {
        setErrors({ email: 'User with this email already exists' });
        setIsSubmitting(false);
        return;
      }

      // Add new user to array
      existingUsers.push(userData);
      
      // Save back to localStorage
      localStorage.setItem('users', JSON.stringify(existingUsers));
    
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      console.log('User registered:', userData);
      alert('Signup successful! You can now login.');
      
      // Redirect to login page
      navigate('/login');
      
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Create Your Account</h2>
        <p>Join us today and get started</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              placeholder="Enter your username"
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="agency">Agency</option>
            </select>
          </div>

          {formData.role === 'agency' && (
            <>
              <div className="form-group">
                <label htmlFor="agencyName">Agency Name</label>
                <input
                  type="text"
                  id="agencyName"
                  name="agencyName"
                  value={formData.agencyName}
                  onChange={handleChange}
                  className={errors.agencyName ? 'error' : ''}
                  placeholder="Enter your agency name"
                />
                {errors.agencyName && <span className="error-text">{errors.agencyName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="agencyAddress">Agency Address</label>
                <textarea
                  id="agencyAddress"
                  name="agencyAddress"
                  value={formData.agencyAddress}
                  onChange={handleChange}
                  className={errors.agencyAddress ? 'error' : ''}
                  placeholder="Enter your agency address"
                  rows="3"
                />
                {errors.agencyAddress && <span className="error-text">{errors.agencyAddress}</span>}
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="signup-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;