import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
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
          { withCredentials: true } // sends & stores cookie
        );

        if (cancelled) return;

        // Immediately log the user into AuthContext
        if (res.data?.user) {
          loginUser(res.data.user);
        }

        setStatus("✅ Email verified successfully! Redirecting...");
        navigate("/", { replace: true });
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
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-md w-full text-center bg-black border border-red-700 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-red-500">
          Email Verification
        </h1>
        <p className="mb-6 text-red-400">{status}</p>

        {!status.startsWith("Verifying") && !status.startsWith("✅") && (
          <Link
            to="/login"
            className="inline-block mt-4 text-red-500 hover:text-red-400 underline"
          >
            Back to Login
          </Link>
        )}
      </div>
    </div>
  );
}
