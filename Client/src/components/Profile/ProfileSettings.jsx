import { motion } from "framer-motion";
import EditableField from "./EditableField";
import { useState } from "react";

const ProfileSettings = ({
  formData,
  editField,
  setEditField,
  handleChange,
  handleSave
}) => {
  const [passwordValue, setPasswordValue] = useState("");

  const handlePasswordChange = (field, value) => {
    setPasswordValue(value);
    handleChange(field, value);
  };

  const handlePasswordSave = async (field, value) => {
    await handleSave(field, value);
    setPasswordValue(""); // Clear password field after save
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-white dark:bg-black rounded-3xl shadow-xl border-2 border-gray-200 dark:border-gray-800 p-8"
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white font-Kanit mb-6 flex items-center gap-3">
        👤 Profile Settings
      </h3>
      <div className="space-y-6">
        {/* Editable Full Name */}
        <EditableField
          key="fullName"
          field="fullName"
          value={formData?.fullName || ""}
          editField={editField}
          setEditField={setEditField}
          handleChange={handleChange}
          handleSave={handleSave}
          isEditable={true}
          validationRules={{
            required: true,
            minLength: 3,
            maxLength: 50,
            pattern: /^[A-Za-z ]+$/,
            message: "Full name must be 3-50 characters and contain only letters and spaces"
          }}
        />
        
        {/* Editable Email */}
        <EditableField
          key="email"
          field="email"
          value={formData?.email || ""}
          editField={editField}
          setEditField={setEditField}
          handleChange={handleChange}
          handleSave={handleSave}
          isEditable={false}
          validationRules={{
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address"
          }}
        />

        {/* Editable Password */}
        <EditableField
          key="password"
          field="password"
          value={editField === "password" ? passwordValue : ""}
          editField={editField}
          setEditField={setEditField}
          handleChange={handlePasswordChange}
          handleSave={handlePasswordSave}
          isEditable={false}
          isPassword={true}
          validationRules={{
            required: true,
            minLength: 6,
            message: "Password must be at least 6 characters long"
          }}
          placeholder="Enter new password"
        />
      </div>
    </motion.div>
  );
};

export default ProfileSettings;
