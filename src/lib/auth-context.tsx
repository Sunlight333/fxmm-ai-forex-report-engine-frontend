"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth as authApi, user as userApi } from "@/lib/api";
import type { User } from "@/types/api";

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const u = await userApi.me();
      setUser(u);
    } catch {
      setUser(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const tokens = await authApi.login(email, password);
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    await fetchUser();
  };

  const register = async (email: string, password: string) => {
    const tokens = await authApi.register(email, password);
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
