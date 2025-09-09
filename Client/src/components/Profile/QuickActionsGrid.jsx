import { motion } from "framer-motion";
import QuickLinkCard from "./QuickLinkCard";
import {
  FaTicketAlt,
  FaCalendarAlt,
  FaCog,
} from "react-icons/fa";

const QuickActionsGrid = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
    >
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-Kanit mb-8 text-center">
        ⚡ Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <QuickLinkCard
          to="/error"
          icon={<FaTicketAlt />}
          label="My Tickets"
        />
        <QuickLinkCard
          to="/error"
          icon={<FaCalendarAlt />}
          label="My Events"
        />
        <QuickLinkCard
          to="/error"
          icon={<FaCog />}
          label="Settings"
        />
      </div>
    </motion.div>
  );
};

export default QuickActionsGrid;
