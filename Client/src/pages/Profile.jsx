import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../store/ThemeContext";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaUpload,
  FaTicketAlt,
  FaCalendarAlt,
  FaCog,
  FaMoon,
  FaSun,
  FaUserCircle,
} from "react-icons/fa";

export default function ProfilePage() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [profileImage, setProfileImage] = useState("");
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "johndoe@email.com",
    password: "********",
    role: "Audience",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = (field) => {
    // TODO: Save field to backend
    setEditField(null);
  };

  return (
    <div className="text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Bar with Theme Toggle */}
        <div className="flex justify-end">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>

        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            {profileImage != "" ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 dark:border-black"
              />
            ) : (
              <FaUserCircle className="w-32 h-32 text-gray-400 dark:text-gray-600" />
            )}

            <label className="absolute bottom-0 right-0 bg-red-600 p-2 rounded-full cursor-pointer shadow-md hover:bg-red-700 transition">
              <FaUpload className="text-white" />
              <input
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="space-y-4">
          {/* Name */}
          {["name", "email", "password"].map((field) => (
            <div
              key={field}
              className="flex justify-between items-center bg-white dark:bg-black p-4 rounded-lg shadow-md"
            >
              <div>
                <p className="text-sm font-semibold font-Kanit tracking-wider text-gray-500 dark:text-red-600 capitalize">
                  {field}
                </p>
                {editField === field ? (
                  <input
                    type={field === "password" ? "password" : "text"}
                    value={formData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="mt-1 px-3 py-1 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100"
                  />
                ) : (
                  <p className="text-lg">{formData[field]}</p>
                )}
              </div>
              <div className="flex gap-2">
                {editField === field ? (
                  <>
                    <button
                      onClick={() => handleSave(field)}
                      className="p-2 bg-green-600 hover:bg-green-700 rounded-md text-white"
                    >
                      <FaSave />
                    </button>
                    <button
                      onClick={() => setEditField(null)}
                      className="p-2 bg-gray-500 hover:bg-gray-600 rounded-md text-white"
                    >
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditField(field)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
                  >
                    <FaEdit />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Role as Custom Select */}
          <div className="flex justify-between items-center bg-white dark:bg-black p-4 rounded-lg shadow-md">
            <div>
              <p className="text-sm font-semibold font-Kanit tracking-wider text-gray-500 dark:text-red-600">
                Role
              </p>
              {editField === "role" ? (
                <select
                  value={formData.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  className="mt-1 px-3 py-1 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100"
                >
                  <option value="Audience">Audience</option>
                  <option value="Organizer">Organizer</option>
                </select>
              ) : (
                <p className="text-lg">{formData.role}</p>
              )}
            </div>
            <div className="flex gap-2">
              {editField === "role" ? (
                <>
                  <button
                    onClick={() => handleSave("role")}
                    className="p-2 bg-green-600 hover:bg-green-700 rounded-md text-white"
                  >
                    <FaSave />
                  </button>
                  <button
                    onClick={() => setEditField(null)}
                    className="p-2 bg-gray-500 hover:bg-gray-600 rounded-md text-white"
                  >
                    <FaTimes />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditField("role")}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
                >
                  <FaEdit />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <Link
            to="/error"
            className="flex flex-col items-center bg-white dark:bg-black p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <FaTicketAlt className="text-red-500 text-2xl mb-2" />
            <span className="font-semibold">My Tickets</span>
          </Link>
          <Link
            to="/error"
            className="flex flex-col items-center bg-white dark:bg-black p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <FaCalendarAlt className="text-purple-500 text-2xl mb-2" />
            <span className="font-semibold">My Events</span>
          </Link>
          <Link
            to="/error"
            className="flex flex-col items-center bg-white dark:bg-black p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <FaCog className="text-blue-500 text-2xl mb-2" />
            <span className="font-semibold">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
