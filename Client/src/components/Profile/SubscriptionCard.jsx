import { FiCalendar, FiCreditCard, FiClock, FiStar, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";
import { showToast } from "../../utils/toast";
import { Link } from "react-router-dom";
import { getPlanFeatures } from "../../utils/generalFunctions";

const SubscriptionCard = ({ user, onUserUpdate, billingPeriod, planName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const hasActiveSubscription =
    user?.subscriptionStatus === "active" &&
    user?.currentPeriodEnd &&
    new Date(user.currentPeriodEnd) > new Date();
  const hasExpiredSubscription =
    user?.currentPeriodEnd &&
    new Date(user.currentPeriodEnd) <= new Date() &&
    user?.subscriptionStatus === "inactive";

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate time remaining (hours for daily, days for others)
  const getTimeRemaining = (endDate) => {
    if (!endDate) return 0;
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;

    // Check if it's a daily plan
    const isDailyPlan = user?.planName?.toLowerCase().includes("daily");

    if (isDailyPlan) {
      // For daily plans, show hours
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      return Math.max(0, diffHours);
    } else {
      // For other plans, show days
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    }
  };

  // Cancel subscription function
  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      const response = await fetch(
        `${baseUrl}/api/checkout/cancel-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // This sends cookies for authentication
        }
      );

      const data = await response.json();

      if (data.success) {
        showToast("Subscription canceled successfully", "success");
        // Refresh user data
        if (onUserUpdate) {
          onUserUpdate();
        }
      } else {
        showToast(data.message || "Failed to cancel subscription", "error");
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
      showToast("Failed to cancel subscription - network error", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-black rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200 dark:border-gray-800"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
            <FiCreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-Kanit">
              🎬 Subscription Status
            </h3>
            <p className="text-sm text-white/80">Your MovioLive membership</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {hasActiveSubscription ? (
          <div className="space-y-4">
            {/* Active Subscription */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <FiStar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white font-Kanit">
                    {user.planName || "Premium Plan"}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.planName?.toLowerCase().includes("daily")
                      ? "24-hour subscription"
                      : "Monthly/Yearly subscription"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Subscription Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiCalendar className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Current Period
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  From: {formatDate(user.currentPeriodStart)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Until: {formatDate(user.currentPeriodEnd)}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiClock className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Time Remaining
                  </span>
                </div>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {getTimeRemaining(user.currentPeriodEnd)}{" "}
                  {user.planName?.toLowerCase().includes("daily")
                    ? "hours"
                    : "days"}
                </p>
                {user.planName?.toLowerCase().includes("daily") && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Auto-cancels after 24h
                  </p>
                )}
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border border-red-200 dark:border-red-800">
              <h5 className="text-sm font-semibold text-red-800 dark:text-red-300 font-Kanit mb-2">
                🍿 Active Benefits
              </h5>
              <ul className="text-xs text-red-700 dark:text-red-400 space-y-1">
                {planName &&
                  getPlanFeatures(planName, billingPeriod).map(
                    (feature, index) => <li key={index}>• {feature}</li>
                  )}
              </ul>
            </div>

            {/* Cancel Subscription Button */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCancelSubscription}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                <FiX className="w-4 h-4" />
                {isLoading ? "Canceling..." : "Cancel Subscription"}
              </button>
            </div>
          </div>
        ) : hasExpiredSubscription ? (
          <div className="text-center py-8">
            {/* Expired Subscription */}
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiClock className="w-8 h-8 text-red-500" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white font-Kanit mb-2">
              Subscription Expired
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Your subscription expired on {formatDate(user.currentPeriodEnd)}
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-6 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-400">
                🎬 Subscribe again to continue enjoying MovioLive premium
                content!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => (window.location.href = "/pricing")}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300"
              >
                🎬 View Plans & Subscribe
              </button>

              <button
                onClick={handleCancelSubscription}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 disabled:opacity-50"
              >
                <FiX className="w-4 h-4" />
                {isLoading ? "Canceling..." : "Cancel Completely"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white font-Kanit mb-2">
              No Active Subscription
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Subscribe to unlock premium movie streaming features
            </p>
            <Link
              to="/prices"
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300"
            >
              View Plans
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SubscriptionCard;
