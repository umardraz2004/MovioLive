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

  const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes

  export const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    loading: true,
    loginUser: () => {},
    logout: () => {},
    updateAvatar: async () => {},
    updatingAvatar: false,
  });

  function authReducer(state, action) {
    switch (action.type) {
      case "LOGIN":
        return { ...state, user: action.payload, isAuthenticated: true };
      case "LOGOUT":
        return { ...state, user: null, isAuthenticated: false };
      case "LOAD_USER":
        return {
          ...state,
          user: action.payload,
          isAuthenticated: !!action.payload,
        };
      case "UPDATE_AVATAR":
        return state.user
          ? { ...state, user: { ...state.user, avatar: action.payload } }
          : state;
      default:
        return state;
    }
  }

  export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, {
      user: null,
      isAuthenticated: false,
    });
    const [loading, setLoading] = useState(true);
    const [updatingAvatar, setUpdatingAvatar] = useState(false);

    const inactivityTimerRef = useRef(null);
    const API = import.meta.env.VITE_API_BASE_URL;

    // --- Auth actions (axios) ---

    const loginUser = useCallback((user) => {
      if (!user) return;
      dispatch({ type: "LOGIN", payload: user });
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
        });
    }, [API]);

    const updateAvatar = useCallback(
      async (base64Image) => {
        if (!state.user?._id) return;
        setUpdatingAvatar(true);
        try {
          const { data } = await axios.post(
            `${API}/api/users/upload-avatar`,
            { userId: state.user._id, image: base64Image },
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          );
          // Expecting { avatar: "url-or-id" }
          if (data?.avatar) {
            dispatch({ type: "UPDATE_AVATAR", payload: data.avatar });
          }
          return data;
        } catch (err) {
          // surface the error so caller can toast/notify
          throw err;
        } finally {
          setUpdatingAvatar(false);
        }
      },
      [API, state.user?._id]
    );

    // --- Inactivity handling ---

    const resetInactivityTimer = useCallback(() => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      localStorage.setItem("lastActivity", Date.now().toString());
      inactivityTimerRef.current = setTimeout(() => {
        logout();
        alert("You have been logged out due to inactivity.");
      }, INACTIVITY_LIMIT);
    }, [logout]);

    // --- Load current user once on mount ---

    useEffect(() => {
      let cancelled = false;
      (async () => {
        try {
          const { data } = await axios.get(`${API}/api/auth/me`, {
            withCredentials: true,
          });
          if (!cancelled && data?.user) {
            dispatch({ type: "LOAD_USER", payload: data.user });
            if (!localStorage.getItem("lastActivity")) {
              localStorage.setItem("lastActivity", Date.now().toString());
            }
            resetInactivityTimer();
          }
        } catch {
          // not logged in or request failed; keep user null
        } finally {
          if (!cancelled) {
            setTimeout(() => {
               setLoading(false);
            }, 1000);
          }
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [API, resetInactivityTimer]);

    // --- Wire up activity listeners only when authenticated ---

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
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading,
        loginUser,
        logout,
        updateAvatar,
        updatingAvatar,
      }),
      [
        state.user,
        state.isAuthenticated,
        loading,
        loginUser,
        logout,
        updateAvatar,
        updatingAvatar,
      ]
    );

    return (
      <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
    );
  }

  export const useAuth = () => useContext(AuthContext);
