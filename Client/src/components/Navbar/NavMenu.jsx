import NavLink from "./NavLink";

const NavMenu = ({ isLoggedIn, isOrganizer, closeMenu }) => {
  return (
    <>
      <NavLink to="/" label="Home" OnNavBtnClick={closeMenu} />
      {!isLoggedIn && (
        <>
          <NavLink to="/login" label="Login" OnNavBtnClick={closeMenu} />
          <NavLink to="/signup" label="Signup" OnNavBtnClick={closeMenu} />
        </>
      )}
      {isLoggedIn && isOrganizer && (
        <NavLink to="/events" label="Events" OnNavBtnClick={closeMenu} />
      )}
      <NavLink to="/contact" label="Contact us" OnNavBtnClick={closeMenu} />
    </>
  );
};

export default NavMenu;
