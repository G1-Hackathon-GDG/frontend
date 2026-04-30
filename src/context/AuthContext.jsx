import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { authApi } from "../api/authApi";

const BASE = "https://fuelpass-r2ha.onrender.com/api";
const AuthContext = createContext();

function readToken(data) {
  return data?.accessToken || data?.token || data?.jwt || null;
}

function readUser(data) {
  return data?.user || data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const rehydrated = useRef(false);

  useEffect(() => {
    if (rehydrated.current) return;
    rehydrated.current = true;

    const rehydrate = async () => {
      try {
        // Optional cookie-based refresh support. If the backend does not expose
        // this route, the app simply starts unauthenticated without redirecting.
        const { data: refreshData } = await axios.post(
          `${BASE}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        window.__accessToken = readToken(refreshData);
        if (!window.__accessToken) throw new Error("Missing access token");

        const { data: userData } = await authApi.getMe();
        setUser(readUser(userData));
      } catch {
        window.__accessToken = null;
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    rehydrate();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener("fuelpass:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("fuelpass:unauthorized", handleUnauthorized);
  }, []);

  const login = useCallback(async (email, password, isAdmin = false) => {
    const fn = isAdmin ? authApi.adminLogin : authApi.login;
    const { data } = await fn({ email, password });
    const token = readToken(data);
    const nextUser = readUser(data);
    if (!token || !nextUser) throw new Error("Invalid login response");
    window.__accessToken = token;
    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback(async (formData) => {
    const { data } = await authApi.register(formData);
    const token = readToken(data);
    const nextUser = readUser(data);
    if (!token || !nextUser) throw new Error("Invalid registration response");
    window.__accessToken = token;
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    window.__accessToken = null;
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
