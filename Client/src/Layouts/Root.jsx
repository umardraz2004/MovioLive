import { Link, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Root = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-100 dark:bg-[#060606]">
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
      <footer className="bg-gray-900 text-gray-300 relative overflow-hidden">
        {/* Gradient top border */}
        <div className="absolute top-0 left-0 w-full h-[5px] bg-gradient-to-r from-blue-500 via-red-500 to-purple-500 animate-gradient-move"></div>

        <div className="container mx-auto px-6 lg:px-12 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo Section */}
          <div>
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 flex items-center justify-center text-white font-bold animate-pulse-slow">
                ML
              </div>
              <div>
                <div className="font-bold text-white text-lg">MovioLive</div>
                <div className="text-sm text-gray-400">
                  Live cinema experiences, simplified.
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold mb-4 text-white">Quick Links</h5>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", to: "/" },
                { label: "Features", to: "/features" },
                { label: "About", to: "/about" },
                { label: "Contact", to: "/contact" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="hover:text-white hover:pl-1 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h5 className="font-semibold mb-4 text-white">Help</h5>
            <ul className="space-y-2 text-sm">
              {[
                { label: "FAQ", to: "/faq" },
                { label: "Support", to: "/support" },
                { label: "Terms", to: "/terms" },
                { label: "Privacy", to: "/privacy" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="hover:text-white hover:pl-1 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h5 className="font-semibold mb-4 text-white">Follow</h5>
            <div className="flex gap-4 text-xl">
              {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map(
                (Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="hover:text-white transition-colors duration-200 hover:scale-110"
                  >
                    <Icon />
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} MovioLive. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Root;
