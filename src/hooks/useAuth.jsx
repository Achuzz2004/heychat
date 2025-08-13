import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setTokens, loadTokens } from "@/services/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTokens();
    (async () => {
      try {
        const me = await api("/api/auth/me/");
        setUser(me);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (username, password) => {
    const data = await api("/api/auth/login/", "POST", { username, password });
    setTokens(data.access, data.refresh);
    const me = await api("/api/auth/me/");
    setUser(me);
  };

  const register = async (username, password) => {
    const data = await api("/api/auth/register/", "POST", { username, password });
    setTokens(data.access, data.refresh);
    const me = await api("/api/auth/me/");
    setUser(me);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
