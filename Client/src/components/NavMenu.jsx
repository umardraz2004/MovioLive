import NavLink from "./NavLink";
import HoverUnderlineButton from "./HoverUnderLineButton";
import { Link } from "react-router-dom";
const user = {
  name: "John Doe",
  email: "john@example.com",
  role: "Organizer",
  avatar: "https://i.pravatar.cc/150?img=12",
  joined: "March 2024",
};
const NavMenu = ({ isLoggedIn, isOrganizer, handleLogout, closeMenu }) => {
  return (
    <>
      <NavLink to="/" label="Home" OnNavBtnClick={closeMenu} />
      <NavLink to="/contact" label="Contact us" OnNavBtnClick={closeMenu} />
      {!isLoggedIn && (
        <>
          <NavLink to="/login" label="Login" OnNavBtnClick={closeMenu} />
          <NavLink to="/signup" label="Signup" OnNavBtnClick={closeMenu} />
        </>
      )}
      {isLoggedIn && isOrganizer && (
        <NavLink to="/organizer" label="Dashboard" OnNavBtnClick={closeMenu} />
      )}
      {isLoggedIn && (
        <HoverUnderlineButton onClick={handleLogout} label="Logout" />
      )}
      <Link
        to="/profile"
        className="flex items-center rounded-full border-2 border-red-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        aria-label="User Profile"
        draggable={false}
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      </Link>
    </>
  );
};

export default NavMenu;
