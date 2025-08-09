import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../store/ThemeContext";
import { FiMenu, FiX } from "react-icons/fi";
import { LuSun } from "react-icons/lu";
import { BsFillMoonStarsFill } from "react-icons/bs";
import NavLogo from "../assets/images/NavLogo.png";
import NavMenu from "./NavMenu";

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("movioUser"));
    if (user) {
      setIsLoggedIn(true);
      setIsOrganizer(user.role === "organizer");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("movioUser");
    setIsLoggedIn(false);
    setIsOrganizer(false);
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md px-6 py-4 flex justify-between items-center relative z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src={NavLogo} alt="nav logo" className="w-8" />
        <span className="ms-2 text-2xl font-WorkSans font-extrabold text-red-500 tracking-wide">
          MovioLive
        </span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 items-center text-gray-700 dark:text-gray-200">
        <NavMenu
          isLoggedIn={isLoggedIn}
          isOrganizer={isOrganizer}
          handleLogout={handleLogout}
        />

        {/* Theme Toggle */}
        <ThemeToggleButton onClick={toggleTheme} theme={theme} />
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-700 dark:text-gray-200 text-2xl"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <FiMenu />
      </button>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-80 backdrop-blur-sm z-40"
          onClick={closeMenu}
        ></div>
      )}

      {/* Sliding Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } z-50`}
      >
        {/* Close Button inside panel */}
        <div className="flex justify-end p-4 me-2 mt-1">
          <button
            onClick={closeMenu}
            className="text-3xl text-gray-700 dark:text-gray-200 hover:text-red-500 transition-colors"
          >
            <FiX />
          </button>
        </div>

        <div className="flex flex-col mt-4 px-6 py-4 space-y-6 text-lg">
          {/* Navigation Menu */}
          <div className="space-y-3">
            <NavMenu
              isLoggedIn={isLoggedIn}
              isOrganizer={isOrganizer}
              handleLogout={handleLogout}
              closeMenu={closeMenu}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300 dark:border-gray-600" />

          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
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
        </div>
      </div>
    </nav>
  );
};

const ThemeToggleButton = ({ onClick, theme }) => {
  return (
    <button
      onClick={onClick}
      className="mx-2 text-xl transition-all text-gray-700 dark:text-gray-200 cursor-pointer"
    >
      {theme === "light" ? <BsFillMoonStarsFill /> : <LuSun />}
    </button>
  );
};

export default Navbar;
