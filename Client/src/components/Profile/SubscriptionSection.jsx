import { motion } from "framer-motion";
import SubscriptionCard from "./SubscriptionCard";

const SubscriptionSection = ({ user, onUserUpdate}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mb-12"
    >
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-Kanit mb-8 text-center">
        💳 Subscription & Billing
      </h2>
      <div className="max-w-4xl mx-auto">
        <SubscriptionCard user={user} onUserUpdate={onUserUpdate} billingPeriod={user.billingPeriod} planName={user.planName} />
      </div>
    </motion.div>
  );
};

export default SubscriptionSection;
