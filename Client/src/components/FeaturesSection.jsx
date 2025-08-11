import { motion } from "framer-motion";
import DecorativeUnderline from "./DecorativeUnderline";

const FeaturesSection = ({ features }) => {
  return (
    <section className="px-6 lg:px-12 mb-10 bg-gray-300 dark:bg-black/70 pb-16 pt-10">
      {/* Title */}
      <motion.h3
        className="relative text-3xl lg:text-4xl font-bold text-center mb-12 
             text-red-600"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        Features
        {/* Decorative underline */}
        <DecorativeUnderline linePosition={"center"} />
      </motion.h3>

      {/* Feature Grid */}
      <motion.div
        className="grid md:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="p-6 rounded-xl shadow-lg border border-gray-200 dark:dark:bg-[#111111] bg-white/60 dark:bg-gray-800/60 backdrop-blur-md hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div
              className="w-14 h-14 rounded-lg flex items-center justify-center text-white shadow-md"
              style={{
                background: "linear-gradient(135deg,#ef4444,#7c3aed)",
              }}
            >
              <f.icon size={f.size} />
            </div>
            <h4 className="mt-4 font-semibold text-lg">{f.title}</h4>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {f.text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
