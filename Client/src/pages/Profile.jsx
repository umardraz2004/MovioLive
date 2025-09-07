import RoleSelector from "../components/Profile/RoleSelector";
import EditableField from "../components/Profile/EditableField";
import QuickLinkCard from "../components/Profile/QuickLinkCard";
import SubscriptionCard from "../components/Profile/SubscriptionCard";
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
import { motion } from "framer-motion";
import heroImage from "../assets/images/hero.png";

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
      await updateField({ field, value }); // ✅ from useUser hook
      setEditField(null);
    } catch (err) {
      console.error("Failed to update field:", err);
    }
  };

  const avatarUrl = user?.avatar?.url;

  if (isLoading || !formData) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4.8rem)]">
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Profile Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ProfileImageUploader
                currentAvatar={avatarUrl || ""}
                onAvatarChange={updateAvatar}
              />
            </motion.div>
            
            {/* User Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center lg:text-left flex-1"
            >
              <h1 className="text-4xl lg:text-5xl font-bold font-Kanit mb-2 text-white drop-shadow-lg">
                {formData?.fullName || "User"}
              </h1>
              <p className="text-xl text-white/90 mb-4 drop-shadow-md">{formData?.email}</p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {formData?.roles?.map((role, index) => (
                  <span key={index} className="px-3 py-1 bg-red-600/80 backdrop-blur-sm rounded-full text-sm font-semibold border border-red-500/50 shadow-lg">
                    🎭 {role}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-300 shadow-lg"
              >
                {theme === "light" ? <FaMoon className="w-5 h-5" /> : <FaSun className="w-5 h-5" />}
                <span className="font-semibold">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="flex items-center gap-3 px-6 py-3 bg-red-600/80 backdrop-blur-sm border border-red-500/50 rounded-xl hover:bg-red-600/90 transition-all duration-300 shadow-lg"
              >
                <FaSignOutAlt className="w-5 h-5" />
                <span className="font-semibold">Logout</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Account Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-Kanit mb-8 text-center">
            🛠️ Account Management
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Settings */}
            <div className="bg-white dark:bg-black rounded-3xl shadow-xl border-2 border-gray-200 dark:border-gray-800 p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-Kanit mb-6 flex items-center gap-3">
                👤 Profile Settings
              </h3>
              <div className="space-y-6">
                <EditableField
                  key="fullName"
                  field="fullName"
                  value={formData?.fullName || ""}
                  editField={editField}
                  setEditField={setEditField}
                  handleChange={handleChange}
                  handleSave={handleSave}
                />
                
                {/* Non-editable Email - Same styling as EditableField */}
                <div className="bg-white dark:bg-black rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-800 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">📧</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white font-Kanit mb-1">
                          Email Address
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {formData?.email || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Non-editable Password - Same styling as EditableField */}
                <div className="bg-white dark:bg-black rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-800 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">🔒</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white font-Kanit mb-1">
                          Password
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          ••••••••••••
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                        Secure
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Management */}
            <div className="bg-white dark:bg-black rounded-3xl shadow-xl border-2 border-gray-200 dark:border-gray-800 p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-Kanit mb-6 flex items-center gap-3">
                🎭 Role Management
              </h3>
              <RoleSelector roles={formData.roles || []} />
            </div>
          </div>
        </motion.div>

        {/* Subscription Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-Kanit mb-8 text-center">
            💳 Subscription & Billing
          </h2>
          <div className="max-w-4xl mx-auto">
            <SubscriptionCard user={formData} />
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-Kanit mb-8 text-center">
            ⚡ Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <QuickLinkCard
              to="/error"
              icon={<FaTicketAlt />}
              label="My Tickets"
            />
            <QuickLinkCard
              to="/error"
              icon={<FaCalendarAlt />}
              label="My Events"
            />
            <QuickLinkCard
              to="/error"
              icon={<FaCog />}
              label="Settings"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
