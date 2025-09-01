// src/pages/CarList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, UserIcon, StarIcon } from "@heroicons/react/24/outline";

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
        color: "all",
        minPrice: 0,
        maxPrice: 10000,
        type: "all",
        rating: 0,
        seats: "all"
    });

    // Fetch cars from API
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axios.get("https://raw.githubusercontent.com/devika00410/Car-rental-API/main/data.json");
                let carsData = response.data;

                // Extract cars array from response
                if (carsData && !Array.isArray(carsData)) {
                    const arrayKeys = ["cars", "rentalCars", "data", "items"];
                    for (const key of arrayKeys) {
                        if (Array.isArray(carsData[key])) {
                            carsData = carsData[key];
                            break;
                        }
                    }
                }

                if (!Array.isArray(carsData)) throw new Error("Invalid API response");

                // Normalize car data
                const normalizedCars = carsData.map((car, index) => ({
                    id: car.id || car.carId || `car-${index}`,
                    name: car.name || car.model || car.carName || "Unknown Car",
                    type: car.type || car.category || "other",
                    image: car.image || car.imageURL || "https://via.placeholder.com/400x250?text=Car+Image",
                    price: car.price || car.pricePerDay || 0,
                    color: car.color || "Unknown",
                    rating: car.rating || car.stars || 0,
                    seats: car.seats || car.capacity || 4,
                    location: car.location || car.city || "Location not specified",
                    make: car.make || car.brand || "Unknown",
                    model: car.model || "Unknown"
                }));

                setCars(normalizedCars);
                setFilteredCars(normalizedCars);
            } catch (err) {
                setError("Failed to load cars. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    // Apply filters
    useEffect(() => {
        const filtered = cars.filter(car => {
            const searchMatch = filters.search === "" ||
                [car.name, car.make, car.model].some(field =>
                    field.toLowerCase().includes(filters.search.toLowerCase())
                );

            const colorMatch = filters.color === "all" || car.color.toLowerCase() === filters.color.toLowerCase();
            const priceMatch = car.price >= filters.minPrice && car.price <= filters.maxPrice;
            const typeMatch = filters.type === "all" || car.type.toLowerCase() === filters.type.toLowerCase();
            const ratingMatch = car.rating >= filters.rating;
            const seatsMatch = filters.seats === "all" || car.seats.toString() === filters.seats;

            return searchMatch && colorMatch && priceMatch && typeMatch && ratingMatch && seatsMatch;
        });

        setFilteredCars(filtered);
    }, [filters, cars]);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
            search: "",
            color: "all",
            minPrice: 0,
            maxPrice: 10000,
            type: "all",
            rating: 0,
            seats: "all"
        });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading cars...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">{error}</div>;

    // Extract unique values for filter options
    const colors = [...new Set(cars.map(car => car.color).filter(Boolean))];
    const seatOptions = [...new Set(cars.map(car => car.seats.toString()).filter(Boolean))];

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Available Cars</h1>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, make, or model..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange("search", e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md">
                            <FunnelIcon className="h-5 w-5 mr-2" /> Filters
                        </button>

                        <button onClick={resetFilters} className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md">
                            <XMarkIcon className="h-5 w-5 mr-2" /> Reset
                        </button>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                <select
                                    value={filters.color}
                                    onChange={(e) => handleFilterChange("color", e.target.value)}
                                    className="block w-full p-2 border border-gray-300 rounded-md">
                                    <option value="all">All Colors</option>
                                    <option value="black">Black</option>
                                    <option value="white">White</option>
                                    <option value="silver">Silver</option>
                                    <option value="gray">Gray</option>
                                    <option value="red">Red</option>
                                    <option value="blue">Blue</option>
                                    {colors.map(color => <option key={color} value={color}>{color}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price Range: ₹{filters.minPrice} - ₹{filters.maxPrice}
                                </label>
                                <div className="space-y-2">
                                    <input type="range" min="0" max="10000" step="100" value={filters.minPrice}
                                        onChange={(e) => handleFilterChange("minPrice", parseInt(e.target.value))} className="w-full" />
                                    <input type="range" min="0" max="10000" step="100" value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange("maxPrice", parseInt(e.target.value))} className="w-full" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Car Type</label>
                                <select
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange("type", e.target.value)}
                                    className="block w-full p-2 border border-gray-300 rounded-md">
                                    <option value="all">All Types</option>
                                    <option value="economy">Economy</option>
                                    <option value="luxury">Luxury</option>
                                    <option value="suv">SUV</option>
                                    <option value="sedan">Sedan</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating: {filters.rating} ★</label>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button key={star} onClick={() => handleFilterChange("rating", star)} className="p-1">
                                            <StarIcon className={`h-6 w-6 ${filters.rating >= star ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                                <select
                                    value={filters.seats}
                                    onChange={(e) => handleFilterChange("seats", e.target.value)}
                                    className="block w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="all">All Seats</option>
                                    {seatOptions.map(seat => <option key={seat} value={seat}>{seat} {seat === "1" ? "seat" : "seats"}</option>)}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mb-4 text-gray-600">Showing {filteredCars.length} of {cars.length} cars</div>

                {filteredCars.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 text-lg">No cars match your filters.</div>
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
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden">
                <img src={car.image} alt={car.name} className="w-full h-full object-cover" onError={(e) => e.target.src = "https://via.placeholder.com/400x250?text=Car+Image"} />
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{car.name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{car.type}</span>
                </div>

                <div className="flex justify-between items-center mb-3">
                    <p className="text-gray-800 font-bold text-lg">₹{car.price} / day</p>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                            <StarIcon key={star} className={`h-4 w-4 ${star <= car.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-1" />
                        <span>{car.seats} {car.seats === 1 ? "seat" : "seats"}</span>
                    </div>
                    <span>{car.color}</span>
                </div>

                <p className="text-sm text-gray-500 mb-4">{car.location}</p>

                <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Book Now</button>
                    <button className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-100">Details</button>
                </div>
            </div>
        </div>
    );
};

export default CarList;