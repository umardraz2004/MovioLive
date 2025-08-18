import RoleSelector from "../components/Profile/RoleSelector";
import EditableField from "../components/Profile/EditableField";
import QuickLinkCard from "../components/Profile/QuickLinkCard";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../store/ThemeContext";
import ProfileImageUploader from "../components/Profile/ProfileImageUploader";
import { useUser } from "../hooks/useUser";
import {
  FaTicketAlt,
  FaCalendarAlt,
  FaCog,
  FaMoon,
  FaSun,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../store/AuthContext";

const Profile = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, updateAvatar, updateField, isLoading } = useUser();
  const { logout } = useAuth();
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState(null);

  // when user loads from hook, sync into local formData
  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (field, value) => {
    if (!formData) return;
    try {
      await updateField({field, value}); // ✅ from useUser hook
      setEditField(null);
    } catch (err) {
      console.error("Failed to update field:", err);
    }
  };

  const avatarUrl = user?.avatar?.url;

  if (isLoading || !formData) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="relative text-gray-900 dark:text-gray-100 mt-10 mb-16 px-5">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ✅ Avatar uploader */}
        <ProfileImageUploader
          currentAvatar={avatarUrl || ""}
          onAvatarChange={updateAvatar}
        />

        <div className="space-y-4">
          {/* ✅ Editable fields (guarded against undefined) */}
          {["fullName", "email"].map((field) => (
            <EditableField
              key={field}
              field={field}
              value={formData?.[field] || ""}
              editField={editField}
              setEditField={setEditField}
              handleChange={handleChange}
              handleSave={handleSave}
            />
          ))}

          {/* ✅ Password update only via EditableField */}
          <EditableField
            key="password"
            field="password"
            value="" // never prefill passwords
            editField={editField}
            setEditField={setEditField}
            handleChange={handleChange}
            handleSave={handleSave}
          />

          {/* ✅ Roles selector */}
          <RoleSelector
            roles={formData.roles || []}
            editField={editField}
            setEditField={setEditField}
            handleChange={handleChange}
            handleSave={handleSave}
          />

          {/* ✅ Theme + Logout */}
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

        {/* ✅ Quick links */}
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
