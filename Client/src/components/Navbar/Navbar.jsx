import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import NavLogo from "../../assets/images/NavLogo.png";
import NavMenu from "./NavMenu";
import { useAuth } from "../../store/AuthContext";
import UserAvatar from "./UserAvatar";
import { useUser } from "../../hooks/useUser";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { user } = useUser();
  // const isLoggedIn = !!user;
  const isOrganizer = user?.role === "organizer";

  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const avatarUrl = user?.avatar?.url;

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((s) => !s);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50">
      <div
        className={`w-full px-6 py-4 flex justify-between items-center transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          isSticky
            ? "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-md opacity-95"
            : "bg-white dark:bg-black opacity-100"
        }`}
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center text-2xl font-WorkSans font-extrabold text-red-600 tracking-wide"
        >
          <img src={NavLogo} alt="nav logo" className="w-8 me-2" />
          MovioLive
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-gray-700 dark:text-gray-200">
          <NavMenu
            isLoggedIn={isAuthenticated}
            isOrganizer={isOrganizer}
            handleLogout={logout}
          />
          {isAuthenticated && (
            <div className="flex">
              <div className="flex items-center me-5">
                <Link
                  to={"/prices"}
                  className="relative bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-lg font-medium text-sm transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-0.5 focus:outline-none group"
                >
                  Become an Organizer
                </Link>
              </div>
              <div className="flex items-center">
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="rounded-full border-2 border-red-500 outline-0"
                  aria-label="User Profile"
                  draggable={false}
                >
                  <UserAvatar avatar={avatarUrl} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 dark:text-gray-200 text-2xl"
            aria-label="Open menu"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay & Panel */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Dimmed Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 bg-gradient-to-b from-black/60 to-black/40 backdrop-blur-sm z-40"
              onClick={closeMenu}
            />

            {/* Sidebar */}
            <motion.div
              key="sidebar"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.25, 0.8, 0.25, 1] }}
              className="fixed top-0 right-0 w-72 h-full bg-white/90 dark:bg-black/90 shadow-2xl shadow-black/40 z-50 p-6 flex flex-col justify-between rounded-l-2xl border-l border-gray-200 dark:border-gray-700"
            >
              {/* Navigation Links */}
              <div className="flex flex-col space-y-4">
                <NavMenu
                  isLoggedIn={isAuthenticated}
                  isOrganizer={isOrganizer}
                  handleLogout={logout}
                  closeMenu={closeMenu}
                />
              </div>

              {/* User Profile Section */}
              {isAuthenticated && (
                <div className="flex items-center justify-between border-t-2 pt-5 border-gray-900 dark:border-white">
                  <div className="flex flex-col">
                    <span className="font-semibold font-WorkSans text-red-600 dark:text-white">
                      {user?.fullName || "Your Profile"}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Last active: {user?.lastActivity || "Just now"}
                    </span>
                  </div>
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="rounded-full border-2 border-red-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    aria-label="User Profile"
                    draggable={false}
                  >
                    <UserAvatar />
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
