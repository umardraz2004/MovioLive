import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const JoinCtaSection = () => {
  return (
    <motion.section
      className="join-cta py-20 bg-gradient-to-br from-red-700 via-red-800 to-red-900"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container mx-auto px-6 lg:px-12 text-center">
        <motion.h3
          className="text-3xl lg:text-4xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Ready to bring your movies to life?
        </motion.h3>

        <motion.p
          className="mt-3 text-gray-100 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Create unforgettable screenings, build community, and monetize your
          events.
        </motion.p>

        <motion.div
          className="mt-6 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link
            to="/signup"
            className="inline-block bg-white text-red-600 px-6 py-3 rounded-md font-semibold hover:opacity-95 hover:scale-105 transform transition duration-300"
          >
            Join Now
          </Link>
          <Link
            to="/contact"
            className="inline-block border border-white/25 text-white px-6 py-3 rounded-md hover:bg-white/5 hover:scale-105 transform transition duration-300"
          >
            Need Help? Contact Us
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default JoinCtaSection;
