import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Error = () => {
  return (
    <div className="h-screen w-full bg-gray-900 flex items-center justify-center relative overflow-hidden px-4">
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gray-800 shadow-xl rounded-2xl p-10 md:p-16 text-center max-w-lg w-full z-10"
      >
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
          className="text-[8rem] md:text-[10rem] font-extrabold text-red-500 mb-4 leading-none"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-semibold text-slate-100 mb-2"
        >
          Page Not Found
        </motion.p>

        <p className="text-slate-400 mb-6">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link
            to="/"
            className="bg-teal-500 hover:bg-teal-400 text-white font-medium text-lg py-2 px-6 rounded-full transition duration-300 shadow-md"
          >
            Go Back Home
          </Link>
        </motion.div>
      </motion.div>

      {/* Glowing Bouncing Dots */}
      <motion.div
        className="absolute bottom-10 flex gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[0, 0.2, 0.4].map((delay, i) => (
          <motion.div
            key={i}
            className="w-4 h-4 md:w-5 md:h-5 bg-red-500 rounded-full shadow-lg"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Animated Floating Background Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-24 h-24 bg-teal-700 rounded-full opacity-30 blur-2xl"
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-36 h-36 bg-red-800 rounded-full opacity-20 blur-2xl"
        animate={{ y: [0, 12, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default Error;