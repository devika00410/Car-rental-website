// src/pages/Subscription.jsx
import React, { useState } from 'react';
import { FaCheck, FaCar, FaCrown, FaStar, FaGem } from 'react-icons/fa';

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly or yearly

  // Subscription plans data
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: <FaCar className="text-blue-500 text-2xl" />,
      monthlyPrice: 499,
      yearlyPrice: 4999,
      description: 'Perfect for occasional renters',
      features: [
        '5% discount on all rentals',
        'Free cancellation',
        'Priority support',
        'Basic car options'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: <FaStar className="text-yellow-500 text-2xl" />,
      monthlyPrice: 999,
      yearlyPrice: 9999,
      description: 'Great for frequent travelers',
      features: [
        '15% discount on all rentals',
        'Free cancellation',
        '24/7 priority support',
        'Premium car options',
        'Free additional driver',
        'Airport pickup priority'
      ],
      popular: true
    },
    {
      id: 'elite',
      name: 'Elite',
      icon: <FaCrown className="text-purple-500 text-2xl" />,
      monthlyPrice: 1999,
      yearlyPrice: 19999,
      description: 'For the ultimate car rental experience',
      features: [
        '25% discount on all rentals',
        'Free cancellation',
        '24/7 dedicated support',
        'Luxury car options',
        'Free additional driver',
        'Airport pickup priority',
        'Free upgrades when available',
        'Exclusive member events'
      ]
    }
  ];

  const handleSubscribe = (planId) => {
    alert(`Thank you for choosing the ${planId} plan! Redirecting to payment...`);
    // Here you would typically redirect to payment processing
  };

  // Calculate yearly savings percentage
  const calculateYearlySavings = (monthlyPrice, yearlyPrice) => {
    const monthlyTotal = monthlyPrice * 12;
    const savings = monthlyTotal - yearlyPrice;
    const savingsPercentage = (savings / monthlyTotal) * 100;
    return Math.round(savingsPercentage);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Nexago Membership Plans
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose the plan that works best for you and enjoy exclusive benefits on all your car rentals
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-md font-medium text-sm transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-md font-medium text-sm transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400'
              }`}
            >
              Yearly Billing
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Save up to 17%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl overflow-hidden transition-transform hover:scale-105 ${
                plan.popular
                  ? 'border-2 border-violet-500 shadow-xl transform scale-105'
                  : 'border border-gray-200 dark:border-gray-700 shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-violet-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}
              
              <div className="bg-white dark:bg-gray-800 p-8">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ₹{billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      {billingCycle === 'monthly' ? '/month' : '/year'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                      Save {calculateYearlySavings(plan.monthlyPrice, plan.yearlyPrice)}% compared to monthly
                    </p>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Subscribe Button */}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-violet-600 hover:bg-violet-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                  }`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can cancel your subscription at any time. Your benefits will remain active until the end of your billing period.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                How do I use my subscription benefits?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Once subscribed, your benefits are automatically applied when you log into your account and make a booking.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Are there any hidden fees?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No, the price shown is all you pay. Taxes are included in the displayed price.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Can I change my plan later?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. The changes will take effect in your next billing cycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;