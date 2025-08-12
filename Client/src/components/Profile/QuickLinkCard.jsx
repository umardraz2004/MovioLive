import { Link } from "react-router-dom";

const QuickLinkCard = ({ to, icon, label }) => {
  return (
    <Link
      to={to}
      className="flex flex-col items-center bg-white dark:bg-black p-6 rounded-lg shadow-md hover:shadow-lg transition"
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </Link>
  );
};

export default QuickLinkCard;
