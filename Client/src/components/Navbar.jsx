import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../store/ThemeContext";
import { FiMenu, FiX } from "react-icons/fi";
import { LuSun } from "react-icons/lu";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import NavLogo from "../assets/images/NavLogo.png";
import NavMenu from "./NavMenu";

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("movioUser"));
    if (user) {
      setIsLoggedIn(true);
      setIsOrganizer(user.role === "organizer");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // lock background scroll while sidebar open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((s) => !s);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("movioUser");
    setIsLoggedIn(false);
    setIsOrganizer(false);
    navigate("/login");
    closeMenu();
  };

  return (
    <nav className={`sticky top-0 z-50`}>
      <div
        className={`w-full px-6 py-4 flex justify-between items-center
        transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] 
        ${
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
            isLoggedIn={isLoggedIn}
            isOrganizer={isOrganizer}
            handleLogout={handleLogout}
          />
          <ThemeToggleButton onClick={toggleTheme} theme={theme} />
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
            {/* Dimmed Background Overlay */}
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
              className="fixed top-0 right-0 w-72 h-full 
                   bg-white/90 dark:bg-black/90
                   shadow-2xl shadow-black/40
                   z-50 p-6 flex flex-col justify-between
                   rounded-l-2xl border-l border-gray-200 dark:border-gray-700"
            >
              {/* Navigation Links */}
              <div className="flex flex-col space-y-4">
                <NavMenu
                  isLoggedIn={isLoggedIn}
                  isOrganizer={isOrganizer}
                  handleLogout={handleLogout}
                  closeMenu={closeMenu}
                />
              </div>

              {/* Theme Switcher */}
              <div className="flex items-center justify-between border-t-2 pt-5 dark:border-white border-gray-800">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
                  Theme
                </span>
                <ThemeToggleButton
                  onClick={() => {
                    toggleTheme();
                    closeMenu();
                  }}
                  theme={theme}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ThemeToggleButton = ({ onClick, theme }) => (
  <button
    onClick={onClick}
    className="mx-2 text-xl transition-all text-gray-700 dark:text-gray-200 cursor-pointer"
  >
    {theme === "light" ? <BsFillMoonStarsFill /> : <LuSun />}
  </button>
);

export default Navbar;
