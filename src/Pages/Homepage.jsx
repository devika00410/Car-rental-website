// HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../Components/From';
import DiscountsAndOffers from '../Components/DiscountAndOffers';
import Services from '../Components/Services';
import Testimonials from '../Components/Testimonials';
import LocationMap from '../Components/LocationMap';

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
      <Services/>
      <DiscountsAndOffers />
      <Testimonials/>
      <LocationMap/>
    </div>
    </div>
  );
}

export default HomePage;