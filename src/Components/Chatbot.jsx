import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi there! 👋 I'm your car rental assistant. How can I help you today? You can ask about car types, pricing, booking, or requirements.",
      isUser: false
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom of chat whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Improved response function with better car rental answers
  const getBotResponse = (userText) => {
    const text = userText.toLowerCase();

    // Rule-based response logic - Enhanced for car rental
    if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
      return "Hello! Welcome to DriveEasy Rentals! How can I assist with your car rental today?";
    } else if (text.includes('car') || text.includes('vehicle') || text.includes('model') || text.includes('type')) {
      if (text.includes('suv') || text.includes('sport utility') || text.includes('family')) {
        return "We have excellent SUVs like Toyota RAV4, Honda CR-V, and Ford Explorer. Perfect for families and road trips! Prices start at $75/day. Would you like to know more about SUV features?";
      } else if (text.includes('luxury') || text.includes('premium') || text.includes('bmw') || text.includes('mercedes') || text.includes('audi')) {
        return "Our luxury fleet includes BMW 5 Series, Mercedes E-Class, and Audi A6. Experience premium comfort with advanced features. Starting at $129/day.";
      } else if (text.includes('economy') || text.includes('compact') || text.includes('cheap') || text.includes('budget')) {
        return "Our economy cars (Honda Civic, Toyota Corolla, Hyundai Elantra) are fuel-efficient and perfect for city driving. Prices start at $45/day with great mileage!";
      } else if (text.includes('sports') || text.includes('convertible') || text.includes('fast')) {
        return "For sports enthusiasts, we offer Ford Mustang Convertible and Chevrolet Camaro. Feel the thrill starting at $99/day!";
      }
      return "We offer Economy cars from $45/day, SUVs from $75/day, Luxury vehicles from $129/day, and Sports cars from $99/day. Which type interests you most?";
    
    } else if (text.includes('price') || text.includes('cost') || text.includes('rate') || text.includes('how much')) {
      return "Our daily rates: Economy from $45, SUV from $75, Luxury from $129, Sports from $99. All prices include basic insurance. Additional fees may apply for young drivers or special equipment.";
    
    } else if (text.includes('book') || text.includes('reservation') || text.includes('reserve') || text.includes('how to book')) {
      return "Booking is easy! 1) Choose your car type 2) Select dates and location 3) Provide driver details 4) Confirm payment. You'll need a valid driver's license and credit card. Ready to get started?";
    
    } else if (text.includes('license') || text.includes('driver license') || text.includes('requirement') || text.includes('need to rent')) {
      return "Requirements: Valid driver's license (held for 1+ year), credit card in renter's name, minimum age 21 (25 for luxury cars). International license required if yours isn't in English.";
    
    } else if (text.includes('insurance') || text.includes('cover') || text.includes('protection')) {
      return "We offer: 1) Basic CDW/LDW (included) 2) Supplemental Liability ($12/day) 3) Personal Accident Insurance ($8/day) 4) Full Coverage ($25/day). You can choose at pickup.";
    
    } else if (text.includes('location') || text.includes('pickup') || text.includes('where')) {
      return "We have locations at: Downtown Main St. (8 AM-10 PM), Airport Terminal B (24/7), and City West Mall (9 AM-9 PM). Free shuttle service available from airport!";
    
    } else if (text.includes('fuel') || text.includes('gas') || text.includes('petrol')) {
      return "We provide the car with a full tank. Please return it full to avoid refueling fees. There's a gas station 2 minutes from our return location.";
    
    } else if (text.includes('mileage') || text.includes('km') || text.includes('limit')) {
      return "All rentals include unlimited mileage! Drive as much as you want without extra charges.";
    
    } else if (text.includes('cancel') || text.includes('refund')) {
      return "You can cancel free of charge up to 24 hours before pickup. Within 24 hours, a $50 fee applies. No refund for no-shows.";
    
    } else if (text.includes('thank') || text.includes('thanks') || text.includes('appreciate')) {
      return "You're very welcome! 😊 Is there anything else about your rental I can help with?";
    
    } else if (text.includes('contact') || text.includes('phone') || text.includes('call')) {
      return "You can reach us at 📞 1-800-DRIVE-EASY or email support@driveeasy.com. We're available 24/7 for urgent matters!";
    
    } else {
      return "I'm here to help with your car rental! You can ask me about: vehicle types, pricing, booking process, requirements, insurance, or locations. What would you like to know?";
    }
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;

    // Add user message
    const newMessages = [...messages, { text: inputText, isUser: true }];
    setMessages(newMessages);
    setInputText('');

    // Simulate bot thinking and then respond
    setTimeout(() => {
      const botReply = getBotResponse(inputText);
      setMessages(prev => [...prev, { text: botReply, isUser: false }]);
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chatbot Icon Button - Always visible */}
      {!isOpen && (
        <button className="chatbot-icon-btn" onClick={toggleChat}>
          💬
          <span className="chatbot-tooltip">Need help? Chat with us!</span>
        </button>
      )}

      {/* Chatbot Window - Only visible when open */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="chatbot-avatar">🚗</span>
              <h3>DriveEasy Assistant</h3>
            </div>
            <button className="chatbot-close-btn" onClick={toggleChat}>
              ✕
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.isUser ? 'user-message' : 'bot-message'}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chatbot-input-container">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about our cars, pricing, or booking..."
              className="chatbot-input"
            />
            <button onClick={handleSend} className="chatbot-send-btn">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;