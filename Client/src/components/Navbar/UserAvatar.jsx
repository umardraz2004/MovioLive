import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";

const UserAvatar = ({ avatar }) => {
  return (
    <div className="relative w-12 h-12 rounded-full overflow-hidden">
      {/* Loader */}
      {/* {updatingAvatar && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: avatar
              ? "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)"
              : "#e0e0e0",
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )} */}

      {/* Avatar Image */}
      {avatar ? (
        <motion.img
          src={avatar}
          alt={"User"}
          className="w-12 h-12 object-cover rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      ) : (
        <FaUserCircle className="w-12 h-12 text-gray-400 dark:text-gray-500" />
      )}
    </div>
  );
};

export default UserAvatar;
