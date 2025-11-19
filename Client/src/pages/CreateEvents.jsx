import { useState, useEffect } from "react";
import movies from "../utils/EventsData.js";
import { showToast } from "../utils/toast.js";
import { useEvent } from "../hooks/useEvent.js";

const CreateEvents = () => {
  const { events, totalEvents, createEvent, deleteEvent } = useEvent();
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [hostMovieSidebarOpen, sethostMovieSidebarOpen] = useState(false);
  const [viewDetailSidebarOpen, setViewDetailSidebarOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    time: "",
    price: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHostEvent = async () => {
    const eventData = {
      ...eventForm,
      title: selectedMovie.title,
    };
    if (!eventForm.date || !eventForm.time || !eventForm.price) {
      showToast("Please fill in all fields", "info");
      return;
    }
    try {
      await createEvent(eventData); // Wait for success

      // Only reset UI on successful creation
      sethostMovieSidebarOpen(false);
      setSelectedMovie(null);
      setEventForm({ title: "", date: "", time: "", price: "" });
    } catch (error) {
      // Handle error, keep modals open
      showToast("Failed to create event. Please try again.", "error");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
      } catch (error) {
        showToast("Failed to delete event. Please try again.", "error");
      }
    }
  };

  return (
    <div className="my-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 dark:text-white mb-6 drop-shadow-lg">
            Event Management
          </h1>

          {/* Tab Navigation */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "browse"
                  ? "bg-white text-red-600 shadow-lg transform -translate-y-1"
                  : "bg-white dark:bg-black/70 dark:text-white text-gray-500 dark:hover:bg-white/10 backdrop-blur-sm"
              }`}
              onClick={() => setActiveTab("browse")}
            >
              Browse Movies
            </button>
            <button
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "history"
                  ? "bg-white text-red-600 shadow-lg transform -translate-y-1"
                  : "bg-white dark:bg-black/70 dark:text-white text-gray-500 dark:hover:bg-white/10 backdrop-blur-sm"
              }`}
              onClick={() => setActiveTab("history")}
            >
              My Events ({totalEvents}) {/* hosted event count comes here*/}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-black/70 backdrop-blur-sm rounded-2xl p-6 min-h-96">
          {activeTab === "browse" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-white text-center">
                Browse Movies
              </h2>

              {/* Movies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map((movie, index) => (
                  <div
                    key={index}
                    className="group bg-white dark:bg-[#090909] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setSelectedMovie(movie);
                      setViewDetailSidebarOpen(true);
                    }}
                  >
                    {/* Movie Thumbnail */}
                    <div className="relative h-30 overflow-hidden">
                      <img
                        src={movie.thumb}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold transform hover:scale-105 transition-all duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMovie(movie);
                            setViewDetailSidebarOpen(true);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>

                    {/* Movie Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-red-800 dark:text-red-600 mb-2">
                        {movie.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-white mb-2">
                        {movie.subtitle}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-white line-clamp-3">
                        {movie.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <h2 className="text-4xl font-bold font-WorkSans text-red-600 dark:text-white text-center">
                My Events
              </h2>

              {totalEvents === 0 ? ( // hosted event count comes here
                <div className="text-center text-white py-16">
                  <div className="bg-gray-100 dark:bg-black/60 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto">
                    <h3 className="text-red-600 text-xl font-semibold mb-4">
                      No events hosted yet
                    </h3>
                    <p className="dark:text-white text-black mb-6">
                      Click on "Browse Movies" to start hosting events!
                    </p>
                    <button
                      onClick={() => setActiveTab("browse")}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200"
                    >
                      Browse Movies
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => {
                    // Find matching movie data by title
                    const movieData = movies.find(
                      (movie) => movie.title === event.title
                    );

                    return (
                      <div
                        key={event._id}
                        className="bg-white dark:bg-[#090909] rounded-xl p-6 shadow-lg"
                      >
                        <div className="flex gap-4 mb-4">
                          {/* Show movie thumbnail if found */}
                          {movieData && (
                            <img
                              src={movieData.thumb}
                              alt={event.title}
                              className="w-20 h-28 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">
                              {event.title}
                            </h3>
                            {movieData && (
                              <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                                {movieData.subtitle}
                              </p>
                            )}
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                              <p>
                                <strong>📅 Date:</strong>{" "}
                                {new Date(event.date).toLocaleDateString()}
                              </p>
                              <p>
                                <strong>⏰ Time:</strong> {event.time}
                              </p>
                              <p>
                                <strong>💰 Price:</strong> ${event.price}
                              </p>
                              <p>
                                <strong>👥 Viewers:</strong> {event.viewer || 0}
                              </p>
                              <p>
                                <strong>📊 Status:</strong>
                                <span
                                  className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                                    event.status === "upcoming"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                      : event.status === "live"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                  }`}
                                >
                                  {event.status}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar for View event details */}
      {viewDetailSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setViewDetailSidebarOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="relative dark:bg-black bg-gray-100 h-full w-full max-w-lg md:max-w-lg shadow-2xl overflow-y-auto animate-slide-in-right scrollbar-hide">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Movie Details</h2>
                <button
                  onClick={() => setViewDetailSidebarOpen(false)}
                  className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            {selectedMovie && (
              <div className="p-6 space-y-6">
                {/* Movie Poster */}
                <div className="w-full">
                  <img
                    src={selectedMovie.thumb}
                    alt={selectedMovie.title}
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                  />
                </div>

                {/* Title & Subtitle */}
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {selectedMovie.title}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                    {selectedMovie.subtitle}
                  </p>
                </div>

                {/* Tagline */}
                {selectedMovie.tagline && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-gray-700 dark:text-gray-300 italic font-medium text-center">
                      "{selectedMovie.tagline}"
                    </p>
                  </div>
                )}

                {/* Keywords */}
                {selectedMovie.keywords &&
                  selectedMovie.keywords.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                        Categories
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedMovie.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium capitalize"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                    Description
                  </h3>
                  <div className="bg-white dark:bg-[#090909] rounded-lg p-4 shadow-sm">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {selectedMovie.description}
                    </p>
                  </div>
                </div>

                {/* Video Sources */}
                {selectedMovie.sources && selectedMovie.sources.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                      Available Sources
                    </h3>
                    <div className="space-y-2">
                      {selectedMovie.sources.map((source, index) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-[#090909] rounded-lg p-3 shadow-sm"
                        >
                          <a
                            href={source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium break-all"
                          >
                            Source {index + 1}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setViewDetailSidebarOpen(false);
                      sethostMovieSidebarOpen(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Host Event
                  </button>
                  <button
                    onClick={() => setViewDetailSidebarOpen(false)}
                    className="px-6 py-3 bg-gray-200 dark:bg-[#090909] text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-[#1a1a1a] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sidebar for Hosting event */}
      {hostMovieSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => sethostMovieSidebarOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="relative dark:bg-black bg-gray-100 h-full w-full max-w-md md:max-w-md shadow-2xl animate-slide-in-right">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Host Event</h2>
                <button
                  onClick={() => sethostMovieSidebarOpen(false)}
                  className="w-8 h-8 rounded-full bg-black/80 flex items-center justify-center hover:bg-black/30 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            {selectedMovie && (
              <div className="p-6">
                {/* Selected Movie Info */}
                <div className="dark:bg-[#151515] bg-white rounded-xl p-4 mb-6">
                  <div className="flex gap-4">
                    <img
                      src={selectedMovie.thumb}
                      alt={selectedMovie.title}
                      className="w-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 dark:text-red-600 mb-1">
                        {selectedMovie.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-white">
                        {selectedMovie.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Event Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-red-600 mb-2">
                      Event Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={eventForm.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold dark:text-red-600 text-gray-700 mb-2">
                      Event Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={eventForm.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold dark:text-red-600 text-gray-700 mb-2">
                      Ticket Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={eventForm.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-4 py-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleHostEvent}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-lg font-bold text-lg hover:from-red-600 hover:to-red-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl mt-8"
                  >
                    Host Event
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEvents;
