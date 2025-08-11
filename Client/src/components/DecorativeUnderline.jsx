const DecorativeUnderline = ({ linePosition }) => {
  return (
    <div
      className={`absolute -bottom-3 w-16 h-1 
             bg-gradient-to-r from-red-500 via-orange-400 to-red-500 
             rounded-full animate-gradient-move ${
               linePosition == "center"
                 ? "transform -translate-x-1/2 left-1/2"
                 : linePosition == "left" && "left-0"
             }`}
    ></div>
  );
};

export default DecorativeUnderline;
