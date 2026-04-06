import {
  Product, Invoice, DueCustomer, DueTransaction, StockMovement,
  Shop, ShopDashboardStats, AdminDashboardStats,
} from "@/types";
import { SHOPS, PRODUCTS as ALL_PRODUCTS, STOCK_MOVEMENTS, INVOICES as ALL_INVOICES, DUE_CUSTOMERS as ALL_DUE_CUSTOMERS, DUE_TRANSACTIONS, SHOP_STATS, ADMIN_STATS } from "./mock-data";

export function getShops(): Shop[] {
  return SHOPS;
}

export function getShopById(id: string): Shop | undefined {
  return SHOPS.find(s => s.id === id);
}

export function getProducts(shopId: string | null): Product[] {
  if (!shopId) return [];
  return ALL_PRODUCTS.filter(p => p.shopId === shopId);
}

export function getProductById(shopId: string | null, productId: string): Product | undefined {
  if (!shopId) return undefined;
  return ALL_PRODUCTS.find(p => p.shopId === shopId && p.id === productId);
}

export function getStockMovements(shopId: string | null): StockMovement[] {
  if (!shopId) return [];
  const shopProducts = ALL_PRODUCTS.filter(p => p.shopId === shopId).map(p => p.id);
  return STOCK_MOVEMENTS.filter(sm => shopProducts.includes(sm.productId));
}

export function getInvoices(shopId: string | null): Invoice[] {
  if (!shopId) return [];
  return ALL_INVOICES.filter(inv => inv.shopId === shopId);
}

export function getInvoiceById(shopId: string | null, invoiceId: string): Invoice | undefined {
  if (!shopId) return undefined;
  return ALL_INVOICES.find(inv => inv.shopId === shopId && inv.id === invoiceId);
}

export function getDueCustomers(shopId: string | null): DueCustomer[] {
  if (!shopId) return [];
  return ALL_DUE_CUSTOMERS.filter(dc => dc.shopId === shopId);
}

export function getDueCustomerById(shopId: string | null, customerId: string): DueCustomer | undefined {
  if (!shopId) return undefined;
  return ALL_DUE_CUSTOMERS.find(dc => dc.shopId === shopId && dc.id === customerId);
}

export function getDueTransactions(shopId: string | null, customerId?: string): DueTransaction[] {
  if (!shopId) return [];
  const shopCustomers = ALL_DUE_CUSTOMERS.filter(dc => dc.shopId === shopId).map(dc => dc.id);
  let transactions = DUE_TRANSACTIONS.filter(dt => shopCustomers.includes(dt.customerId));
  if (customerId) {
    transactions = transactions.filter(dt => dt.customerId === customerId);
  }
  return transactions;
}

export function getShopStats(shopId: string | null): ShopDashboardStats | null {
  if (!shopId) return null;
  const products = getProducts(shopId);
  const invoices = getInvoices(shopId);
  const dueCustomers = getDueCustomers(shopId);
  
  const today = new Date().toISOString().split("T")[0];
  const todayInvoices = invoices.filter(inv => inv.createdAt.startsWith(today));
  
  const todaySales = todayInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalDue = dueCustomers.reduce((sum, dc) => sum + dc.totalDue, 0);
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);
  
  return {
    todaySales,
    totalSales: invoices.reduce((sum, inv) => sum + inv.total, 0),
    totalDue,
    lowStockCount: lowStockProducts.length,
    totalProducts: products.length,
    todayInvoiceCount: todayInvoices.length,
    totalStaff: 0,
    recentInvoices: invoices.slice(0, 5),
    topProducts: [],
    lowStockProducts,
  };
}

export function getAdminStats(): AdminDashboardStats {
  return ADMIN_STATS;
}
