// showToast.js
import toast from "./toastHelper";

export const showToast = (message, type = "success") => {
  const options = { id: "global-toast" };

  if (toast[type]) {
    toast[type](message, options); // success, error, info, loading
  } else {
    toast(message, options); // fallback
  }
};
