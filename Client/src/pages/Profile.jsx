import ProfileHeader from "../components/Profile/ProfileHeader";
import AccountManagement from "../components/Profile/AccountManagement";
import SubscriptionSection from "../components/Profile/SubscriptionSection";
import QuickActionsGrid from "../components/Profile/QuickActionsGrid";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../store/ThemeContext";
import { useUser } from "../hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../store/AuthContext";

const Profile = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, updateAvatar, updateField, isLoading } = useUser();
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState(null);

  // Function to refresh user data
  const handleUserUpdate = () => {
    queryClient.invalidateQueries(["user"]);
  };

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
      <ProfileHeader
        user={formData}
        avatarUrl={avatarUrl}
        updateAvatar={updateAvatar}
        theme={theme}
        toggleTheme={toggleTheme}
        logout={logout}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Account Management Section */}
        <AccountManagement
          formData={formData}
          editField={editField}
          setEditField={setEditField}
          handleChange={handleChange}
          handleSave={handleSave}
        />

        {/* Subscription Section */}
        <SubscriptionSection
          user={formData}
          onUserUpdate={handleUserUpdate}
        />

        {/* Quick Actions Grid */}
        <QuickActionsGrid />
      </div>
    </div>
  );
};

export default Profile;
