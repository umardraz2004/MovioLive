import { Link } from "react-router-dom";

const FormFooterLink = ({ to, title , text }) => {
  return (
    <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
      {`${text} `}
      <Link to={to} className="text-red-500 hover:underline font-medium">
        {title}
      </Link>
    </div>
  );
};

export default FormFooterLink;
