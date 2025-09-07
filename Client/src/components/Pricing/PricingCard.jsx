import { FiCheck, FiStar } from "react-icons/fi";
import { useState } from "react";
import { showToast } from "../../utils/toast";

const PricingCard = ({ plan, billingType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isPopular = plan.popular;

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      if (!plan.priceId) {
        throw new Error('Price ID not found for this plan');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/checkout/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          planName: plan.name,
          priceId: plan.priceId,
          planType: 'subscription'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        showToast(data.error || 'Failed to create checkout session', 'error');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      showToast('Error processing checkout. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div
      className={`relative bg-white dark:bg-black rounded-2xl shadow-xl overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl ${
        isPopular 
          ? 'border-red-500 ring-4 ring-red-500/20 scale-105' 
          : 'border-gray-200 dark:border-gray-800 hover:border-red-300 dark:hover:border-red-500'
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
            <FiStar className="w-4 h-4" />
            Most Popular
          </div>
        </div>
      )}

      {/* Card Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br opacity-5 ${isPopular ? 'from-red-500 to-red-600' : 'from-gray-500 to-gray-600'}`}></div>
      
      <div className={`relative p-8 ${isPopular ? 'pt-12' : 'pt-8'}`}>
        {/* Plan Name */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {plan.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {plan.description}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-xl ${isPopular ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-gray-500 to-gray-600'} flex items-center justify-center shadow-lg`}>
            <span className="text-white font-bold text-lg">
              {plan.name.charAt(0)}
            </span>
          </div>
        </div>
        
        {/* Pricing */}
        <div className="mb-8">
          <div className="flex items-baseline mb-2">
            <span className="text-5xl font-bold text-gray-900 dark:text-white">
              ${plan.price}
            </span>
            <span className="text-gray-600 dark:text-gray-400 ml-2 text-lg">
              {plan.period}
            </span>
          </div>
          {plan.originalPrice && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-500 line-through">
                ${plan.originalPrice}{plan.period}
              </span>
              <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full text-xs font-semibold">
                Save ${plan.originalPrice - plan.price}
              </span>
            </div>
          )}
        </div>

        {/* Features List */}
        <ul className="space-y-4 mb-8">
          {plan.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <FiCheck className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            isPopular
              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg'
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-red-500 dark:hover:bg-red-400 text-gray-900 dark:text-white'
          }`}
        >
          {isLoading ? 'Processing...' : plan.buttonText}
        </button>

        {/* Guarantee Badge */}
        <div className="mt-6 text-center">
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
            <FiCheck className="w-4 h-4 text-red-500" />
            30-day money-back guarantee
          </span>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
