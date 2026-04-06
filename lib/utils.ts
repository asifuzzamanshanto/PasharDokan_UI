import { UserRole, ShopStatus, PaymentStatus, StockMovementType, DueTransactionType } from "@/types";

// ── Formatting ──
export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-BD");
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}

// ── Role Labels ──
export const ROLE_LABELS: Record<UserRole, string> = {
  platform_admin: "Platform Admin",
  owner: "Shop Owner",
  manager: "Manager",
  seller: "Seller",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  platform_admin: "bg-violet-100 text-violet-800",
  owner: "bg-emerald-100 text-emerald-800",
  manager: "bg-blue-100 text-blue-800",
  seller: "bg-amber-100 text-amber-800",
};

// ── Shop Status ──
export const SHOP_STATUS_LABELS: Record<ShopStatus, string> = {
  pending: "Pending Review",
  verified: "Verified",
  active: "Active",
  suspended: "Suspended",
};

export const SHOP_STATUS_COLORS: Record<ShopStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  verified: "bg-blue-100 text-blue-800 border-blue-200",
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  suspended: "bg-red-100 text-red-800 border-red-200",
};

// ── Payment Status ──
export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: "Paid",
  partial_due: "Partial Due",
  full_due: "Full Due",
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  paid: "bg-emerald-100 text-emerald-800",
  partial_due: "bg-amber-100 text-amber-800",
  full_due: "bg-red-100 text-red-800",
};

// ── Stock Movement ──
export const MOVEMENT_TYPE_LABELS: Record<StockMovementType, string> = {
  stock_in: "Stock In",
  stock_out: "Stock Out",
  adjustment: "Adjustment",
  return: "Return",
  sale: "Sale",
};

export const MOVEMENT_TYPE_COLORS: Record<StockMovementType, string> = {
  stock_in: "bg-emerald-100 text-emerald-800",
  stock_out: "bg-red-100 text-red-800",
  adjustment: "bg-blue-100 text-blue-800",
  return: "bg-purple-100 text-purple-800",
  sale: "bg-amber-100 text-amber-800",
};

export const MOVEMENT_TYPE_ICONS: Record<StockMovementType, string> = {
  stock_in: "↗",
  stock_out: "↘",
  adjustment: "⟳",
  return: "↩",
  sale: "−",
};

// ── Due Transaction ──
export const DUE_TX_TYPE_LABELS: Record<DueTransactionType, string> = {
  sale: "Purchase (Due)",
  payment: "Payment Received",
  adjustment: "Adjustment",
};

export const DUE_TX_TYPE_COLORS: Record<DueTransactionType, string> = {
  sale: "text-red-600",
  payment: "text-emerald-600",
  adjustment: "text-blue-600",
};

// ── Navigation config ──
export const NAV_CONFIG: Record<string, { title: string; href: string; icon: string }[]> = {
  platform_admin: [
    { title: "Dashboard", href: "/admin/dashboard", icon: "layout-dashboard" },
    { title: "Shop Applications", href: "/admin/shops", icon: "store" },
    { title: "Audit Log", href: "/admin/audit", icon: "shield-check" },
  ],
  owner: [
    { title: "Dashboard", href: "/shop/dashboard", icon: "layout-dashboard" },
    { title: "POS Billing", href: "/shop/pos", icon: "calculator" },
    { title: "Products", href: "/shop/products", icon: "package" },
    { title: "Inventory", href: "/shop/inventory", icon: "warehouse" },
    { title: "Invoices", href: "/shop/invoices", icon: "receipt" },
    { title: "Due (Baki)", href: "/shop/due", icon: "book-open" },
    { title: "Staff", href: "/shop/users", icon: "users" },
    { title: "Reports", href: "/shop/reports", icon: "bar-chart-3" },
    { title: "Settings", href: "/shop/settings", icon: "settings" },
  ],
  manager: [
    { title: "Dashboard", href: "/shop/dashboard", icon: "layout-dashboard" },
    { title: "POS Billing", href: "/shop/pos", icon: "calculator" },
    { title: "Products", href: "/shop/products", icon: "package" },
    { title: "Inventory", href: "/shop/inventory", icon: "warehouse" },
    { title: "Invoices", href: "/shop/invoices", icon: "receipt" },
    { title: "Due (Baki)", href: "/shop/due", icon: "book-open" },
    { title: "Reports", href: "/shop/reports", icon: "bar-chart-3" },
  ],
  seller: [
    { title: "POS Billing", href: "/shop/pos", icon: "calculator" },
    { title: "My Invoices", href: "/shop/invoices", icon: "receipt" },
    { title: "Due Customers", href: "/shop/due", icon: "book-open" },
  ],
};

// ── Utilities ──
export function cn(...args: unknown[]): string {
  const result: string[] = [];
  for (const arg of args) {
    if (typeof arg === "string" && arg) result.push(arg);
  }
  return result.join(" ");
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getLowStockProducts(products: { stock: number; lowStockThreshold: number }[]): number {
  return products.filter((p) => p.stock <= p.lowStockThreshold).length;
}
