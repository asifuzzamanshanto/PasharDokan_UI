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
  phone?: string;
  role?: string;
  shopId?: number;
  shopStatus?: string;
  shopName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  canAccessShop: (status?: string, path?: string) => boolean;
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
          phone: undefined,
          role: context.ctx?.role,
          shopId: context.ctx?.shopId,
          shopStatus: context.ctx?.shopStatus,
          shopName: context.ctx?.shopName,
        });
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await (clientApi.auth.login as any)({ email, password });
      if (result.ok) {
        const me = await clientApi.auth.me();
        const context = await clientApi.shop.context();
        
        const userData: AuthUser = {
          userId: me.userId,
          email: me.email,
          isAuthenticated: true,
          phone: undefined,
          role: context.ctx?.role,
          shopId: context.ctx?.shopId,
          shopStatus: context.ctx?.shopStatus,
          shopName: context.ctx?.shopName,
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

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    const role = user.role;
    const permissions: Record<string, string[]> = {
      platform_admin: ["manage_shops", "manage_users", "view_analytics", "manage_products", "manage_inventory", "manage_sales", "manage_dues"],
      owner: ["manage_products", "manage_inventory", "manage_sales", "manage_dues", "manage_users", "view_analytics"],
      manager: ["manage_products", "manage_inventory", "manage_sales", "manage_dues", "view_analytics"],
      seller: ["view_products", "create_sale", "view_sales"],
    };
    return permissions[role || ""]?.includes(permission) || false;
  }, [user]);

  const canAccessShop = useCallback((status?: string, path?: string): boolean => {
    if (status && path) {
      const statusAccess: Record<string, string[]> = {
        pending: ["/shop/dashboard"],
        verified: ["/shop/dashboard", "/shop/pos", "/shop/products", "/shop/inventory", "/shop/invoices", "/shop/due", "/shop/reports"],
        active: ["/shop/dashboard", "/shop/pos", "/shop/products", "/shop/products/new", "/shop/products/:id/edit", "/shop/inventory", "/shop/inventory/stock-in", "/shop/inventory/stock-out", "/shop/inventory/returns", "/shop/inventory/adjustments", "/shop/inventory/history", "/shop/invoices", "/shop/invoices/:id", "/shop/due", "/shop/due/:customerId", "/shop/users", "/shop/reports", "/shop/settings"],
        suspended: ["/shop/dashboard"],
      };
      return statusAccess[status]?.some(p => path.startsWith(p.replace(/:id.*$/, ""))) || false;
    }
    if (!user) return false;
    return user.shopStatus === "active" || user.shopStatus === "verified";
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, hydrated, login, logout, refreshUser, hasPermission, canAccessShop }}
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