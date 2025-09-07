import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const QuickLinkCard = ({ to, icon, label }) => {
  return (
    <Link to={to} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-black rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 hover:border-red-500/50 dark:hover:border-red-500/50 transition-all duration-300 group cursor-pointer relative"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-3">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30 mx-auto">
            <div className="text-white [&>svg]:w-4 [&>svg]:h-4">
              {icon}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 text-center">
          <h3 className="font-bold text-gray-900 dark:text-white font-Kanit group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200">
            {label}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Click to access
          </p>
        </div>
        
        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </motion.div>
    </Link>
  );
};

export default QuickLinkCard;
