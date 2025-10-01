import { FiUsers, FiCalendar, FiStar, FiShield } from "react-icons/fi";
import { motion } from "framer-motion";
import { getPlanFeatures } from "../../utils/generalFunctions";

// Role icons mapping
const roleIcons = {
  Audience: FiUsers,
  Organizer: FiCalendar,
  Admin: FiShield,
  Premium: FiStar,
};

// Get plan features based on user's subscription


const UserRoles = ({ roles, userPlanName, billingPeriod }) => {
  return (
    <div className="space-y-4">
      {/* Roles Display */}
      <div className="flex flex-wrap gap-3">
        {roles.map((role, index) => {
          const IconComponent = roleIcons[role] || FiUsers;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <IconComponent className="w-4 h-4" />
              </div>
              <span className="font-semibold font-Kanit">{role}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Role Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gray-100 dark:bg-[#070707] rounded-xl p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <FiShield className="w-4 h-4 text-red-600" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Access Level
          </span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {roles.includes("Admin") && "Full platform administration rights"}
          {roles.includes("Organizer") &&
            !roles.includes("Admin") &&
            "Event creation and management capabilities"}
          {roles.includes("Premium") &&
            !roles.includes("Admin") &&
            !roles.includes("Organizer") &&
            "Premium streaming and exclusive content access"}
          {!roles.includes("Admin") &&
            !roles.includes("Organizer") &&
            !roles.includes("Premium") &&
            "Standard movie streaming access"}
        </p>
      </motion.div>

      {/* Special Perks for Premium Users */}
      {(roles.includes("Organizer") || roles.includes("Premium")) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800"
        >
          <div className="flex items-center gap-2 mb-2">
            <FiStar className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-semibold text-red-800 dark:text-red-300 font-Kanit">
              🎬 Your Plan Features
            </span>
          </div>
          <ul className="text-xs text-red-700 dark:text-red-400 space-y-1">
            {userPlanName &&
              getPlanFeatures(userPlanName, billingPeriod).map(
                (feature, index) => <li key={index}>• {feature}</li>
              )}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default UserRoles;
