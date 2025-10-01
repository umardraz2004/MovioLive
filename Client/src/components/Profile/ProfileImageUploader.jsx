import { FaUserCircle, FaUpload, FaCamera } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import { showToast } from "../../utils/toast";

const ProfileImageUploader = ({ currentAvatar, onAvatarChange }) => {
  const [preview, setPreview] = useState(currentAvatar || "");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      showToast("Only PNG, JPG, JPEG, or GIF files are allowed!", "error");
      return;
    }

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be less than 2MB!", "error");
      return;
    }

    setIsUploading(true);

    // Preview
    setPreview(URL.createObjectURL(file));

    // Convert to Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      onAvatarChange(reader.result); // send Base64 string to parent (AuthContext)
      setIsUploading(false);
      showToast("Profile picture updated successfully!", "success");
    };
  };

  return (
    <div className="flex flex-col items-center">
      {/* Avatar */}
      <div className="relative group">
        {preview ? (
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={preview}
            alt="Profile"
            className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white/30 shadow-2xl"
          />
        ) : (
          <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-2xl">
            <FaUserCircle className="w-20 h-20 lg:w-24 lg:h-24 text-white/80" />
          </div>
        )}
        
        {/* Upload Button */}
        <motion.label 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute -bottom-2 -right-2 bg-white text-red-600 p-2 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-white"
        >
          {isUploading ? (
            <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
          ) : (
            <FaCamera className="w-4 h-4" />
          )}
          <input 
            type="file" 
            className="hidden" 
            accept=".png, .jpg, .jpeg, .gif" 
            onChange={handleImageChange}
            disabled={isUploading}
          />
        </motion.label>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center text-white">
            <FaUpload className="w-6 h-6 mx-auto mb-1" />
            <p className="text-xs font-semibold">Change Photo</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 text-center">
        <p className="text-xs text-white/70">
          Click camera to update
        </p>
      </div>
    </div>
  );
};

export default ProfileImageUploader;

