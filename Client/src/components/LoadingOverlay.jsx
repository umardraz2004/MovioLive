// LoadingOverlay.jsx
import { motion, AnimatePresence } from "framer-motion";

const LoadingOverlay = ({ loading }) => {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-white/80 dark:bg-black/80 z-90"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center gap-4"
          >
            {/* Spinner */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-red-400 animate-spin-slow"></div>
            </div>

            {/* Text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-semibold text-red-600 tracking-wider"
            >
              Loading...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
