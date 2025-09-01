import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowRightIcon, 
  UserIcon, 
  CalendarIcon, 
  ShieldCheckIcon,
  BookOpenIcon 
} from "@heroicons/react/24/outline";

// Helper to shuffle an array randomly 
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
}

// Helper to normalize car types
const normalizeCarType = (type) => {
  if (!type) return null;
  const lowerType = type.toLowerCase();
  if (lowerType.includes("eco")) return "economy";
  if (lowerType.includes("lux")) return "luxury";
  if (lowerType.includes("sedan") || lowerType.includes("saloon")) return "sedan";
  if (lowerType.includes("hatch")) return "economy";
  return ["economy", "sedan", "luxury"].includes(lowerType) ? lowerType : null;
};

// Extract car array from API response
const extractCarsFromResponse = (data) => {
  if (Array.isArray(data)) return data;

  // Check common property names that might contain the car array
  const possibleArrayKeys = ["rentalCars", "cars", "data", "items", "results"];
  for (const key of possibleArrayKeys) {
    if (data[key] && Array.isArray(data[key])) {
      return data[key];
    }
  }

  // If not found in common keys, look for any array in the object
  for (const key in data) {
    if (Array.isArray(data[key])) {
      return data[key];
    }
  }
  return null;
}

// Normalize car data structure
const normalizeCarData = (rawCar, index) => {
  const getValue = (obj, keys) => {
    for (const key of keys) {
      if (obj[key] !== undefined) return obj[key];
    }
    return null;
  };
  
  const id = getValue(rawCar, ['id', 'carId', 'ID']) || `car-${index}`;
  const make = getValue(rawCar, ['make', 'brand', 'manufacturer']);
  const model = getValue(rawCar, ['model', 'name', 'carName']);
  const name = make && model ? `${make} ${model}` : model || make || 'Unknown Car';
  const rawType = getValue(rawCar, ['type', 'carType', 'category']);
  const type = normalizeCarType(rawType);
  const image = getValue(rawCar, ['image', 'imageURL', 'imageUrl', 'img']);
  const price = getValue(rawCar, ['pricePerDay', 'price_per_day', 'price']);
  const location = getValue(rawCar, ['location', 'city', 'district']);
  const seats = getValue(rawCar, ['seats', 'seatCount', 'capacity', 'passengers']);

  return {
    id, 
    name, 
    type,
    image: image || "https://via.placeholder.com/400x250?text=Car+Image",
    price: price ? price : "Price not available",
    location: location || "Location not specified",
    seats: seats || "4",
    rawData: rawCar
  }
}

// Seat icon component
const SeatIcon = () => <UserIcon className="h-4 w-4 inline-block mr-1 text-gray-500" />;

// Main component
const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Get destination from URL parameters 
  const query = new URLSearchParams(location.search);
  const destFromURL = query.get("destination") || query.get("district") || "";
  const destFromState = location.state?.destination || location.state?.dropoff || "";
  const destination = destFromState?.label || destFromState?.city ||
    destFromState?.district || destFromURL || "Selected Location";

  const handlePreBookClick = () => {
    navigate("/pre-booking", { state: { destination, cars: filteredCars } });
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("https://raw.githubusercontent.com/devika00410/Car-rental-API/main/data.json");
        const carsData = extractCarsFromResponse(response.data);
        
        if (!carsData) {
          setError("Could not find car data in the API response");
          return;
        }
        
        const normalizedCars = carsData.map(normalizeCarData);
        setCars(normalizedCars);
        
        // Filtering cars into 3 economy, 3 sedan and 2 luxury
        const economyCars = normalizedCars.filter(car => car.type === "economy");
        const sedanCars = normalizedCars.filter(car => car.type === "sedan");
        const luxuryCars = normalizedCars.filter(car => car.type === "luxury");
        const otherCars = normalizedCars.filter(car => !car.type ||
          !["economy", "sedan", "luxury"].includes(car.type));

        const selectedCars = [
          ...shuffleArray(economyCars).slice(0, 3),
          ...shuffleArray(sedanCars).slice(0, 3),
          ...shuffleArray(luxuryCars).slice(0, 2),
          ...shuffleArray(otherCars).slice(0, 8 - (economyCars.length + sedanCars.length + luxuryCars.length))
        ].slice(0, 8);
        
        setFilteredCars(selectedCars);
      } catch (err) {
        console.log("Error fetching cars:", err);
        setError("Failed to load cars. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCars();
  }, []);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Loading available cars...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500 text-xl">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Cars available in {destination}</h1>

        {/* Prebooking information section */}
        <div className="bg-yellow-50 rounded-lg p-6 mb-8 border border-blue-200">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold text-yellow-800 flex items-center">
                <BookOpenIcon className="h-6 w-6 mr-2" />
                Pre-Booking Available
              </h2>
              <p className="text-yellow-600 mt-2">
                Secure your car in advance with our easy pre-booking system.
                Reserve now and pay later with flexible cancellation options.
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center text-sm text-yellow-700">
                  <CalendarIcon className="h-5 w-5 mr-1" />
                  <span>Reserve up to 30 days in advance</span>
                </div>
                <div className="flex items-center text-sm text-yellow-700">
                  <ShieldCheckIcon className="h-5 w-5 mr-1" />
                  <span>Free cancellation up to 24 hours</span>
                </div>
              </div>
            </div>
            <button
              onClick={handlePreBookClick}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-6 rounded-lg flex items-center transition-colors whitespace-nowrap">
              Pre-Book Now
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>

        {filteredCars.length === 0 ? (
          <p className="text-center text-gray-600 text-xl">
            No cars available at this location.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Car Card Component
const CarCard = ({ car }) => {
  const navigate = useNavigate();
  
  const handleBookNow = () => navigate("/booking", { state: { car } });

  const badgeClass = {
    economy: "bg-green-100 text-green-800",
    sedan: "bg-blue-100 text-blue-800", 
    luxury: "bg-yellow-100 text-yellow-800"
  }[car.type] || "bg-gray-100 text-gray-800";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
        {car.type || "Other"}
      </div>
      
      <div className="h-48 overflow-hidden">
        <img 
          src={car.image} 
          alt={car.name}
          className="w-full h-full object-cover"
          onError={(e) => e.target.src = "https://via.placeholder.com/400x250?text=Car+Image"}
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{car.name}</h3>
        
        <div className="flex justify-between items-center mb-3">
          <p className="text-gray-800 font-bold text-lg">
            {car.price !== "Price not available" ? `₹${car.price} / day` : car.price}
          </p>
          <p className="text-sm text-gray-500 flex items-center">
            <SeatIcon />
            <span>{car.seats} {car.seats === "1" ? "seat" : "seats"}</span>
          </p>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">{car.location}</p>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleBookNow}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <BookOpenIcon className="h-5 w-5 mr-1" />
            Book Now
          </button>
          <button className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-100 transition-colors">
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;