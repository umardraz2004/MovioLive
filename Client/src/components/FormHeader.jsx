import NavLogo from "../assets/images/NavLogo.png";

const FormHeader = ({ title, subtitle, showLogo = true }) => {
  return (
    <div className="flex flex-col items-center">
      {showLogo && <img src={NavLogo} alt="Logo" className="w-12 h-12 mb-2" />}
      <h1 className="text-2xl font-semibold text-gray-600 dark:text-white tracking-wider font-Lobster">
        {title}
      </h1>
      <p className="text-gray-500 font-semibold dark:text-gray-400 text-sm mt-1 font-sans">
        {subtitle}
      </p>
    </div>
  );
};

export default FormHeader;
