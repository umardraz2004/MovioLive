import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../store/ThemeContext";
import NavLogo from "../assets/images/NavLogo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock for now
  const [isOrganizer, setIsOrganizer] = useState(false); // Mock role

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
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo + Brand Name */}
      <Link to="/" className="flex items-center">
        <img src={NavLogo} alt="nav logo" className="w-8" />
        <span className="ms-2 text-2xl font-WorkSans font-semibold text-gray-700 dark:text-white tracking-wide">
          MovioLive
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="space-x-6 flex items-center text-gray-700 dark:text-gray-200">
        <NavLink to="/" label="Home" />
        {!isLoggedIn && (
          <>
            <NavLink to="/login" label="Login" />
            <NavLink to="/register" label="Register" />
          </>
        )}
        {isLoggedIn && isOrganizer && (
          <NavLink to="/organizer" label="Dashboard" />
        )}
        {isLoggedIn && (
          <HoverUnderlineButton onClick={handleLogout} label="Logout" />
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="ml-4 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>
    </nav>
  );
};

// Reusable Link with Hover Underline
const NavLink = ({ to, label }) => (
  <Link to={to} className="relative group text-gray-700 dark:text-gray-200">
    {label}
    <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
  </Link>
);

// Reusable Button with Hover Underline
const HoverUnderlineButton = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="relative group text-gray-700 dark:text-gray-200 focus:outline-none"
  >
    {label}
    <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

export default Navbar;
