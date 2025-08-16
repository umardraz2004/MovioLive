import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "../store/AuthContext";
import Navbar from "../components/Navbar/Navbar";
import LoadingOverlay from "../components/LoadingOverlay";
import FooterSection from "../components/Footer/FooterSection";
import { useEffect } from "react";

const Root = () => {
  const { loading } = useAuth();
  const location = useLocation();
  const hideLoadingOnVerify = location.pathname.startsWith("/verify-email");
 
  return (
    <div className="flex flex-col">
      {!hideLoadingOnVerify && <LoadingOverlay loading={loading} />}
      <Navbar />
      <main className="flex-1 bg-gray-100 dark:bg-[#090909]">
        <Outlet />
        <Toaster
          position="bottom-left"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#0f172a",
              color: "#f8fafc",
              fontWeight: 500,
              fontSize: "0.9rem",
              padding: "12px 16px",
              borderRadius: "0.75rem",
              border: "1px solid #1e293b",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#f8fafc",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#f8fafc",
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
