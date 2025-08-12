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
    </>
  );
};

export default NavMenu;
