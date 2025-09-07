import { FiCalendar, FiCreditCard, FiClock, FiStar } from "react-icons/fi";
import { motion } from "framer-motion";

const SubscriptionCard = ({ user }) => {
  const hasActiveSubscription = user?.subscriptionStatus === 'active';
  const hasActivePass = user?.hasActivePass && user?.passExpiresAt;
  
  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate days remaining
  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
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
            <p className="text-sm text-white/80">
              Your MovioLive membership
            </p>
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
                    {user.planName || 'Premium Plan'}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.planType === 'subscription' ? 'Monthly Subscription' : user.planType}
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
                    Days Remaining
                  </span>
                </div>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {getDaysRemaining(user.currentPeriodEnd)} days
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border border-red-200 dark:border-red-800">
              <h5 className="text-sm font-semibold text-red-800 dark:text-red-300 font-Kanit mb-2">
                🍿 Active Benefits
              </h5>
              <ul className="text-xs text-red-700 dark:text-red-400 space-y-1">
                <li>• Unlimited movie event hosting</li>
                <li>• HD streaming quality</li>
                <li>• Advanced analytics</li>
                <li>• Priority customer support</li>
              </ul>
            </div>
          </div>
        ) : hasActivePass ? (
          <div className="space-y-4">
            {/* One-time Pass */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <FiClock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white font-Kanit">
                    One-Day Pass
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    24-hour access
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiClock className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Expires In
                </span>
              </div>
              <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {getDaysRemaining(user.passExpiresAt)} hours remaining
              </p>
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
            <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300">
              View Plans
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SubscriptionCard;
