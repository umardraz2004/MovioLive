import { Link } from "react-router-dom";
const NavLink = ({ to, label, OnNavBtnClick }) => {
  return (
    <div>
      <Link
        to={to}
        onClick={OnNavBtnClick}
        className="relative group text-gray-700 dark:text-gray-200 font-WorkSans font-normal"
      >
        {label}
        <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
      </Link>
    </div>
  );
};

export default NavLink;
