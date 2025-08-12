import { FaUserCircle, FaUpload } from "react-icons/fa";

const ProfileImageUploader = ({ profileImage, setProfileImage }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 dark:border-black"
          />
        ) : (
          <FaUserCircle className="w-32 h-32 text-gray-400 dark:text-gray-600" />
        )}
        <label className="absolute bottom-0 right-0 bg-red-600 p-2 rounded-full cursor-pointer shadow-md hover:bg-red-700 transition">
          <FaUpload className="text-white" />
          <input type="file" className="hidden" onChange={handleImageChange} />
        </label>
      </div>
    </div>
  );
};

export default ProfileImageUploader;
