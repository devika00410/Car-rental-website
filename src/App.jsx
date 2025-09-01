import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import Form from './Components/From';
import Results from './Pages/Result';
import FeaturedCars from './Components/FeaturedCars';
import DiscountsAndOffers from './Components/DiscountAndOffers';
import CarList from './Pages/CarList';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/Homepage';


// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is logged in (from localStorage)
  const checkAuth = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const login = (userData) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
    }, 300);
  };

  const logout = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser(null);
      localStorage.removeItem('user');
      setIsLoading(false);
    }, 300);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading,checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            {/* Home page */}
            <Route path="/" element={<HomePage />} />
            
            {/* Other pages */}
            <Route path="/results" element={<Results />} />
            <Route path="/pre-booking" element={<CarList />} />
            <Route path="/product-info" element={<ProductInfoPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
export { useAuth }; 