import { useContext } from "react";
import { ThemeContext } from "../store/ThemeContext";
import { motion } from "framer-motion";

const Profile = () => {
  const { theme } = useContext(ThemeContext);

  const user = {
    name: "John Doe",
    email: "john@example.com",
    role: "Organizer",
    avatar: "https://i.pravatar.cc/150?img=12",
    joined: "March 2024",
  };

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl w-full bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-10 text-white"
      >
        {/* Top: Avatar and Info */}
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-pink-500 shadow-lg hover:scale-105 transition-transform duration-300">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 rounded-full ring-2 ring-pink-400 animate-pulse opacity-60"></div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-lg">
              {user.name}
            </h1>
            <p className="mt-1 text-sm tracking-wide text-pink-300/90">
              {user.email}
            </p>

            <span className="inline-block mt-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 px-6 py-2 text-sm font-semibold tracking-wide shadow-lg uppercase drop-shadow-md">
              {user.role}
            </span>

            <p className="mt-3 text-xs text-pink-200 italic">
              Joined {user.joined}
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-10 border-white/30" />

        {/* Editable Info */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-200">
          {[
            { label: "Full Name", value: user.name, type: "text" },
            { label: "Email Address", value: user.email, type: "email" },
            { label: "Role", value: user.role, disabled: true },
            { label: "Joined", value: user.joined, disabled: true },
          ].map(({ label, value, type = "text", disabled }, i) => (
            <div key={i} className="flex flex-col">
              <label className="mb-2 font-semibold">{label}</label>
              <input
                type={type}
                defaultValue={value}
                disabled={disabled}
                className={`
                  rounded-xl bg-white/10 border border-white/30 px-4 py-3 placeholder-pink-300 text-white
                  focus:outline-none focus:ring-2 focus:ring-pink-500 transition
                  ${
                    disabled
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:border-pink-400"
                  }
                `}
              />
            </div>
          ))}
        </form>

        {/* Buttons */}
        <div className="flex justify-end gap-6 mt-12">
          <button className="px-7 py-3 rounded-xl bg-pink-700/40 hover:bg-pink-700/60 transition text-white font-semibold shadow-lg drop-shadow-md">
            Cancel
          </button>
          <button className="px-7 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 hover:brightness-110 transition text-white font-bold shadow-lg drop-shadow-lg">
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
