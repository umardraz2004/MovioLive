import { useContext } from "react";
import { Toaster } from "react-hot-toast";
import { useAuth } from "../store/AuthContext";
import Navbar from "../components/Navbar/Navbar";
import ScrollToTop from "../components/ScrollToTop";
import { ThemeContext } from "../store/ThemeContext";
import { Outlet, useLocation } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";
import FooterSection from "../components/Footer/FooterSection";

const Root = () => {
  const { loading } = useAuth();
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const hideLoadingOnVerify = location.pathname.startsWith("/verify-email");

  return (
    <div className="flex flex-col">
      <ScrollToTop />
      {!hideLoadingOnVerify && <LoadingOverlay loading={loading} />}
      <Navbar />
      <main className="flex-1 bg-gray-100 dark:bg-[#090909]">
        <Outlet />
        <Toaster
          position="bottom-left"
          toastOptions={{
            duration: 3000,
            style: {
              fontWeight: 500,
              fontSize: "0.9rem",
              padding: "12px 16px",
              borderRadius: "0.75rem",
              border:
                theme === "dark" ? "1px solid #374151" : "1px solid #d1d5db",
              boxShadow:
                theme === "dark"
                  ? "0 4px 12px rgba(0,0,0,0.5)"
                  : "0 4px 12px rgba(0,0,0,0.15)",
              background: theme === "dark" ? "#090909" : "#ffffff",
              color: theme === "dark" ? "#f9fafb" : "#1f2937",
            },
            success: {
              iconTheme: {
                primary: "#22c55e", // green
                secondary: theme === "dark" ? "#1f2937" : "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444", // red
                secondary: theme === "dark" ? "#1f2937" : "#ffffff",
              },
            },
            info: {
              iconTheme: {
                primary: "#3b82f6", // blue
                secondary: theme === "dark" ? "#1f2937" : "#ffffff",
              },
            },
          }}
        />
      </main>
      <FooterSection />
    </div>
  );
};

export default Root;
