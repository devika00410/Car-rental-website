import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import './MapSection.css';

const LocationMap = () => {
  return (
    <section className="map-section">
      <div className="container">
        <h2>Our Coverage Area</h2>
        <p>We serve all across Kerala with multiple pickup locations</p>
        
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4016734.772265317!2d73.87706796820338!3d10.53272428605675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0812ffd49cf55b%3A0x64bd90fbed387c99!2sKerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Kerala Coverage Map"
          ></iframe>
        </div>

        <div className="location-points">
          <div className="location-item">
            <MapPinIcon className="location-icon" />
            <span>Kochi - Main Office</span>
          </div>
          <div className="location-item">
            <MapPinIcon className="location-icon" />
            <span>Thiruvananthapuram</span>
          </div>
          <div className="location-item">
            <MapPinIcon className="location-icon" />
            <span>Kozhikode</span>
          </div>
          <div className="location-item">
            <MapPinIcon className="location-icon" />
            <span>Munnar</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;