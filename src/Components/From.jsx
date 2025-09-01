import React, { useState } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import cityData from '../Data/CitiesData.json';
import { 
  MapPinIcon, 
  CheckBadgeIcon, 
  ArrowRightIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

function From() {
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [error, setError] = useState('');
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

    if (!dropoffLocation) {
      setError('Please select a destination');
      return;
    }
    
    setError('');
    
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

    // ✅ Send destination in query string instead of state
    navigate(`/results?destination=${encodeURIComponent(dropoffLocation.label)}&district=${encodeURIComponent(dropoffLocation.district)}`);
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
      <div className="w-full max-w-md mx-auto">
        
        {/* Simple Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Car Rental
          </h1>
          <p className="text-gray-600">
            Find the perfect car for your journey
          </p>
        </div>
        
        {/* Form container */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Destination Location (Only Input) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination Location *
              </label>
              <Select
                value={dropoffLocation}
                onChange={(selected) => {
                  setDropoffLocation(selected);
                  setError('');
                }}
                options={cityOptions}
                isSearchable={true}
                placeholder="Select your destination..."
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            {/* Trip Summary */}
            {dropoffLocation && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                  <DocumentDuplicateIcon className="h-5 w-5 text-blue-600 mr-2" />
                  Trip Summary
                </h3>
                
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start mb-2">
                      <div className="bg-blue-100 p-1.5 rounded-full mr-3 mt-0.5">
                        <MapPinIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">FROM</p>
                        <p className="text-gray-800 font-medium">Kochi</p>
                        <p className="text-xs text-gray-500">Ernakulam District</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-100 p-1.5 rounded-full mr-3 mt-0.5">
                        <CheckBadgeIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">TO</p>
                        <p className="text-gray-800 font-medium">
                          {dropoffLocation.label}
                        </p>
                        <p className="text-xs text-gray-500">{dropoffLocation.district} District</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center ml-4 bg-gray-100 rounded-lg p-2">
                    <ArrowRightIcon className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={!dropoffLocation}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Find Cars
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default From;
