import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiShield, FiClock, FiLifeBuoy, FiAward } from "react-icons/fi";

const PricingFooter = () => {
  const features = [
    {
      icon: FiShield,
      title: "30-Day Money Back",
      description: "Full refund if not satisfied"
    },
    {
      icon: FiClock,
      title: "Instant Activation",
      description: "Setup in under 5 minutes"
    },
    {
      icon: FiLifeBuoy,
      title: "24/7 Support",
      description: "Expert help when you need it"
    },
    {
      icon: FiAward,
      title: "Enterprise Grade",
      description: "Trusted by professionals"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="mt-16 py-12 bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-800 dark:to-black rounded-2xl border border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-5xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-red-600 to-gray-900 dark:from-white dark:via-red-400 dark:to-white bg-clip-text text-transparent mb-4">
            Why Choose MovioLive?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join thousands of satisfied users who trust MovioLive for their streaming needs
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="text-center group"
            >
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-200"
            >
              Contact Sales
            </Link>
            <Link 
              to="/" 
              className="bg-gray-100 hover:bg-gray-200 dark:bg-black dark:hover:bg-gray-950 text-gray-900 dark:text-white py-3 px-8 rounded-xl font-semibold transition-all duration-200 border-2 border-gray-300 dark:border-gray-700"
            >
              View FAQ
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PricingFooter;
