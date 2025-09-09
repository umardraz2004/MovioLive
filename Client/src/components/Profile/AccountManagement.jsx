import { motion } from "framer-motion";
import ProfileSettings from "./ProfileSettings";
import UserRoles from "./UserRoles";

const AccountManagement = ({
  formData,
  editField,
  setEditField,
  handleChange,
  handleSave
}) => {
  return (
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
        <ProfileSettings
          formData={formData}
          editField={editField}
          setEditField={setEditField}
          handleChange={handleChange}
          handleSave={handleSave}
        />

        {/* Role Management */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white dark:bg-black rounded-3xl shadow-xl border-2 border-gray-200 dark:border-gray-800 p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white font-Kanit mb-6 flex items-center gap-3">
            🎭 Role Management
          </h3>
          <UserRoles 
            roles={formData?.roles || []} 
            userPlanName={formData?.planName}
            billingPeriod={formData?.billingPeriod}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AccountManagement;
