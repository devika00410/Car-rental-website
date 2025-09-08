// src/Components/AdminLoginIcon.jsx
import React, { useState } from 'react';
import { LockClosedIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../App';

const AdminLoginIcon = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { adminLogin } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple admin authentication
    if (loginData.username === 'admin' && loginData.password === 'admin123') {
      adminLogin({ username: 'admin', role: 'administrator' });
      setIsLoginOpen(false);
      window.location.href = '/admin/dashboard';
    } else {
      setError('Invalid admin credentials');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError('');
  };

  return (
    <>
      {/* Admin Login Icon */}
      <div 
        className="fixed bottom-6 right-6 z-40 bg-blue-600 p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors"
        onClick={() => setIsLoginOpen(true)}
        title="Admin Login"
      >
        <LockClosedIcon className="h-6 w-6 text-white" />
      </div>

      {/* Admin Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={loginData.username}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Admin username"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Admin password"
                  required
                />
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                  Sign In
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Default credentials: admin / admin123</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminLoginIcon;