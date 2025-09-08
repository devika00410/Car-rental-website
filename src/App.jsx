import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import Navbar from './Components/Navbar';
import Form from './Components/From';
import Results from './Pages/Result';
import DiscountsAndOffers from './Components/DiscountAndOffers';
import CarList from './Pages/CarList';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/Homepage';
import BookingPage from './Pages/BookingPage';
import Signup from './Pages/Signup';
import AdminDashboard from './Pages/AdminDashboard';
import AdminLogin from './Pages/AdminLogin';
import Chatbot from './Components/Chatbot';
import CarDetails from './Pages/CarDetails';
import About from './Pages/About';
import AdminLoginIcon from './Components/AdminLoginIcon';
import UserDashboard from './Pages/UserDashboard';
import Contact from './Pages/Contact';
import Footer from './Components/Footer';
import Subscription from './Pages/Subscription';
// import { ThemeProvider } from './Context/ThemeContext';
// import ThemeDebugger from './Components/ThemeDebugger';
import PaymentPage from './Pages/PaymentPage';
import CompanyDashboard from './Pages/CompanyDashboard';



// Create Auth Context at the top level
const AuthContext = createContext();

// Custom hook to use auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Component that wraps AdminLoginIcon with auth context
const AdminLoginIconWithAuth = () => {
  const { admin } = useAuth();
  return !admin ? <AdminLoginIcon /> : null;
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const userData = localStorage.getItem('user');
    const adminData = localStorage.getItem('admin');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

    if (userData && isLoggedIn) {
      setUser(JSON.parse(userData));
    }

    if (adminData && isAdminLoggedIn) {
      setAdmin(JSON.parse(adminData));
    }
  };

  const login = (userData) => {
    setIsLoading(true);
    setTimeout(() => {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoading(false);
    }, 300);
  };

  const adminLogin = (adminData) => {
    setIsLoading(true);
    setTimeout(() => {
      setAdmin(adminData);
      localStorage.setItem('admin', JSON.stringify(adminData));
      localStorage.setItem('isAdminLoggedIn', 'true');
      setIsLoading(false);
    }, 300);
  };

  const logout = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      setIsLoading(false);
    }, 300);
  };

  const adminLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAdmin(null);
      localStorage.removeItem('admin');
      localStorage.removeItem('isAdminLoggedIn');
      setIsLoading(false);
    }, 300);
  };

  return (
    <AuthContext.Provider value={{
      user,
      admin,
      login,
      adminLogin,
      logout,
      adminLogout,
      isLoading,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component for Users
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return user && isLoggedIn ? children : <Navigate to="/login" replace />;
};

// Protected Route Component for Admins
const AdminRoute = ({ children }) => {
  const { admin } = useAuth();
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

  return admin && isAdminLoggedIn ? children : <Navigate to="/admin" replace />;
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      {/* <ThemeProvider> */}
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">        
        <div className="pt-15">
          <Header />
          <Navbar />
          {/* <ThemeDebugger/> */}
          {/* <Chatbot/> */}

          {/* Admin Login Icon - Only shows when not logged in as admin */}
          <AdminLoginIconWithAuth />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/results" element={<Results />} />
            <Route
              path="/pre-booking"
              element={
                <ProtectedRoute>
                  <CarList />
                </ProtectedRoute>
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/cars" element={<CarList />} />
            <Route path="/car-details/:id?" element={<CarDetails />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/contact" element={<Contact />} />
            {/* User Dashboard Route */}
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

              <Route
              path="/company-dashboard"
              element={
                <ProtectedRoute>
                  <CompanyDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
          </div>
        </div>
      </Router>
      {/* </ThemeProvider> */}
    </AuthProvider>
  );
}

// Export the custom hook and component
export { useAuth };
export default App;