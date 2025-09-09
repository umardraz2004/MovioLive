import { motion } from "framer-motion";
import { FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";
import ProfileImageUploader from "./ProfileImageUploader";
import heroImage from "../../assets/images/hero.png";

const ProfileHeader = ({ 
  user, 
  avatarUrl, 
  updateAvatar, 
  theme, 
  toggleTheme, 
  logout 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative text-white overflow-hidden"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ProfileImageUploader
              currentAvatar={avatarUrl || ""}
              onAvatarChange={updateAvatar}
            />
          </motion.div>
          
          {/* User Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center lg:text-left flex-1"
          >
            <h1 className="text-4xl lg:text-5xl font-bold font-Kanit mb-2 text-white drop-shadow-lg">
              {user?.fullName || "User"}
            </h1>
            <p className="text-xl text-white/90 mb-4 drop-shadow-md">{user?.email}</p>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {user?.roles?.map((role, index) => (
                <span key={index} className="px-3 py-1 bg-red-600/80 backdrop-blur-sm rounded-full text-sm font-semibold border border-red-500/50 shadow-lg">
                  🎭 {role}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-300 shadow-lg"
            >
              {theme === "light" ? <FaMoon className="w-5 h-5" /> : <FaSun className="w-5 h-5" />}
              <span className="font-semibold">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center gap-3 px-6 py-3 bg-red-600/80 backdrop-blur-sm border border-red-500/50 rounded-xl hover:bg-red-600/90 transition-all duration-300 shadow-lg"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span className="font-semibold">Logout</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
