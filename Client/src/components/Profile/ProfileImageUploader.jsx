import { FaUserCircle, FaUpload } from "react-icons/fa";
import { useState } from "react";

const ProfileImageUploader = ({ currentAvatar, onAvatarChange }) => {
   const [preview, setPreview] = useState(currentAvatar || "");

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only PNG, JPG, JPEG, or GIF files are allowed!");
      return;
    }

    // ✅ Optional: Check file size (2MB limit here)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB!");
      return;
    }

    // Preview
    setPreview(URL.createObjectURL(file));

    // Convert to Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      onAvatarChange(reader.result); // send Base64 string to parent (AuthContext)
    };
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 dark:border-black"
          />
        ) : (
          <FaUserCircle className="w-32 h-32 text-gray-400 dark:text-gray-600" />
        )}
        <label className="absolute bottom-0 right-0 bg-red-600 p-2 rounded-full cursor-pointer shadow-md hover:bg-red-700 transition">
          <FaUpload className="text-white" />
          <input type="file" className="hidden" accept=".png, .jpg, .jpeg, .gif" onChange={handleImageChange} />
        </label>
      </div>
    </div>
  );
};

export default ProfileImageUploader;

