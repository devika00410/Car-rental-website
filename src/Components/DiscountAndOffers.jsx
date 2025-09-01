import React from 'react';

const DiscountsAndOffers = () => {
    const discounts = [
        {
            id: 1,
            title: "Weekend Special",
            description: "Get 15% off on all luxury car rentals this weekend",
            discount: "15% OFF",
            code: "WEEKEND15",
            validUntil: "2023-12-31"
        },
        {
            id: 2,
            title: "First-Time User",
            description: "20% discount for first-time users on any car category",
            discount: "20% OFF",
            code: "FIRST20",
            validUntil: "2023-12-31"
        },
        {
            id: 3,
            title: "Long Term Rental",
            description: "Special rates for rentals longer than 7 days",
            discount: "25% OFF",
            code: "LONGTERM25",
            validUntil: "2023-12-31"
        },
        {
            id: 4,
            title: "Early Bird Offer",
            description: "Book at least 14 days in advance and save",
            discount: "10% OFF",
            code: "EARLY10",
            validUntil: "2023-12-31"
        }
    ];

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code)
            .then(() => {
                alert(`Promo code ${code} copied to clipboard!`);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    return (
        <div className="discounts-container">
            <h2>Special Offers & Discounts</h2>
            <div className="discounts-grid">
                {discounts.map(offer => (
                    <div key={offer.id} className="discount-card">
                        <div className="discount-badge">{offer.discount}</div>
                        
                        <h3>{offer.title}</h3>
                        
                        <p>{offer.description}</p>
                        
                        <div className="promo-code">
                            <div>USE PROMO CODE:</div>
                            <strong>{offer.code}</strong>
                            <button onClick={() => handleCopyCode(offer.code)}className="copy-btn">
                                Copy
                            </button>
                        </div>
                        
                        <div className="valid-until">
                            Valid until: {offer.validUntil}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiscountsAndOffers;