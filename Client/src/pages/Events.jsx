import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaPlay,
  FaUsers,
  FaFire,
} from "react-icons/fa";
import { useEvent } from "../hooks/useEvent";
import movies from "../utils/EventsData";
import EventHeroSection from "../components/Event/EventHeroSection";

const Events = () => {
  const { events } = useEvent();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate dynamic tabs with actual event counts
  const tabs = [
    { key: "all", label: "All Events ", count: events.length },
    {
      key: "live",
      label: "Live Now ",
      count: events.filter((event) => event.status === "live").length,
    },
    {
      key: "upcoming",
      label: "Upcoming ",
      count: events.filter((event) => event.status === "upcoming").length,
    },
    {
      key: "cancelled",
      label: "Cancelled ",
      count: events.filter((event) => event.status === "cancelled").length,
    },
  ];

  const filteredEvents = events.filter((event) => {
    // Match tab based on event status (backend uses 'status' not 'category')
    const matchesTab = activeTab === "all" || event.status === activeTab;

    // Find matching movie data
    const movieData = movies.find((movie) => movie.title === event.title);

    // Search in event title and movie data if available
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movieData?.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      movieData?.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movieData?.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesTab && matchesSearch;
  });

  const liveEventsCount = events.filter(
    (event) => event.status === "live"
  ).length;
  const upcomingEventsCount = events.filter(
    (event) => event.status === "upcoming"
  ).length;

  return (
    <div className="">
      {/* Hero Section */}
      <EventHeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Filter Tabs with Animated Underline */}
      <div className="container mx-auto px-6 lg:px-12 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-8 relative"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 overflow-hidden
                ${
                  activeTab === tab.key
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "bg-black/10 dark:bg-white/10 text-gray-900 hover:bg-black/20 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-white/20 dark:hover:text-white"
                }
              `}
            >
              {tab.key === "live" && (
                <FaFire className="w-4 h-4 text-gray-900 dark:text-gray-300 animate-pulse" />
              )}
              <span>{`${tab.label} (${tab.count})`}</span>
              {activeTab === tab.key && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute left-1/2 -bottom-1 w-2/3 h-1 bg-gradient-to-r from-red-400 via-red-600 to-red-400 rounded-full"
                  style={{ transform: "translateX(-50%)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-6 lg:px-12 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {filteredEvents.map((event, index) => {
              // Find matching movie data for additional details
              const movieData = movies.find(
                (movie) => movie.title === event.title
              );

              return (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-red-600/70 transition-all duration-300 shadow-lg"
                >
                  {/* Live Badge */}
                  {event.status === "live" && (
                    <div className="absolute top-3 left-3 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 animate-pulse shadow-lg">
                      <FaPlay className="w-2 h-2" />
                      LIVE
                    </div>
                  )}

                  {/* Event Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={
                        movieData?.thumb ||
                        "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=500&h=300&fit=crop"
                      }
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-7">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {movieData?.keywords?.map((keyword, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-red-600/20 text-red-600 text-xs font-WorkSans rounded-full border border-red-600/30 shadow-sm"
                        >
                          {keyword}
                        </span>
                      )) || (
                        <span className="px-2 py-1 bg-blue-600/20 text-blue-600 text-xs font-WorkSans rounded-full border border-blue-600/30 shadow-sm">
                          {event.status}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-extrabold mb-2 group-hover:text-red-600 font-WorkSans transition-colors duration-300 drop-shadow">
                      {event.title}
                    </h3>

                    <p className="text-gray-500 text-base mb-4 line-clamp-2">
                      {movieData?.description ||
                        movieData?.subtitle ||
                        "Exciting movie event - don't miss out!"}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <FaCalendarAlt className="w-4 h-4 text-red-400" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <FaClock className="w-4 h-4 text-red-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <FaMapMarkerAlt className="w-4 h-4 text-red-400" />
                        <span>Virtual Theater</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <FaUsers className="w-4 h-4 text-red-400" />
                        <span>{event.viewer || 0} attending</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="text-2xl font-bold text-red-400 drop-shadow">
                        ${event.price}
                      </div>
                      <button className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 hover:from-red-700 hover:to-red-600 text-white px-5 py-2 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg">
                        <FaTicketAlt className="w-4 h-4" />
                        {event.status === "live" ? "Join Now" : "Get Ticket"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-gray-400 text-7xl mb-4 animate-bounce">🎬</div>
            <h3 className="text-3xl font-extrabold text-gray-300 mb-2">
              No events found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? `No events match "${searchTerm}". Try a different search term.`
                : `No ${
                    activeTab === "all" ? "" : activeTab
                  } events available right now.`}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Events;
