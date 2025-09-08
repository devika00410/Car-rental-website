// src/pages/About.jsx
import React from "react";
import { FaCarSide, FaSmile, FaClock, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative bg-gradient-to-r from-violet-700 to-violet-900 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              About <span className="text-violet-300">Nexago</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Welcome to Nexago – Ernakulam's premier car rental service offering 
              reliable, affordable, and convenient transportation solutions.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 -mt-10 relative z-20">
        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-16">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Who We Are
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Based in the heart of <strong>Ernakulam</strong>, Nexago was founded
                with one mission – to redefine the way people experience car rentals.
                We provide a wide range of vehicles, from economy to luxury, ensuring
                every customer finds the perfect car for their journey.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center">
                  <FaCheckCircle className="text-violet-600 mr-3" />
                  <span className="text-gray-700">Easy booking process</span>
                </div>
                <div className="flex items-center">
                  <FaCheckCircle className="text-violet-600 mr-3" />
                  <span className="text-gray-700">Transparent pricing with no hidden fees</span>
                </div>
                <div className="flex items-center">
                  <FaCheckCircle className="text-violet-600 mr-3" />
                  <span className="text-gray-700">24/7 customer support</span>
                </div>
                <div className="flex items-center">
                  <FaCheckCircle className="text-violet-600 mr-3" />
                  <span className="text-gray-700">Well-maintained, modern fleet</span>
                </div>
              </div>
              
              <button className="px-6 py-3 bg-violet-600 text-white rounded-lg shadow hover:bg-violet-700 transition">
                Explore Our Fleet
              </button>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Luxury car from Nexago fleet" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Nexago</h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-12">
            We're committed to providing exceptional service that makes every journey memorable
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 group">
              <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-violet-200 transition">
                <FaCarSide className="text-violet-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Wide Fleet Selection</h3>
              <p className="text-gray-600">
                From compact hatchbacks to premium sedans & SUVs – we've got the perfect vehicle for every need.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 group">
              <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-violet-200 transition">
                <FaSmile className="text-violet-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Customer First Approach</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We go the extra mile to ensure a seamless rental experience.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 group">
              <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-violet-200 transition">
                <FaClock className="text-violet-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock assistance for any queries or emergencies during your rental period.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 group">
              <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-violet-200 transition">
                <FaMapMarkerAlt className="text-violet-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Local Expertise</h3>
              <p className="text-gray-600">
                Deep knowledge of Ernakulam and surrounding areas to help you navigate like a local.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-violet-700 text-white rounded-2xl p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-violet-200">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-violet-200">Vehicles</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-violet-200">Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-violet-200">Verified Cars</div>
            </div>
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex text-yellow-400 mb-4">
                {"★".repeat(5)}
              </div>
              <p className="text-gray-600 italic mb-4">
                "Nexago made my business trip so much easier. The car was clean, reliable, and the pickup process was seamless."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold">Rajesh Kumar</div>
                  <div className="text-sm text-gray-500">Business Traveler</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex text-yellow-400 mb-4">
                {"★".repeat(5)}
              </div>
              <p className="text-gray-600 italic mb-4">
                "We rented a car for our family vacation and couldn't be happier. Great service and very reasonable prices!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold">Priya Nair</div>
                  <div className="text-sm text-gray-500">Family Vacation</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex text-yellow-400 mb-4">
                {"★".repeat(5)}
              </div>
              <p className="text-gray-600 italic mb-4">
                "As a frequent traveler, I've used many rental services. Nexago stands out for their professionalism and quality vehicles."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold">Anand Menon</div>
                  <div className="text-sm text-gray-500">Frequent Renter</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-violet-600 to-violet-800 rounded-2xl p-10 text-center text-white mb-16">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Explore Ernakulam?
          </h2>
          <p className="text-violet-100 max-w-2xl mx-auto mb-8">
            Book your ride today and enjoy hassle-free rentals, flexible options, and trusted service across Ernakulam and beyond.
          </p>
          <button className="px-8 py-4 bg-white text-violet-700 font-semibold rounded-lg shadow hover:bg-gray-100 transition">
            Book Your Car Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;