import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const INACTIVITY_LIMIT = 15 * 60 * 1000;

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  loginUser: () => {},
  logout: () => {},
  updateAvatar: () => {},
  updatingAvatar: false,
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
    case "UPDATE_AVATAR":
      return {
        ...state,
        user: state.user
          ? { ...state.user, avatar: action.payload.avatar }
          : state.user,
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
  const [loading, setLoading] = useState(true);

  const queryClient = useQueryClient(); // ⬅️ was missing
  const inactivityTimerRef = useRef(null);

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    localStorage.setItem("lastActivity", Date.now().toString());
    inactivityTimerRef.current = setTimeout(() => {
      logout();
      alert("You have been logged out due to inactivity.");
    }, INACTIVITY_LIMIT);
  };

  // Load current user
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
      credentials: "include",
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
      .catch(() => {})
      .finally(() => setLoading(false));
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

  // Avatar upload mutation
  const avatarMutation = useMutation({
    mutationFn: async (base64Image) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/upload-avatar`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId: authState.user._id , image: base64Image }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload avatar");
      return data;
    },
    onSuccess: (data) => {
      dispatch({ type: "UPDATE_AVATAR", payload: { avatar: data.avatar } });
      // Optional: invalidate any user query you might have elsewhere
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  function loginUser(user) {
    if (!user) return;
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
    });
  }

  const ctxValue = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    loading,
    updateAvatar: avatarMutation.mutate,
    updatingAvatar: avatarMutation.isLoading,
    loginUser,
    logout,
  };

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
