import RoleSelector from "../components/Profile/RoleSelector";
import EditableField from "../components/Profile/EditableField";
import QuickLinkCard from "../components/Profile/QuickLinkCard";
import { useState, useContext } from "react";
import { ThemeContext } from "../store/ThemeContext";
import ProfileImageUploader from "../components/Profile/ProfileImageUploader";
import { useAuth } from "../store/AuthContext";
import {
  FaTicketAlt,
  FaCalendarAlt,
  FaCog,
  FaMoon,
  FaSun,
  FaSignOutAlt,
} from "react-icons/fa";

const Profile = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout, updateAvatar } = useAuth();
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState(user);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    // Save to backend later
    setEditField(null);
  };
  const avatarUrl = user?.avatar?.url;
  return (
    <div className="relative text-gray-900 dark:text-gray-100 mt-10 mb-16 px-5">
      <div className="max-w-4xl mx-auto space-y-8">
        <ProfileImageUploader
          currentAvatar={avatarUrl} // string only
          onAvatarChange={updateAvatar}
        />

        <div className="space-y-4">
          {["fullName", "email", "password"].map((field) => (
            <EditableField
              key={field}
              field={field}
              value={formData[field]}
              editField={editField}
              setEditField={setEditField}
              handleChange={handleChange}
              handleSave={handleSave}
            />
          ))}

          <RoleSelector
            roles={formData.roles}
            editField={editField}
            setEditField={setEditField}
            handleChange={handleChange}
            handleSave={handleSave}
          />
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black hover:bg-gray-200 dark:hover:bg-black/60 transition duration-300"
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>

            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-md border border-red-500 bg-red-600 text-white hover:bg-red-700 transition duration-300"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <QuickLinkCard
            to="/error"
            icon={<FaTicketAlt className="text-red-500 text-2xl mb-2" />}
            label="My Tickets"
          />
          <QuickLinkCard
            to="/error"
            icon={<FaCalendarAlt className="text-purple-500 text-2xl mb-2" />}
            label="My Events"
          />
          <QuickLinkCard
            to="/error"
            icon={<FaCog className="text-blue-500 text-2xl mb-2" />}
            label="Reset Password"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
