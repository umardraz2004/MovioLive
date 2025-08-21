
import { motion } from "framer-motion";
import { useState } from "react";
import PricingHeader from "../components/Pricing/PricingHeader";
import PricingCard from "../components/Pricing/PricingCard";
import SpecialOffersSection from "../components/Pricing/SpecialOffersSection";
import PricingFooter from "../components/Pricing/PricingFooter";
import { getPricingPlans, specialPlans } from "../utils/pricingData";

const Prices = () => {
  const [billingType, setBillingType] = useState("monthly");

  // Get pricing plans based on billing type
  const plans = getPricingPlans(billingType);

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <PricingHeader 
            billingType={billingType} 
            setBillingType={setBillingType} 
          />
        </motion.div>

        {/* Main Pricing Plans */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <PricingCard 
                plan={plan} 
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Special Offers Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <SpecialOffersSection 
            specialPlans={specialPlans}
          />
        </motion.div>

        {/* Footer Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <PricingFooter />
        </motion.div>
      </div>
    </div>
  );
};

export default Prices;