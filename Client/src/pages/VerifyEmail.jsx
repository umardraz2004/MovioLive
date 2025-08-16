import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "../store/AuthContext";

const BASEURL = import.meta.env.VITE_API_BASE_URL;

export default function VerifyEmail() {
  const [status, setStatus] = useState("Verifying your email...");
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const token = params.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("❌ Missing or invalid verification token.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await axios.post(
          `${BASEURL}/api/auth/verify-email`,
          { token },
          { withCredentials: true }
        );

        if (cancelled) return;

        if (res.data?.user) {
          loginUser(res.data.user);
        }

        setStatus("✅ Email verified successfully! Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      } catch (e) {
        if (cancelled) return;
        const msg =
          e?.response?.data?.message ||
          "❌ Verification failed or the link has expired.";
        setStatus(msg);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate, token, loginUser]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-md w-full text-center rounded-2xl p-8 border 
                   bg-white/70 dark:bg-black/70 
                   border-gray-200 dark:border-red-600 
                   shadow-2xl backdrop-blur-lg"
      >
        {/* Heading */}
        <h1 className="text-3xl font-extrabold mb-4 text-red-600">
          Email Verification
        </h1>

        {/* Status */}
        <div className="mb-6">
          {status.startsWith("Verifying") ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="mx-auto mb-4 w-10 h-10 border-4 border-t-red-500 border-transparent rounded-full"
            ></motion.div>
          ) : null}
          <p className="text-gray-700 dark:text-red-300 font-medium tracking-wide">
            {status}
          </p>
        </div>

        {/* Back to login */}
        {!status.startsWith("Verifying") && !status.startsWith("✅") && (
          <Link
            to="/login"
            className="inline-block mt-4 px-6 py-2 rounded-full font-semibold text-sm 
                       bg-blue-500 text-white hover:bg-blue-600 
                       dark:bg-red-600 dark:hover:bg-red-500 
                       transition-all duration-300 shadow-md"
          >
            Back to Login
          </Link>
        )}
      </motion.div>
    </div>
  );
}
