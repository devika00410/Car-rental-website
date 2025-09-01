import React from 'react';

const FeaturedCars = () => {
    // Static array of 5 cars
    const cars = [
        {
            id: 1,
            make: "Toyota",
            model: "Camry",
            year: 2022,
            price: 2499,
            image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=400"
        },
        {
            id: 2,
            make: "Honda",
            model: "Civic",
            year: 2023,
            price: 2350,
            image: "https://d3s8goeblmpptu.cloudfront.net/mrp/toyota/2023/corolla/2023-toyota-corolla_landing-2.jpg"
        },
        {
            id: 3,
            make: "Ford",
            model: "Mustang",
            year: 2022,
            price: 4299,
            image: "https://lp-auto-assets.s3.amazonaws.com/23/honda/civic/sedan/M3/header.jpg"
        },
        {
            id: 4,
            make: "Chevrolet",
            model: "Malibu",
            year: 2023,
            price: 2599,
            image: "https://images.dealer.com/autodata/us/color/2023/USD30NIC041B0/NBL.jpg"
        },
        {
            id: 5,
            make: "BMW",
            model: "3 Series",
            year: 2022,
            price: 4499,
            image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400"
        }
    ];
    
    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight:'bold', marginTop:'-20px' }}>Featured Cars</h2>
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center', 
                gap: '20px'}}>
                {cars.map(car => (
                    <div key={car.id} style={{
                        width: '250px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '15px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <img 
                            src={car.image} 
                            alt={`${car.make} ${car.model}`} 
                            style={{
                                width: '100%',
                                height: '150px',
                                objectFit: 'cover',
                                borderRadius: '5px',
                                marginBottom: '15px' }}/>
                        <div>
                            <h3 style={{ margin: '0 0 10px 0' }}>{car.make} {car.model}</h3>
                            <p style={{ margin: '5px 0' }}>Year: {car.year}</p>
                            <p style={{ margin: '5px 0', fontWeight: 'bold' }}>
                                Price: {car.price.toLocaleString()}
                            </p>
                            <button style={{
                                marginTop: '15px',
                                padding: '8px 15px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                width: '100%'}}>
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedCars;