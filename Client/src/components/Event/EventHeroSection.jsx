import { motion } from "framer-motion";

const EventHeroSection = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative pt-20 pb-16 mb-10">
      <div className="absolute inset-0 bg-black/90"></div>
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
            <span className="block text-white">Discover Amazing</span>
            <span className="block text-red-600 animate-gradient-x bg-gradient-to-r from-red-600 via-red-400 to-red-600 bg-clip-text">
              Movie Events
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200/90 mb-8">
            Join live movie screenings, interactive experiences, and connect
            with fellow film enthusiasts worldwide.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent shadow-lg"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventHeroSection;
