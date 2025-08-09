const HoverUnderLineButton = ({ onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className="relative group text-gray-700 dark:text-gray-200 focus:outline-none"
    >
      {label}
      <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
    </button>
  );
};

export default HoverUnderLineButton;
