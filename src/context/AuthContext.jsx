import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const rehydrated = useRef(false); // ← prevent double-run

  useEffect(() => {
    if (rehydrated.current) return; // already ran once, stop
    rehydrated.current = true;

    const rehydrate = async () => {
      try {
        const { data: refreshData } = await authApi.refresh();
        window.__accessToken = refreshData.accessToken;
        const { data: userData } = await authApi.getMe();
        setUser(userData);
      } catch {
        window.__accessToken = null;
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    rehydrate();
  }, []); // ← empty array, runs once only

  const login = useCallback(async (email, password, isAdmin = false) => {
    const fn = isAdmin ? authApi.adminLogin : authApi.login;
    const { data } = await fn({ email, password });
    window.__accessToken = data.accessToken;
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (formData) => {
    const { data } = await authApi.register(formData);
    window.__accessToken = data.accessToken;
    setUser(data.user);
    return data.user;
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
