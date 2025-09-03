import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import { showToast } from "../utils/toast.js";

const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes

export const AuthContext = createContext({
  isAuthenticated: false,
  loading: true, 
  isLoggedIn: false, 
  loginUser: () => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isAuthenticated: true };
    case "LOGOUT":
      return { ...state, isAuthenticated: false, };
    case "SET_AUTH":
      return { ...state, isAuthenticated: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  const inactivityTimerRef = useRef(null);
  const API = import.meta.env.VITE_API_BASE_URL;

  // --- Auth actions ---
  const loginUser = useCallback(() => {
    dispatch({ type: "LOGIN" });
    localStorage.setItem("lastActivity", Date.now().toString());
  }, []);

  const logout = useCallback(() => {
    axios
      .post(`${API}/api/auth/logout`, null, { withCredentials: true })
      .catch(() => {})
      .finally(() => {
        localStorage.removeItem("lastActivity");
        if (inactivityTimerRef.current)
          clearTimeout(inactivityTimerRef.current);
        dispatch({ type: "LOGOUT" });
        showToast("Logged out successfully", "success");
      });
  }, [API]);

  // --- Inactivity handling ---
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    localStorage.setItem("lastActivity", Date.now().toString());
    inactivityTimerRef.current = setTimeout(() => {
      logout();
      alert("You have been logged out due to inactivity.");
    }, INACTIVITY_LIMIT);
  }, [logout]);

  // --- Initial auth check on mount ---
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get(`${API}/api/auth/me`, {
          withCredentials: true,
        });
        if (!cancelled && data?.user) {
          dispatch({ type: "SET_AUTH", payload: true });
          if (!localStorage.getItem("lastActivity")) {
            localStorage.setItem("lastActivity", Date.now().toString());
          }
          resetInactivityTimer();
        } else {
          dispatch({ type: "SET_AUTH", payload: false });
        }
      } catch {
        dispatch({ type: "SET_AUTH", payload: false });
      } finally {
        if (!cancelled) {
          setTimeout(() => setLoading(false), 1000);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [API, resetInactivityTimer]);

  // --- Activity listeners only when authenticated ---
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetInactivityTimer));

    return () => {
      events.forEach((e) =>
        window.removeEventListener(e, resetInactivityTimer)
      );
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [state.isAuthenticated, resetInactivityTimer]);

  const ctxValue = useMemo(
    () => ({
      isAuthenticated: state.isAuthenticated,
      loading,
      loginUser,
      logout,
    }),
    [state.isAuthenticated, loading, loginUser, logout]
  );

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
