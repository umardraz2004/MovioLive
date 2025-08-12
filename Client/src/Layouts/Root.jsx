import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";
import FooterSection from "../components/Footer/FooterSection";

const Root = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-100 dark:bg-[#090909]">
        <Outlet />
        <Toaster
          position="bottom-left"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#0f172a", // slate-900
              color: "#f8fafc", // slate-50
              fontWeight: 500,
              fontSize: "0.9rem",
              padding: "12px 16px",
              borderRadius: "0.75rem",
              border: "1px solid #1e293b", // slate-800
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            },
            success: {
              iconTheme: {
                primary: "#22c55e", // green-500
                secondary: "#f8fafc",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444", // red-500
                secondary: "#f8fafc",
              },
            },
          }}
        />
      </main>
      {/* FOOTER */}
      <FooterSection />
    </div>
  );
};

export default Root;
