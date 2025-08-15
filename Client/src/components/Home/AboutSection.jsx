import { motion } from "framer-motion";
import DecorativeUnderline from "../DecorativeUnderline";

const AboutSection = ({ AboutImage, data }) => {
  return (
    <motion.section
      id="about"
      className="mx-auto px-6 lg:px-12 mb-20 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Image / Media */}
        <motion.div
          className="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-200 dark:ring-gray-700"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            src={AboutImage}
            alt="About MovioLive"
            className="w-full h-64 md:h-80 object-cover"
          />
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="relative text-3xl lg:text-4xl font-bold mb-6 text-red-600">
            About MovioLive
            <DecorativeUnderline linePosition={"left"} />
          </h2>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-lg">
            MovioLive is built for filmmakers, organizers, and movie lovers who
            want a more social, live, and ticketed cinema experience. You can
            host premieres, run paid screenings, and interact with your audience
            via moderated chat and reactions.
          </p>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            The platform handles scheduling, ticketing, secure payments, and
            real-time streaming — so you can focus on curating great events.
          </p>

          {/* Feature List */}
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
            {data.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-xs">
                  ✓
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
