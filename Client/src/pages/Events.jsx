import { useState, useEffect } from "react";
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
import { useTicket } from "../hooks/useTicket";
import movies from "../utils/EventsData";
import EventHeroSection from "../components/Event/EventHeroSection";
import { showToast } from "../utils/toast";

const Events = () => {
  const { events, allEventsLoading, allEventsError } = useEvent();
  const {
    tickets,
    ticketsLoading,
    hasTicketForEvent,
    createTicketCheckout,
    ticketCheckoutLoading,
  } = useTicket();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  tickets.map((ticket) => console.log("User Ticket:", ticket));

  // Handle ticket checkout using TanStack Query mutation
  const handleTicketCheckout = async (event) => {
    try {
      if (!event || !event._id) {
        throw new Error("Event information not found");
      }

      await createTicketCheckout(event._id);
    } catch (error) {
      console.error("Checkout error:", error);
      showToast("Error processing checkout. Please try again.", "error");
    }
  };

  // Timer component for events
  const EventTimer = ({ event }) => {
    const [timeLeft, setTimeLeft] = useState("");
    const [isEventTime, setIsEventTime] = useState(false);

    useEffect(() => {
      if (!event?.date || !event?.time) {
        setTimeLeft("No date/time set");
        return;
      }

      const calculateTimeLeft = () => {
        // Handle different date formats
        let eventDateTime;
        try {
          // Try parsing the date directly first
          eventDateTime = new Date(`${event.date}T${event.time}`);

          // If invalid, try alternative format
          if (isNaN(eventDateTime.getTime())) {
            const dateStr = new Date(event.date).toISOString().split("T")[0];
            eventDateTime = new Date(`${dateStr}T${event.time}`);
          }
        } catch (error) {
          console.error("Date parsing error:", error);
          setTimeLeft("Invalid date");
          return;
        }

        const now = new Date();
        const difference = eventDateTime.getTime() - now.getTime();

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          if (days > 0) {
            setTimeLeft(`${days}d ${hours}h ${minutes}m`);
          } else if (hours > 0) {
            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
          } else if (minutes > 0) {
            setTimeLeft(`${minutes}m ${seconds}s`);
          } else {
            setTimeLeft(`${seconds}s`);
          }
          setIsEventTime(false);
        } else {
          setTimeLeft("Event Started!");
          setIsEventTime(true);
        }
      };

      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);

      return () => clearInterval(timer);
    }, [event?.date, event?.time]);

    return (
      <div className="mb-3 p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
        <div className="text-xs text-blue-400 font-semibold mb-1 text-center">
          {isEventTime ? "🎬 Event Started!" : "⏰ Starts in"}
        </div>
        <div
          className={`font-bold text-center ${
            isEventTime ? "text-green-400 animate-pulse" : "text-blue-400"
          }`}
        >
          {timeLeft}
        </div>
      </div>
    );
  };

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
        {/* Loading State */}
        {allEventsLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">
              Loading Events...
            </h3>
            <p className="text-gray-500">
              Fetching the latest movie events for you
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {allEventsError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-300 mb-4">
              Failed to load events
            </h3>
            <p className="text-gray-500 mb-4">
              {allEventsError?.message ||
                "Something went wrong while fetching events"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-600 text-white px-6 py-2 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Events Content */}
        {!allEventsLoading && !allEventsError && (
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

                      {/* Event Timer */}
                      <EventTimer event={event} />

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <FaCalendarAlt className="w-4 h-4 text-red-400" />
                          <span>
                            {new Date(event.date).toLocaleDateString()}
                          </span>
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
                        <button
                          onClick={() => handleTicketCheckout(event)}
                          disabled={
                            ticketCheckoutLoading ||
                            tickets.some(
                              (ticket) =>
                                ticket.eventId._id.toString() ===
                                  event._id.toString() &&
                                ticket.paymentStatus === "paid"
                            )
                          }
                          className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 hover:from-red-700 hover:to-red-600 text-white px-5 py-2 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaTicketAlt className="w-4 h-4" />
                          {tickets.find(
                            (ticket) =>
                              ticket.eventId.toString() ===
                                event._id.toString() &&
                              ticket.paymentStatus === "paid"
                          )
                            ? "Ticket Purchased"
                            : event.status === "live"
                            ? "Join Now"
                            : "Get Ticket"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {/* No Results */}
        {!allEventsLoading &&
          !allEventsError &&
          filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-gray-400 text-7xl mb-4 animate-bounce">
                🎬
              </div>
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
