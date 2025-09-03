import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiXCircle,
  FiArrowLeft,
  FiRefreshCw,
  FiHelpCircle,
} from "react-icons/fi";
import { showToast } from "../utils/toast";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    if (canceled === "true") {
      showToast("Payment was canceled. You can try again anytime.", "info");
    }
  }, [canceled]);

  const reasons = [
    {
      icon: <FiXCircle className="w-6 h-6" />,
      title: "Payment was canceled",
      description: "You chose to cancel the payment process",
    },
    {
      icon: <FiRefreshCw className="w-6 h-6" />,
      title: "Technical issues",
      description: "There might have been a temporary technical problem",
    },
    {
      icon: <FiHelpCircle className="w-6 h-6" />,
      title: "Need more information",
      description: "You might want to review our plans before purchasing",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Cancel Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6"
            >
              <FiXCircle className="w-12 h-12 text-orange-500" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl font-bold text-white mb-4"
            >
              Payment Canceled
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-orange-100 text-lg"
            >
              No worries! Your payment was not processed and no charges were
              made.
            </motion.p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Possible Reasons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                This might have happened because:
              </h3>

              <div className="space-y-4">
                {reasons.map((reason, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex-shrink-0 text-orange-500 dark:text-orange-400 mr-4">
                      {reason.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {reason.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {reason.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* What You Can Do */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                What you can do next:
              </h3>

              <ul className="space-y-3 text-blue-800 dark:text-blue-200">
                <li className="flex items-start">
                  <FiRefreshCw className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                  <span>Try the payment process again</span>
                </li>
                <li className="flex items-start">
                  <FiHelpCircle className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                  <span>Review our pricing plans and features</span>
                </li>
                <li className="flex items-start">
                  <FiXCircle className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                  <span>Contact our support team for assistance</span>
                </li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/pricing"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
              >
                <FiRefreshCw className="mr-2 w-5 h-5" />
                Try Again
              </Link>

              <Link
                to="/"
                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
              >
                <FiArrowLeft className="mr-2 w-5 h-5" />
                Back to Home
              </Link>
            </motion.div>

            {/* Support Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Need help with your payment?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@movio.live"
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                >
                  Email Support
                </a>
                <Link
                  to="/contact"
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                >
                  Contact Us
                </Link>
                <Link
                  to="/faq"
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                >
                  View FAQ
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentCancel;
