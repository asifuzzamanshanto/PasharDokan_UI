"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { clientApi } from "@/lib/client-api";

interface AuthUser {
  userId: string;
  email: string;
  isAuthenticated: boolean;
  name?: string;
  role?: string;
  shopId?: number;
  shopStatus?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "pashar_dokan_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.user) {
          setUser(parsed.user);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const me = await clientApi.auth.me();
      if (me.isAuthenticated) {
        const context = await clientApi.shop.context();
        setUser({
          userId: me.userId,
          email: me.email,
          isAuthenticated: true,
          role: context.ctx?.role,
          shopId: context.ctx?.shopId,
          shopStatus: context.ctx?.shopStatus,
        });
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await clientApi.auth.login({ email, password });
      if (result.ok) {
        const me = await clientApi.auth.me();
        const context = await clientApi.shop.context();
        
        const userData: AuthUser = {
          userId: me.userId,
          email: me.email,
          isAuthenticated: true,
          role: context.ctx?.role,
          shopId: context.ctx?.shopId,
          shopStatus: context.ctx?.shopStatus,
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userData }));
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await clientApi.auth.logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, hydrated, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}