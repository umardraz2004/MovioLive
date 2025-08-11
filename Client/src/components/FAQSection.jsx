import { motion } from "framer-motion";
import { useState } from "react";
import DecorativeUnderline from "./DecorativeUnderline";

const FAQSection = ({ faqs }) => {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <motion.section
      className="container mx-auto px-6 lg:px-12 mb-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Title */}
      <h3 className="relative text-3xl lg:text-4xl font-bold text-center mb-10 text-red-600">
        FAQ
        <DecorativeUnderline linePosition={"center"} />
      </h3>

      {/* FAQ Items */}
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((fq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <motion.div
              key={idx}
              className="cursor-pointer rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-[#060606] backdrop-blur-md p-5 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: idx * 0.05,
              }}
              viewport={{ once: true, amount: 0.3 }}
              onClick={() => setOpenFaq(isOpen ? null : idx)}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">{fq.q}</span>
                <motion.span
                  className="text-xl font-bold text-red-600"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isOpen ? "−" : "+"}
                </motion.span>
              </div>

              <motion.div
                initial={false}
                animate={{
                  height: isOpen ? "auto" : 0,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden text-gray-700 dark:text-gray-300 mt-3"
              >
                <p>{fq.a}</p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default FAQSection;
