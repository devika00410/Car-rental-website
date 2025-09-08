import React, { useEffect, useRef } from "react";
import './DiscountAndOffers.css'
const DiscountsAndOffers = () => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  const discounts = [
    {
      id: 1,
      title: "Weekend Special",
      description: "15% off on luxury car rentals this weekend",
      discount: "15% OFF",
      code: "WEEKEND15",
      validUntil: "2025-12-31",
    },
    {
      id: 2,
      title: "First-Time User",
      description: "20% discount for first-time users",
      discount: "20% OFF",
      code: "FIRST20",
      validUntil: "2025-11-21",
    },
    {
      id: 3,
      title: "Long Term Rental",
      description: "Special rates for rentals longer than 7 days",
      discount: "25% OFF",
      code: "LONGTERM25",
      validUntil: "2025-10-1",
    },
    {
      id: 4,
      title: "Early Bird Offer",
      description: "Book 14+ days in advance and save",
      discount: "10% OFF",
      code: "EARLY10",
      validUntil: "2025-11-19",
    },
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

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        // You could use a toast notification here instead of alert
        alert(`Promo code ${code} copied to clipboard!`);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <section ref={sectionRef} className="discounts-section">
      <div className="discounts-container">
        <h2 className="discounts-title">Special Offers & Discounts</h2>
        
        <div className="discounts-grid">
          {discounts.map((offer, index) => (
            <div
              key={offer.id}
              ref={el => cardRefs.current[index] = el}
              className="discount-card"
            >
              <div className="discount-badge">
                {offer.discount}
              </div>

              <h3 className="discount-title">{offer.title}</h3>
              <p className="discount-description">{offer.description}</p>

              <div className="promo-code-section">
                <span className="promo-label">USE CODE:</span>
                <div className="code-container">
                  <strong className="promo-code">{offer.code}</strong>
                  <button
                    onClick={() => handleCopyCode(offer.code)}
                    className="copy-button"
                    aria-label={`Copy code ${offer.code}`}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <p className="valid-until">Valid until: {offer.validUntil}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiscountsAndOffers;