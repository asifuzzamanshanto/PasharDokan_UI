// ── Role & Auth ──
export type UserRole = "platform_admin" | "owner" | "manager" | "seller";

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  shopId: string | null;
  avatar?: string;
  createdAt: string;
}

// ── Shop ──
export type ShopStatus = "pending" | "verified" | "active" | "suspended";

export interface Shop {
  id: string;
  name: string;
  nameBn: string;
  ownerName: string;
  ownerPhone: string;
  address: string;
  city: string;
  tradeLicenseNo: string;
  status: ShopStatus;
  appliedAt: string;
  verifiedAt: string | null;
  activatedAt: string | null;
  staffCount: number;
  totalSales: number;
  totalDue: number;
}

// ── Product ──
export interface Product {
  id: string;
  shopId: string;
  name: string;
  nameBn: string;
  sku: string;
  category: string;
  unit: string;
  costPrice: number;
  sellPrice: number;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Inventory ──
export type StockMovementType = "stock_in" | "stock_out" | "adjustment" | "return" | "sale";

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  performedBy: string;
  createdAt: string;
}

// ── POS / Invoice ──
export type PaymentStatus = "paid" | "partial_due" | "full_due";

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  shopId: string;
  invoiceNo: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  total: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
  customerId: string | null;
  customerName: string | null;
  customerPhone: string | null;
  soldBy: string;
  createdAt: string;
}

// ── Due / Baki ──
export type DueTransactionType = "sale" | "payment" | "adjustment";

export interface DueTransaction {
  id: string;
  customerId: string;
  type: DueTransactionType;
  amount: number;
  invoiceId: string | null;
  invoiceNo: string | null;
  note: string;
  performedBy: string;
  createdAt: string;
}

export interface DueCustomer {
  id: string;
  shopId: string;
  name: string;
  phone: string;
  address: string;
  totalDue: number;
  isOverdue: boolean;
  lastTransactionAt: string;
  createdAt: string;
}

// ── Dashboard Stats ──
export interface ShopDashboardStats {
  todaySales: number;
  totalSales: number;
  totalDue: number;
  lowStockCount: number;
  totalProducts: number;
  todayInvoiceCount: number;
  totalStaff: number;
  recentInvoices: Invoice[];
  topProducts: { name: string; quantity: number; revenue: number }[];
  lowStockProducts: Product[];
}

export interface AdminDashboardStats {
  totalShops: number;
  activeShops: number;
  pendingApplications: number;
  totalPlatformRevenue: number;
  suspendedShops: number;
}

// ── Navigation ──
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  roles: UserRole[];
  children?: NavItem[];
}
