import React, { useState } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import cityData from '../Data/CitiesData.json';
import { 
  MapPinIcon, 
  CheckIcon,
  PhoneIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import './From.css';

function From() {
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const navigate = useNavigate();

  // Fixed pickup location - Kochi, Ernakulam
  const fixedPickupLocation = {
    value: 'kochi-ernakulam',
    label: 'Kochi',
    district: 'Ernakulam'
  };

  // Prepare city options (include ALL cities in Kerala)
  const cityOptions = cityData.kerala_cities.map(city => ({
    value: `${city.city.toLowerCase()}-${city.district.toLowerCase()}`,
    label: city.city,
    district: city.district
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dropoffLocation) return;
    
    const bookingData = {
      pickup: {
        city: fixedPickupLocation.label,
        district: fixedPickupLocation.district,
      },
      dropoff: {
        city: dropoffLocation.label,
        district: dropoffLocation.district,
      }
    };
    
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    navigate(`/results?destination=${encodeURIComponent(dropoffLocation.label)}&district=${encodeURIComponent(dropoffLocation.district)}`);
  };

  return (
    <div className="from-container">
      <div className="from-content">
        <div className="from-text-section">
          <h1>Find Your Perfect Car in <span className="highlight">Kerala</span></h1>
          <p className="from-description">
            Experience premium car rental service with our extensive fleet of vehicles. 
            Travel in comfort and style to any destination across God's Own Country.
          </p>
          
          <div className="from-features">
            <div className="from-feature-item">
              <CheckIcon className="from-feature-icon" />
              <span>200+ Well Maintained Cars</span>
            </div>
            <div className="from-feature-item">
              <PhoneIcon className="from-feature-icon" />
              <span>24/7 Customer Support</span>
            </div>
            <div className="from-feature-item">
              <AdjustmentsHorizontalIcon className="from-feature-icon" />
              <span>Flexible Rental Options</span>
            </div>
          </div>
        </div>

        <div className="from-form-section">
          <div className="from-form-card">
            <h2>Plan Your Journey</h2>
            <p className="from-form-intro">Where would you like to go?</p>
            
            <form onSubmit={handleSubmit} className="from-form">
              <div className="from-form-group">
                <label className="from-form-label">Pick-up Location</label>
                <div className="from-location-display">
                  <MapPinIcon className="from-location-icon" />
                  <div>
                    <div className="from-location-city">Kochi</div>
                    <div className="from-location-detail">Ernakulam District</div>
                  </div>
                </div>
              </div>
              
              <div className="from-form-group">
                <label className="from-form-label">Destination Location *</label>
                <Select
                  value={dropoffLocation}
                  onChange={(selected) => setDropoffLocation(selected)}
                  options={cityOptions}
                  placeholder="Select your destination..."
                  className="from-destination-select"
                  classNamePrefix="from-select"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={!dropoffLocation}
                className="from-cta-button"
              >
                Find Available Cars
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default From;