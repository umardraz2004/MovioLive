// toastHelper.js
import toast from "react-hot-toast";

toast.info = (message, options = {}) => {
  const theme = document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";

  toast(message, {
    ...options,
    icon: "ℹ️", // <-- this ensures an icon shows
    iconTheme: {
      primary: "#3b82f6", // blue
      secondary: theme === "dark" ? "#1f2937" : "#ffffff",
    },
  });
};

export default toast;
