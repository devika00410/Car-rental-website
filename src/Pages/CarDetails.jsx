// CarDetails.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaHeart, FaMapMarkerAlt, FaShieldAlt, FaStar, FaCarSide, FaGasPump, FaCog } from 'react-icons/fa';
import carsData from '../Data/CarsData.json';

const CarDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Normalize car data function
  const normalizeCarData = (foundCar) => {
    return {
      id: foundCar.id || 1,
      name: foundCar.name || `${foundCar.make || 'Car'} ${foundCar.model || 'Model'}`,
      images: foundCar.images || (foundCar.image ? [foundCar.image] : ['https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80']),
      model: foundCar.model || 'Model',
      make: foundCar.make || 'Make',
      year: foundCar.year || 2023,
      color: foundCar.color || foundCar.exteriorColor || 'Black',
      number_of_doors: foundCar.number_of_doors || foundCar.doors || 4,
      number_of_seats: foundCar.number_of_seats || foundCar.seats || 5,
      fuel_type: foundCar.fuel_type || foundCar.fuelType || 'Petrol',
      transmission: foundCar.transmission || 'Automatic',
      rental_rate: foundCar.rental_rate || foundCar.pricePerDay || foundCar.price || 2500,
      availability: foundCar.availability !== undefined ? foundCar.availability : (foundCar.available !== undefined ? foundCar.available : true),
      description: foundCar.description || `This car is a stylish and reliable vehicle perfect for your travel needs. With its comfortable interior and excellent fuel efficiency, you'll enjoy every mile of your journey.`,
      features: foundCar.features || ['Air Conditioning', 'Bluetooth', 'Navigation System', 'Backup Camera', 'Keyless Entry'],
      feedbacks: foundCar.feedbacks || (foundCar.reviews ? foundCar.reviews.map(review => ({
        user: review.user || review.name || 'Anonymous',
        rating: review.rating || 5,
        comment: review.comment || 'Great car!',
        aiResponse: generateAIResponse(review.comment || '', review.rating || 5)
      })) : [
        { 
          user: 'Rahul Sharma', 
          rating: 4, 
          comment: 'Great car! Very comfortable and efficient.',
          aiResponse: 'Thank you for your feedback, Rahul! We\'re glad you enjoyed your ride with our car. We strive to maintain our vehicles in top condition for all our customers.'
        }
      ]),
      location: foundCar.location || 'Kochi, Kerala',
      rating: foundCar.rating || 4.5,
      total_trips: foundCar.total_trips || foundCar.totalRentals || 24,
      insurance: foundCar.insurance || 'Comprehensive coverage included',
      mileage: foundCar.mileage || 'Unlimited',
      additional_fees: foundCar.additional_fees || [{ type: 'Cleaning fee', amount: 300 }, { type: 'Service fee', amount: 150 }],
      owner: foundCar.owner || { 
        name: foundCar.ownerName || 'Rajesh Kumar', 
        joined: foundCar.ownerJoined || '2022-03-15', 
        response_rate: foundCar.responseRate || 95 
      },
      specifications: foundCar.specifications || {
        engine: foundCar.engine || '2.0L 4-cylinder',
        horsepower: foundCar.horsepower || 158,
        torque: foundCar.torque || 138,
        drive_type: foundCar.drive_type || foundCar.driveType || 'Front-Wheel Drive',
        fuel_economy: foundCar.fuel_economy || foundCar.fuelEconomy || '15 kmpl city / 18 kmpl highway'
      }
    };
  };

  // Generate AI response based on review
  const generateAIResponse = (review, rating) => {
    const positiveResponses = [
      "Thank you for your positive feedback! We're thrilled you enjoyed your experience with our car.",
      "We appreciate your kind words! Our team works hard to maintain our vehicles to the highest standards.",
      "Thank you for the excellent rating! We're glad we could provide you with a great rental experience.",
      "We're delighted to hear you had a wonderful time with our vehicle. We hope to serve you again soon!"
    ];
    
    const neutralResponses = [
      "Thank you for your feedback. We're always working to improve our services.",
      "We appreciate you taking the time to share your experience. We'll use your feedback to make improvements.",
      "Thank you for your review. We're constantly striving to enhance our customer experience."
    ];
    
    const negativeResponses = [
      "We're sorry to hear about your experience. We take all feedback seriously and will address your concerns.",
      "Thank you for bringing this to our attention. We'll use your feedback to improve our services.",
      "We apologize for any inconvenience you experienced. We're committed to providing better service in the future."
    ];
    
    if (rating >= 4) {
      return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
    } else if (rating === 3) {
      return neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
    } else {
      return negativeResponses[Math.floor(Math.random() * negativeResponses.length)];
    }
  };

  // Get car data from local JSON or state
  useEffect(() => {
    const fetchCarData = () => {
      try {
        setLoading(true);
        setError(null);
        
        // First, check if car was passed via state
        if (location.state && location.state.car) {
          const normalizedCar = normalizeCarData(location.state.car);
          setCar(normalizedCar);
          setLoading(false);
          return;
        }

        // If no state, try to get car by ID from URL parameters
        const carId = id || '1';
        
        // Find the specific car by ID
        const foundCar = carsData.rentalCars.find(car => {
          const carIdStr = carId.toString();
          const foundIdStr = car.id ? car.id.toString() : '';
          return foundIdStr === carIdStr;
        });
        
        if (!foundCar) {
          throw new Error(`Car with ID ${carId} not found in data`);
        }
        
        // Normalize the data structure
        const normalizedCar = normalizeCarData(foundCar);
        setCar(normalizedCar);
      } catch (err) {
        console.error("Error loading car details:", err);
        setError(err.message);
        // Fallback data
        const fallbackCar = normalizeCarData({});
        setCar(fallbackCar);
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [id, location.state]);

  // Handle reservation
  const handleReservation = () => {
    navigate('/booking', { state: { car } });
  };

  // Handle review submission
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!userReview.trim()) return;
    
    const newReview = {
      user: 'You',
      rating: userRating,
      comment: userReview,
      aiResponse: generateAIResponse(userReview, userRating)
    };
    
    setCar(prevCar => ({
      ...prevCar,
      feedbacks: [newReview, ...prevCar.feedbacks]
    }));
    
    setUserReview('');
    setUserRating(5);
    setShowReviewForm(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading car details...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">Error: {error}</div>;
  if (!car) return <div className="min-h-screen flex items-center justify-center text-xl">Car not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" />
          Back to results
        </button>
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className="flex items-center text-gray-600 hover:text-red-500"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaHeart />
          )}
          <span className="ml-1">{isFavorite ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Images and Details */}
          <div className="w-full lg:w-2/3">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="h-96 overflow-hidden relative">
                <img 
                  src={car.images[activeImage]} 
                  alt={car.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80';
                  }}
                />
              </div>
              
              {/* Image thumbnails */}
              {car.images.length > 1 && (
                <div className="p-4 flex overflow-x-auto space-x-2">
                  {car.images.map((img, index) => (
                    <button 
                      key={index} 
                      onClick={() => setActiveImage(index)}
                      className={`flex-shrink-0 w-24 h-16 rounded-md overflow-hidden ${activeImage === index ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <img 
                        src={img} 
                        alt={`${car.name} view ${index + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x60?text=Car';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Car Information */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
              <h1 className="text-3xl font-bold mb-2">{car.name}</h1>
              <p className="text-gray-600 mb-4">{car.year} • {car.color}</p>
              
              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold text-blue-700">₹{car.rental_rate}/day</span>
                <span className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${car.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {car.availability ? 'Available' : 'Not Available'}
                </span>
              </div>

              <p className="text-gray-700 mb-6">{car.description}</p>

              {/* Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <FaUser className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-center font-medium">{car.number_of_seats} Seats</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <FaCarSide className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-center font-medium">{car.number_of_doors} Doors</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <FaGasPump className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-center font-medium">{car.fuel_type}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <FaCog className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-center font-medium">{car.transmission}</p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
                
                {/* Add Review Button */}
                <button 
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {showReviewForm ? 'Cancel Review' : 'Add Your Review'}
                </button>
                
                {/* Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-3">Write a Review</h3>
                    
                    <div className="mb-4">
                      <label className="block mb-2">Your Rating</label>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setUserRating(star)}
                            className="text-2xl mr-1 focus:outline-none"
                          >
                            {star <= userRating ? (
                              <FaStar className="text-yellow-500" />
                            ) : (
                              <FaStar className="text-gray-300" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block mb-2">Your Review</label>
                      <textarea
                        value={userReview}
                        onChange={(e) => setUserReview(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        rows="4"
                        placeholder="Share your experience with this car..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Submit Review
                    </button>
                  </form>
                )}
                
                {/* Reviews List */}
                {car.feedbacks.length > 0 ? (
                  <div className="space-y-4">
                    {car.feedbacks.map((feedback, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FaStar 
                                key={i} 
                                className={`h-5 w-5 ${i < feedback.rating ? 'text-yellow-500' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="ml-2 font-medium">{feedback.rating}/5</span>
                        </div>
                        <p className="text-gray-700 mb-2">{feedback.comment}</p>
                        <p className="text-sm text-gray-500">- {feedback.user}</p>
                        
                        {/* AI Response */}
                        {feedback.aiResponse && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                            <p className="text-sm text-blue-800">
                              <span className="font-semibold">Owner Response: </span>
                              {feedback.aiResponse}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No reviews yet. Be the first to review this car!</p>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Pickup Location</h2>
                <div className="flex items-start mb-4">
                  <FaMapMarkerAlt className="h-6 w-6 text-blue-500 mr-2 mt-1" />
                  <div>
                    <p className="font-medium">{car.location}</p>
                    <p className="text-gray-600">Approximately 5 km from city center</p>
                  </div>
                </div>
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map would be displayed here</p>
                </div>
              </div>

              {/* Owner Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">About the Owner</h2>
                <div className="flex items-start">
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                    <FaUser className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{car.owner.name}</h3>
                    <p className="text-gray-600 mb-2">Joined {new Date(car.owner.joined).toLocaleDateString()}</p>
                    <div className="flex items-center mb-3">
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`h-5 w-5 ${i < 5 ? 'text-yellow-500' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-gray-700">24 reviews</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaShieldAlt className="h-5 w-5 mr-1 text-green-500" />
                      <span>Response rate: {car.owner.response_rate}%</span>
                    </div>
                  </div>
                </div>
                <button className="mt-6 w-full py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium">
                  Contact Owner
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-2xl font-bold text-blue-700">₹{car.rental_rate}</span>
                    <span className="text-gray-600">/day</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${car.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {car.availability ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <button 
                  onClick={handleReservation}
                  className={`w-full py-3 px-6 rounded-lg font-medium mb-4 ${car.availability ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  disabled={!car.availability}
                >
                  {car.availability ? 'Reserve Now' : 'Not Available'}
                </button>

                <p className="text-center text-gray-500 text-sm">You won't be charged yet</p>

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h3 className="font-medium mb-2">Price details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>₹{car.rental_rate} x 3 days</span>
                      <span>₹{(car.rental_rate * 3).toFixed(0)}</span>
                    </div>
                    {car.additional_fees.map((fee, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{fee.type}</span>
                        <span>₹{fee.amount}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-medium pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span>₹{(car.rental_rate * 3 + car.additional_fees.reduce((sum, fee) => sum + fee.amount, 0)).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Information */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6 p-6">
              <h3 className="font-bold mb-4 flex items-center">
                <FaShieldAlt className="h-5 w-5 text-green-500 mr-2" />
                Safety on NextGo
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-600 text-xs mr-2 mt-1">✓</span>
                  <span>Comprehensive insurance included</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 text-xs mr-2 mt-1">✓</span>
                  <span>24/7 roadside assistance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 text-xs mr-2 mt-1">✓</span>
                  <span>Verified owners and renters</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;