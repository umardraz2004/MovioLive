import React, { useState, useEffect } from "react";
import movies from "../utils/EventsData.js";

const CreateEvents = () => {
  const [activeTab, setActiveTab] = useState("browse"); // 'browse' or 'history'
  const [hostedEvents, setHostedEvents] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    date: "",
    time: "",
    price: "",
    venue: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHostEvent = () => {
    if (
      !eventForm.date ||
      !eventForm.time ||
      !eventForm.price ||
      !eventForm.venue
    ) {
      alert("Please fill in all fields");
      return;
    }

    const newEvent = {
      id: Date.now(),
      movie: selectedMovie,
      ...eventForm,
      createdAt: new Date().toISOString(),
    };

    setHostedEvents((prev) => [...prev, newEvent]);
    setSidebarOpen(false);
    setSelectedMovie(null);
    setEventForm({
      date: "",
      time: "",
      price: "",
      venue: "",
    });
    alert("Event hosted successfully!");
  };

  const handleDeleteEvent = (eventId) => {
    setHostedEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("hostedEvents");
    if (savedEvents) {
      setHostedEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to localStorage whenever hostedEvents changes
  useEffect(() => {
    if (hostedEvents.length > 0) {
      localStorage.setItem("hostedEvents", JSON.stringify(hostedEvents));
    }
  }, [hostedEvents]);

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
              My Events ({hostedEvents.length})
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
                      setSidebarOpen(true);
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
                        <button className="bg-white text-red-600 px-6 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200">
                          Host Event
                        </button>
                      </div>
                    </div>

                    {/* Movie Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-red-800 dark:text-red-600 mb-2 line-clamp-1">
                        {movie.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-white mb-2">
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
              <h2 className="text-2xl font-semibold mb-6 text-white text-center">
                My Events
              </h2>

              {hostedEvents.length === 0 ? (
                <div className="text-center text-white py-16">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto">
                    <h3 className="text-xl font-semibold mb-4">
                      No events hosted yet
                    </h3>
                    <p className="mb-6">
                      Click on "Browse Movies" to start hosting events!
                    </p>
                    <button
                      onClick={() => setActiveTab("browse")}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                    >
                      Browse Movies
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hostedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-xl p-6 shadow-lg"
                    >
                      <div className="flex gap-4 mb-4">
                        <img
                          src={event.movie.thumb}
                          alt={event.movie.title}
                          className="w-20 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 mb-2">
                            {event.movie.title}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>
                              <strong>Date:</strong> {event.date}
                            </p>
                            <p>
                              <strong>Time:</strong> {event.time}
                            </p>
                            <p>
                              <strong>Price:</strong> ${event.price}
                            </p>
                            <p>
                              <strong>Venue:</strong> {event.venue}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar for event creation */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="relative dark:bg-black bg-gray-100 h-full w-full max-w-md md:max-w-md shadow-2xl animate-slide-in-right">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Host Event</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
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
