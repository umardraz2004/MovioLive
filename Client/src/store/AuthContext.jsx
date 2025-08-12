import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";
import { showToast } from "../utils/toast";

const INACTIVITY_LIMIT = 15 * 60 * 1000;

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loginUser: () => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload.user, isAuthenticated: true };
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false };
    case "LOAD_USER":
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [authState, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
  });

  const inactivityTimerRef = useRef(null);

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    localStorage.setItem("lastActivity", Date.now().toString());
    inactivityTimerRef.current = setTimeout(() => {
      logout();
      alert("You have been logged out due to inactivity.");
    }, INACTIVITY_LIMIT);
  };

  // Load user from API (cookie handled automatically by browser)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
      credentials: "include", // important: sends the cookie
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          dispatch({ type: "LOAD_USER", payload: { user: data.user } });

          if (!localStorage.getItem("lastActivity")) {
            localStorage.setItem("lastActivity", Date.now().toString());
          }
          resetInactivityTimer();
        }
      })
      .catch(() => {
        // not logged in or server error
      });
  }, []);

  useEffect(() => {
    if (authState.isAuthenticated) {
      const events = ["mousemove", "keydown", "click", "scroll"];
      events.forEach((event) =>
        window.addEventListener(event, resetInactivityTimer)
      );

      return () => {
        events.forEach((event) =>
          window.removeEventListener(event, resetInactivityTimer)
        );
        if (inactivityTimerRef.current)
          clearTimeout(inactivityTimerRef.current);
      };
    }
  }, [authState.isAuthenticated]);

  function loginUser(user) {
    console.log("before usee check");
    if (!user) return;
    console.log("after usee check");
    dispatch({ type: "LOGIN", payload: { user } });
    localStorage.setItem("lastActivity", Date.now().toString());
  }

  function logout() {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      localStorage.removeItem("lastActivity");
      clearTimeout(inactivityTimerRef.current);
      dispatch({ type: "LOGOUT" });
      window.location.reload();
    });
  }

  const ctxValue = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    loginUser,
    logout,
  };

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
