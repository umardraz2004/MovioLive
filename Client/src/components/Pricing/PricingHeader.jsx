import { motion } from "framer-motion";

const PricingHeader = ({ billingType, setBillingType }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      {/* Premium Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg"
      >
        ✨ Trusted by thousands worldwide
      </motion.div>

      <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-red-600 to-gray-900 dark:from-white dark:via-red-400 dark:to-white bg-clip-text text-transparent mb-6">
        Choose Your Perfect Plan
      </h1>
      
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
        Scale your live streaming with confidence. From personal broadcasts to enterprise solutions.
      </p>

      <div className="flex items-center justify-center gap-4 mb-8 text-gray-600 dark:text-gray-400 text-sm">
        <span className="flex items-center gap-1">
          ✅ No setup fees
        </span>
        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
        <span className="flex items-center gap-1">
          ✅ Cancel anytime
        </span>
        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
        <span className="flex items-center gap-1">
          ✅ 24/7 support
        </span>
      </div>
      
      {/* Beautiful Billing Toggle */}
      <div className="flex items-center justify-center mb-8">
        <div className="bg-gray-100 dark:bg-black p-1 rounded-full shadow-inner border border-gray-200 dark:border-gray-700">
          <div className="flex items-center relative">
            <button
              onClick={() => setBillingType('monthly')}
              className={`relative z-10 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                billingType === 'monthly'
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingType('yearly')}
              className={`relative z-10 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                billingType === 'yearly'
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Yearly
              <span className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full text-xs font-bold">
                -17%
              </span>
            </button>
            
            {/* Sliding Background */}
            <div
              className={`absolute top-1 bottom-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg transition-all duration-300 ease-out ${
                billingType === 'monthly'
                  ? 'left-1 right-[calc(50%+2px)]'
                  : 'left-[calc(50%-2px)] right-1'
              }`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PricingHeader;
