import { UserRole, ShopStatus } from "@/types";

export type AuthUser = {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  shopId: string | null;
  shopName?: string;
  shopStatus?: ShopStatus;
  avatar?: string;
};

export type Session = {
  user: AuthUser;
  expires: string;
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  platform_admin: [
    "/admin/dashboard",
    "/admin/shops",
    "/admin/shops/:id",
    "/admin/audit",
  ],
  owner: [
    "/shop/dashboard",
    "/shop/pos",
    "/shop/products",
    "/shop/products/new",
    "/shop/products/:id/edit",
    "/shop/inventory",
    "/shop/inventory/stock-in",
    "/shop/inventory/stock-out",
    "/shop/inventory/returns",
    "/shop/inventory/adjustments",
    "/shop/inventory/history",
    "/shop/invoices",
    "/shop/invoices/:id",
    "/shop/due",
    "/shop/due/:customerId",
    "/shop/users",
    "/shop/reports",
    "/shop/settings",
  ],
  manager: [
    "/shop/dashboard",
    "/shop/pos",
    "/shop/products",
    "/shop/products/new",
    "/shop/products/:id/edit",
    "/shop/inventory",
    "/shop/inventory/stock-in",
    "/shop/inventory/stock-out",
    "/shop/inventory/returns",
    "/shop/inventory/adjustments",
    "/shop/inventory/history",
    "/shop/invoices",
    "/shop/invoices/:id",
    "/shop/due",
    "/shop/due/:customerId",
    "/shop/reports",
  ],
  seller: [
    "/shop/pos",
    "/shop/invoices",
    "/shop/invoices/:id",
    "/shop/due",
  ],
};

export const SHOP_STATUS_ACCESS: Record<ShopStatus, string[]> = {
  pending: [
    "/shop/dashboard",
  ],
  verified: [
    "/shop/dashboard",
    "/shop/pos",
    "/shop/products",
    "/shop/inventory",
    "/shop/invoices",
    "/shop/due",
    "/shop/reports",
  ],
  active: [
    "/shop/dashboard",
    "/shop/pos",
    "/shop/products",
    "/shop/products/new",
    "/shop/products/:id/edit",
    "/shop/inventory",
    "/shop/inventory/stock-in",
    "/shop/inventory/stock-out",
    "/shop/inventory/returns",
    "/shop/inventory/adjustments",
    "/shop/inventory/history",
    "/shop/invoices",
    "/shop/invoices/:id",
    "/shop/due",
    "/shop/due/:customerId",
    "/shop/users",
    "/shop/reports",
    "/shop/settings",
  ],
  suspended: [
    "/shop/dashboard",
  ],
};

export const PUBLIC_ROUTES = ["/", "/auth/signin", "/auth/register", "/apply", "/apply/status", "/permission-test"];

export const ADMIN_ROUTES = ["/admin/dashboard", "/admin/shops", "/admin/shops/:id", "/admin/audit"];

export const SHOP_ROUTES = ["/shop", "/shop/permission-check"];