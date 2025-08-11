import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AboutImage from "../assets/images/about.png";
import {
  FaTicketAlt,
  FaBullhorn,
  FaComments,
  FaCalendarAlt,
  FaMobileAlt,
  FaShieldAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import "../styles/Home.css";

const features = [
  {
    icon: <FaTicketAlt size={20} />,
    title: "Smart Ticketing",
    text: "Set prices, promo codes, limits and issue e-tickets instantly.",
  },
  {
    icon: <FaBullhorn size={20} />,
    title: "Promote & Announce",
    text: "Built-in event pages and shareable links to promote your screening.",
  },
  {
    icon: <FaComments size={20} />,
    title: "Live Chat",
    text: "Real-time audience chat and moderation tools.",
  },
  {
    icon: <FaCalendarAlt size={20} />,
    title: "Flexible Scheduling",
    text: "Schedule one-off or recurring screenings with timezone support.",
  },
  {
    icon: <FaMobileAlt size={20} />,
    title: "Multi-device",
    text: "Optimized viewing on desktop, tablet, and mobile devices.",
  },
  {
    icon: <FaShieldAlt size={20} />,
    title: "Secure Payments",
    text: "Stripe / Razorpay integration and secure payouts for organizers.",
  },
];

const faqs = [
  {
    q: "How do I host an event?",
    a: "Create an organizer account, choose or upload your movie, schedule a screening, set ticketing, and go live at the scheduled time.",
  },
  {
    q: "How do viewers join?",
    a: "Viewers buy a ticket, receive an e-ticket, and click the 'Join' link on the scheduled date/time to access the screen.",
  },
  {
    q: "Which payment methods are supported?",
    a: "We support major payment gateways (Stripe, Razorpay). Support for more gateways can be added per region.",
  },
];

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      {/* HERO */}
      <header className="hero-root">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="py-28 md:py-36 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              <span className="block text-white">Stream. Host. Connect.</span>
              <span className="block text-red-600">
                Movies — Live & Interactive
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-gray-200/90 max-w-3xl mx-auto">
              MovioLive gives you the tools to host cinematic live events, sell
              tickets, and build engaged audiences — all in one platform.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md shadow-xl transition transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
              <Link
                to="#about"
                className="inline-flex items-center gap-3 border border-white/20 text-white px-5 py-3 rounded-md hover:bg-white/10 transition"
              >
                Learn More
              </Link>
            </div>

            <div className="mt-8 flex justify-center gap-8 text-sm text-gray-300">
              <div className="text-center">
                <div className="text-xl font-semibold">HD</div>
                <div className="text-xs">Streaming</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold">Secure</div>
                <div className="text-xs">Payments</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold">Global</div>
                <div className="text-xs">Audience</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mt-20">
        {/* ABOUT */}
        <motion.section
          id="about"
          className="container mx-auto px-6 lg:px-12 mb-20"
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
                <span
                  className="absolute left-0 -bottom-3 w-16 h-1 
             bg-gradient-to-r from-red-500 via-orange-400 to-red-500 
             rounded-full animate-gradient-move"
                ></span>
              </h2>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-lg">
                MovioLive is built for filmmakers, organizers, and movie lovers
                who want a more social, live, and ticketed cinema experience.
                You can host premieres, run paid screenings, and interact with
                your audience via moderated chat and reactions.
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                The platform handles scheduling, ticketing, secure payments, and
                real-time streaming — so you can focus on curating great events.
              </p>

              {/* Feature List */}
              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                {[
                  "Easy event creation",
                  "Instant e-tickets",
                  "Role-based organizer tools",
                  "Built-in analytics",
                ].map((feature, index) => (
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

        {/* FEATURES */}
        <section className="container mx-auto px-6 lg:px-12 mb-10 bg-gray-300 dark:bg-black/70 pb-16 pt-10">
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
            <span
              className="absolute left-1/2 -bottom-3 w-16 h-1 
             bg-gradient-to-r from-red-500 via-orange-400 to-red-500 
             rounded-full transform -translate-x-1/2 animate-gradient-move"
            ></span>
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
                  {f.icon}
                </div>
                <h4 className="mt-4 font-semibold text-lg">{f.title}</h4>
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {f.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
        {/* FAQ */}
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
            <span
              className="absolute left-1/2 -bottom-3 w-16 h-1 
             bg-gradient-to-r from-red-500 via-orange-400 to-red-500 
             rounded-full transform -translate-x-1/2 animate-gradient-move"
            ></span>
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

        {/* JOIN CTA */}
        <motion.section
          className="join-cta py-20 relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Glow border effect */}
          <div className="absolute inset-0 border border-transparent rounded-2xl bg-gradient-to-r from-red-500/40 via-purple-500/40 to-blue-500/40 p-[2px]"></div>

          <div className="relative container mx-auto px-6 lg:px-12 text-center">
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
              Create unforgettable screenings, build community, and monetize
              your events.
            </motion.p>

            <motion.div
              className="mt-6 flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link
                to="/register"
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
      </main>
    </div>
  );
};

export default Home;
