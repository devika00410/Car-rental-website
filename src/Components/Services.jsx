import React, { useEffect, useRef } from 'react';
import { 
  ShieldCheckIcon, 
  ClockIcon, 
  MapPinIcon, 
  StarIcon 
} from '@heroicons/react/24/outline';
import './Services.css';

function Services() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="services-section" ref={sectionRef} id="services">
      <div className="container">
        <div className="services-header">
          <h2>Why Choose Our Car Rental Service</h2>
          <p>Experience the difference with our premium offerings and exceptional service</p>
        </div>

        <div className="services-grid">
          <div className="service-card" ref={el => cardsRef.current[0] = el}>
            <div className="service-icon">
              <ShieldCheckIcon className="icon" />
            </div>
            <h3>Premium Insurance Included</h3>
            <p>Comprehensive coverage for complete peace of mind during your journey</p>
            <ul className="service-features">
              <li>Zero deductible</li>
              <li>24/7 roadside assistance</li>
              <li>Damage protection</li>
            </ul>
          </div>

          <div className="service-card" ref={el => cardsRef.current[1] = el}>
            <div className="service-icon">
              <ClockIcon className="icon" />
            </div>
            <h3>Flexible Rental Periods</h3>
            <p>Rent for hours, days, or weeks with customizable options</p>
            <ul className="service-features">
              <li>Hourly rentals available</li>
              <li>Long-term discounts</li>
              <li>Easy extension process</li>
            </ul>
          </div>

          <div className="service-card" ref={el => cardsRef.current[2] = el}>
            <div className="service-icon">
              <MapPinIcon className="icon" />
            </div>
            <h3>Statewide Coverage</h3>
            <p>Pick up and drop off anywhere across Kerala</p>
            <ul className="service-features">
              <li>All major cities covered</li>
              <li>Airport pickup/dropoff</li>
              <li>Multiple locations</li>
            </ul>
          </div>

         
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">98%</span>
            <span className="stat-label">Satisfaction Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support Available</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Locations</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;