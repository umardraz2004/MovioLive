import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiArrowRight,
  FiDownload,
  FiMail,
} from "react-icons/fi";
import { showToast } from "../utils/toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      console.log('No session ID found, redirecting to prices');
      navigate("/prices");
      return;
    }

    fetchSessionData();
  }, [sessionId, navigate]);

  const fetchSessionData = async () => {
    try {
      console.log('Fetching session data for:', sessionId);
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/checkout/session/${sessionId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
        }
      );

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Session data:', data);

      if (data.success) {
        setSessionData(data.session);
        showToast("Payment successful! Welcome to MovioLive!", "success");
      } else {
        console.error('Error fetching payment details:', data.error);
        showToast(data.error || "Error fetching payment details", "error");
        // Don't navigate away immediately, let user see the error
        setTimeout(() => navigate("/prices"), 3000);
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      showToast("Error loading payment details", "error");
      // Don't navigate away immediately, let user see the error
      setTimeout(() => navigate("/prices"), 3000);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return (amount / 100).toFixed(2);
  };

  const getSubscriptionType = (session) => {
    if (session?.mode === "subscription") {
      return "Subscription";
    } else if (session?.mode === "payment") {
      return "One-time Payment";
    }
    return "Payment";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-black rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6"
            >
              <FiCheckCircle className="w-12 h-12 text-green-500" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl font-bold text-white mb-4"
            >
              Payment Successful!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-green-100 text-lg"
            >
              Welcome to MovioLive Premium! Your subscription is now active.
            </motion.p>
          </div>

          {/* Payment Details */}
          <div className="px-8 py-8">
            {sessionData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="space-y-6"
              >
                {/* Order Summary */}
                <div className="bg-gray-50 dark:bg-[#101010] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Payment Type:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {getSubscriptionType(sessionData)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Amount Paid:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${formatAmount(sessionData.amount_total)}{" "}
                        {sessionData.currency?.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Payment Status:
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {sessionData.payment_status}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Session ID:
                      </span>
                      <span className="font-mono text-sm text-gray-900 dark:text-white">
                        {sessionData.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* What's Next */}
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                    What's Next?
                  </h3>

                  <ul className="space-y-3 text-blue-800 dark:text-blue-200">
                    <li className="flex items-start">
                      <FiMail className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                      <span>
                        You'll receive a confirmation email with your receipt
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FiCheckCircle className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                      <span>Your premium features are now active</span>
                    </li>
                    <li className="flex items-start">
                      <FiDownload className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                      <span>Access exclusive content and premium features</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              <Link
                to="/"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
              >
                Go to Dashboard
                <FiArrowRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                to="/"
                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-[#181818] dark:hover:bg-[#181818bc] text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-center"
              >
                Back to Home
              </Link>
            </motion.div>

            {/* Support Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-8 p-4 bg-gray-100 dark:bg-[#181818bc] rounded-lg text-center"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Having issues? Contact our support team at{" "}
                <a
                  href="mailto:support@movio.live"
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  support@movio.live
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
