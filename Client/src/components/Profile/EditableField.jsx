import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { motion } from "framer-motion";
import { showToast } from "../../utils/toast";

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

const EditableField = ({
  field,
  value,
  editField,
  setEditField,
  handleChange,
  handleSave,
}) => {
  const IconComponent = fieldIcons[field] || FiUser;
  const fieldLabel = fieldLabels[field] || field;

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
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-semibold font-Kanit text-red-600 dark:text-red-400 mb-1">
                {fieldLabel}
              </p>
              {editField === field ? (
                <input
                  type={field === "password" ? "password" : "text"}
                  value={value}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-red-500 dark:focus:border-red-400 focus:outline-none transition-colors duration-200"
                  placeholder={`Enter your ${fieldLabel.toLowerCase()}`}
                  autoFocus
                />
              ) : field === "password" ? (
                <p className="text-lg text-gray-900 dark:text-white">••••••••••</p>
              ) : (
                <p className="text-lg text-gray-900 dark:text-white font-medium">{value}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 ml-4">
            {editField === field ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSave(field, value)}
                  className="p-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl text-white shadow-lg transition-all duration-200"
                >
                  <FaSave className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setEditField(null);
                    showToast("Editing canceled!", "info");
                  }}
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
        </div>
      </div>
    </motion.div>
  );
};

export default EditableField;