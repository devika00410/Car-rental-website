import React, { useEffect, useRef } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import './Testimonials.css';

const Testimonials = () => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  const reviews = [
    {
      id: 1,
      name: "Rahul Sharma",
      location: "Kochi",
      rating: 5,
      comment: "Best car rental service in Kerala! The car was pristine and the process was seamless.",
      image: "https://images.unsplash.com/photo-1597204081767-4c14a6b7cbec?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2luZ2xlJTIwcGVyc29ufGVufDB8fDB8fHww"
    },
    {
      id: 2,
      name: "Priya Menon",
      location: "Thiruvananthapuram",
      rating: 5,
      comment: "24/7 customer support saved our trip when we had a flat tire. Highly recommended!",
      image: "https://www.shutterstock.com/image-photo/portrait-female-owner-gift-store-260nw-1688925892.jpg"
    },
    {
      id: 3,
      name: "Krishna M",
      location: "Kottayam",
      rating: 4,
      comment: "Perfect cars for family vacation. Will definitely use again when in Kerala.",
      image: "https://www.fujitsu.com/hk/Images/Srinita_1_tcm137-3656043.jpg"
    }
  ];

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

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="testimonials-section">
      <div className="container">
        <h2>What Our Customers Say</h2>
        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              ref={el => cardRefs.current[index] = el}
              className="review-card"
            >
              <div className="stars">
                {[...Array(review.rating)].map((_, i) => (
                  <StarIcon key={i} className="star-icon" />
                ))}
              </div>
              <p className="review-text">"{review.comment}"</p>
              <div className="reviewer">
                <img src={review.image} alt={review.name} className="reviewer-image" />
                <div>
                  <h4>{review.name}</h4>
                  <p>{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;