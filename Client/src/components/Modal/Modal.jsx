import { motion, AnimatePresence } from "framer-motion";

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "info", // "info", "confirm", "warning", "error", "success"
  confirmText = "Confirm",
  cancelText = "Cancel",
  showCancel = true,
}) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case "confirm":
        return "❓";
      case "warning":
        return "⚠️";
      case "error":
        return "🚫";
      case "success":
        return "✅";
      default:
        return "ℹ️";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "confirm":
        return "text-blue-500";
      case "warning":
        return "text-yellow-500";
      case "error":
        return "text-red-500";
      case "success":
        return "text-green-500";
      default:
        return "text-blue-500";
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case "error":
      case "warning":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "success":
        return "bg-green-500 hover:bg-green-600 text-white";
      default:
        return "bg-red-500 hover:bg-red-600 text-white";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-white dark:bg-[#090909] rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-200 dark:border-gray-800"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
              <div className="flex items-center gap-3">
                <div className={`text-2xl ${getIconColor()} bg-white dark:bg-black/20 w-10 h-10 rounded-full flex items-center justify-center`}>
                  {getIcon()}
                </div>
                <h2 className="text-xl font-bold">{title}</h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 flex gap-3 justify-end">
              {showCancel && (
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {cancelText}
                </button>
              )}
              
              <button
                onClick={onConfirm || onClose}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${getConfirmButtonStyle()}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;