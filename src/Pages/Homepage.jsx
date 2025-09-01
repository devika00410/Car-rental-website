// HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../Components/From';
import FeaturedCars from '../Components/FeaturedCars';
import DiscountsAndOffers from '../Components/DiscountAndOffers';

function HomePage() {
  const navigate = useNavigate();

  const handleBookNow = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn === 'true') {
      navigate('/booking'); // Go directly to booking
    } else {
      navigate('/login'); // Go to login first
    }
  };

  return (
    <div>
       <div className="home-page">
      <Form />
      <FeaturedCars />
      <DiscountsAndOffers />
    </div>
      <h1>Welcome to Our Website</h1>
      <button onClick={handleBookNow}>Book Now</button>
    </div>
  );
}

export default HomePage;