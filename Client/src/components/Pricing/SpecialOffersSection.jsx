import { motion } from "framer-motion";
import SpecialOfferCard from "./SpecialOfferCard";

const SpecialOffersSection = ({ specialPlans }) => {
  return (
    <>
      {/* Special Plans Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
          🚀 Special Offers - Limited Time
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-600 to-gray-900 dark:from-white dark:via-red-400 dark:to-white bg-clip-text text-transparent pb-2 mb-4">
          Try Before You Commit
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Get started with MovioLive risk-free. Perfect for first-time users or one-time events.
        </p>
      </motion.div>

      {/* Special Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {specialPlans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <SpecialOfferCard 
              plan={plan} 
            />
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default SpecialOffersSection;
