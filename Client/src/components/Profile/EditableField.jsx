import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { motion } from "framer-motion";
import { showToast } from "../../utils/toast";
import { useState } from "react";

const fieldIcons = {
  fullName: FiUser,
  email: FiMail,
  password: FiLock,
};

const fieldLabels = {
  fullName: "Full Name",
  email: "Email Address",
  password: "Password",
};

const fieldEmojis = {
  fullName: "👤",
  email: "📧",
  password: "🔒",
};

const EditableField = ({
  field,
  value,
  editField,
  setEditField,
  handleChange,
  handleSave,
  isEditable = true,
  isPassword = false,
  validationRules = {},
  placeholder = ""
}) => {
  const fieldLabel = fieldLabels[field] || field;
  const fieldEmoji = fieldEmojis[field] || "📝";
  const [validationError, setValidationError] = useState("");

  const validateField = (fieldValue) => {
    setValidationError("");

    if (validationRules.required && !fieldValue.trim()) {
      setValidationError("This field is required");
      return false;
    }

    if (validationRules.minLength && fieldValue.length < validationRules.minLength) {
      setValidationError(validationRules.message || `Minimum ${validationRules.minLength} characters required`);
      return false;
    }

    if (validationRules.pattern && !validationRules.pattern.test(fieldValue)) {
      setValidationError(validationRules.message || "Invalid format");
      return false;
    }

    return true;
  };

  const handleSaveClick = () => {
    if (validateField(value)) {
      handleSave(field, value);
      setValidationError("");
    } else {
      showToast(validationError, "error");
    }
  };

  const handleCancelClick = () => {
    setEditField(null);
    setValidationError("");
    showToast("Editing canceled!", "info");
  };

  const getFieldStatus = () => {
    if (field === "email") {
      return { color: "green", label: "Verified", dot: "bg-green-500" };
    }
    if (field === "password") {
      return { color: "blue", label: "Secure", dot: "bg-blue-500" };
    }
    if (field === "fullName") {
      return { color: "purple", label: "Active", dot: "bg-purple-500" };
    }
    return { color: "gray", label: "Ready", dot: "bg-gray-500" };
  };

  const status = getFieldStatus();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-black rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 hover:border-red-500/50 dark:hover:border-red-500/50 transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex justify-between items-center">
          {/* Field Info */}
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">{fieldEmoji}</span>
            </div>
            
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white font-Kanit mb-1">
                {fieldLabel}
              </h4>
              {editField === field ? (
                <div className="space-y-2">
                  <input
                    type={isPassword || field === "password" ? "password" : "text"}
                    value={value}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className={`w-full px-4 py-2 rounded-xl border ${
                      validationError 
                        ? "border-red-500 focus:border-red-600" 
                        : "border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-400"
                    } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none transition-colors duration-200`}
                    placeholder={placeholder || `Enter your ${fieldLabel.toLowerCase()}`}
                    autoFocus
                  />
                  {validationError && (
                    <p className="text-red-500 text-sm">{validationError}</p>
                  )}
                </div>
              ) : field === "password" ? (
                <p className="text-gray-600 dark:text-gray-400">
                  ••••••••••••
                </p>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  {value || "Not provided"}
                </p>
              )}
            </div>
          </div>

          {/* Status and Action Buttons */}
          <div className="flex items-center gap-4 ml-4">
            {/* Status Indicator (only when not editing) */}
            {editField !== field && (
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 ${status.dot} rounded-full`}></div>
                <span className={`text-xs font-semibold text-${status.color}-600 dark:text-${status.color}-400 bg-${status.color}-100 dark:bg-${status.color}-900/30 px-2 py-1 rounded-full`}>
                  {status.label}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            {isEditable && (
              <div className="flex gap-3">
                {editField === field ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSaveClick}
                      className="p-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl text-white shadow-lg transition-all duration-200"
                    >
                      <FaSave className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancelClick}
                      className="p-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 rounded-xl text-white shadow-lg transition-all duration-200"
                    >
                      <FaTimes className="w-4 h-4" />
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditField(field)}
                    className="p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl text-white shadow-lg transition-all duration-200"
                  >
                    <FaEdit className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EditableField;