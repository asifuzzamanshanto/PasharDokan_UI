"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { clientApi } from "@/lib/client-api";
import { formatBDT, formatDateTime } from "@/lib/utils";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";

interface Product {
  productId: number;
  name: string;
  barcode: string;
  sellPricePaisa: number;
  isActive: boolean;
  currentQty: number;
  costPricePaisa?: number;
  category?: string;
  unit?: string;
  lowStockThreshold?: number;
}

interface SaleItem {
  productId: number;
  productName: string;
  qty: number;
  unitPricePaisa: number;
  totalPaisa: number;
}

interface Sale {
  saleId: number;
  totalPaisa: number;
  createdAt: string;
  items: SaleItem[];
  invoiceNo?: string;
  subtotal?: number;
  discount?: number;
  paidAmount?: number;
  dueAmount?: number;
  paymentStatus?: string;
  customerName?: string | null;
  customerPhone?: string | null;
}

interface DueCustomer {
  id: string;
  name: string;
  phoneNumber: string;
  totalDueRemaining: number;
  address: string;
}

interface ShopContext {
  hasShop: boolean;
  ctx: {
    shopId: number;
    role: string;
    shopStatus: string;
    canCreateDue: boolean;
    canCollectDue: boolean;
  };
}

export default function ShopDashboard() {
  const { user, hasPermission } = useAuth();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [dueCustomers, setDueCustomers] = useState<DueCustomer[]>([]);
  const [shopContext, setShopContext] = useState<ShopContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const canAccessPOS = hasPermission("/shop/pos");
  const canAccessProducts = hasPermission("/shop/products");
  const canAccessInventory = hasPermission("/shop/inventory");
  const canAccessDue = hasPermission("/shop/due");
  const canAccessUsers = hasPermission("/shop/users");
  const canAccessReports = hasPermission("/shop/reports");
  const canAccessSettings = hasPermission("/shop/settings");

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, salesRes, dueRes, contextRes] = await Promise.all([
          clientApi.products.list(),
          clientApi.sales.list(),
          clientApi.due.getCustomers(user?.shopId || 1),
          clientApi.shop.context(),
        ]);
        setProducts(productsRes as Product[]);
        setSales(salesRes as Sale[]);
        setDueCustomers((dueRes as { customers: DueCustomer[] }).customers);
        setShopContext(contextRes as ShopContext);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    
    if (user?.shopId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user?.shopId]);

  const lowStock = products.filter((p) => p.currentQty > 0 && p.currentQty <= (p.lowStockThreshold || 50));
  
  const today = new Date().toISOString().split("T")[0];
  const todaySales = sales.filter(sale => sale.createdAt.startsWith(today));
  const todayTotal = todaySales.reduce((sum, sale) => sum + sale.totalPaisa, 0);
  const totalDue = dueCustomers.reduce((sum, dc) => sum + dc.totalDueRemaining, 0);

  const shopStatus = shopContext?.ctx?.shopStatus || user?.shopStatus || "unknown";

  if (shopStatus === "SUSPENDED") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Shop Suspended</h2>
          <p className="text-sm text-text-secondary mb-4">
            Your shop account has been suspended by the platform admin. Please contact support for more information.
          </p>
          <a href="mailto:support@pashardokan.com" className="text-sm text-primary-600 font-medium hover:underline">
            Contact Support →
          </a>
        </div>
      </div>
    );
  }

  if (shopStatus === "PENDING") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Pending Verification</h2>
          <p className="text-sm text-text-secondary mb-4">
            Your shop application is under review. You will be notified once verification is complete.
          </p>
          <a href="/apply/status" className="text-sm text-primary-600 font-medium hover:underline">
            Check Application Status →
          </a>
        </div>
      </div>
    );
  }

  if (shopStatus === "VERIFIED") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Shop Verified</h2>
          <p className="text-sm text-text-secondary mb-4">
            Your shop has been verified! You can now access POS, products, inventory, and more features.
          </p>
          <Link href="/shop/pos" className="text-sm text-primary-600 font-medium hover:underline">
            Start Selling →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user?.email || 'User'}. Here is today's overview.`}
        actions={
          canAccessPOS ? (
            <Link href="/shop/pos" className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Z" /></svg>
              New Sale
            </Link>
          ) : null
        }
      />

      {loading ? (
        <div className="text-center py-8 text-sm text-text-tertiary">Loading dashboard...</div>
      ) : error ? (
        <div className="text-center py-8 text-sm text-red-600">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="Today Sales" value={formatBDT(todayTotal)} subtitle={`${todaySales.length} invoices`} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>} accent="emerald" />
            {canAccessDue && <StatCard title="Total Due" value={formatBDT(totalDue)} subtitle={`${dueCustomers.length} customers`} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>} accent="amber" />}
            {canAccessProducts && <StatCard title="Products" value={products.length.toString()} subtitle={`${lowStock.length} low stock`} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>} accent="blue" />}
            {canAccessUsers && <StatCard title="Staff" value="-" subtitle="active members" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>} accent="slate" />}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card padding="none" className="overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-semibold text-sm text-text-primary">Recent Sales</h2>
                {canAccessPOS && <Link href="/shop/invoices" className="text-xs font-medium text-primary-600 hover:underline">View All →</Link>}
              </div>
              <div className="divide-y divide-border">
                {sales.slice(0, 4).map((sale) => (
                  <div key={sale.saleId} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{sale.invoiceNo || `Sale #${sale.saleId}`}</p>
                      <p className="text-xs text-text-tertiary">{sale.customerName || "Walk-in"} · {formatDateTime(sale.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-text-primary">{formatBDT(sale.totalPaisa)}</p>
                      <Badge variant="success" size="sm">Completed</Badge>
                    </div>
                  </div>
                ))}
                {sales.length === 0 && (
                  <div className="p-4 text-center text-sm text-text-tertiary">No sales yet</div>
                )}
              </div>
            </Card>

            <Card padding="none" className="overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-semibold text-sm text-text-primary">
                  Low Stock Alerts
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-red-100 text-red-700 rounded-full">{lowStock.length}</span>
                </h2>
                {canAccessInventory && <Link href="/shop/inventory" className="text-xs font-medium text-primary-600 hover:underline">Manage →</Link>}
              </div>
              <div className="divide-y divide-border">
                {lowStock.slice(0, 4).map((p) => (
                  <div key={p.productId} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{p.name}</p>
                      <p className="text-xs text-text-tertiary">{p.category}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${p.currentQty === 0 ? "text-red-600" : "text-amber-600"}`}>
                        {p.currentQty} {p.unit || "units"}
                      </p>
                      <p className="text-[11px] text-text-tertiary">min: {p.lowStockThreshold || 50}</p>
                    </div>
                  </div>
                ))}
                {lowStock.length === 0 && (
                  <div className="p-4 text-center text-sm text-text-tertiary">All products in stock</div>
                )}
              </div>
            </Card>
          </div>

          <Card padding="lg" className="mt-6">
            <h2 className="font-semibold text-sm text-text-primary mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {canAccessPOS && (
                <Link href="/shop/pos" className="flex flex-col items-center gap-2 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Z" />
                  </svg>
                  <span className="text-sm font-medium text-primary-700">POS / Sale</span>
                </Link>
              )}
              {canAccessProducts && (
                <Link href="/shop/products" className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5" />
                  </svg>
                  <span className="text-sm font-medium text-blue-700">Products</span>
                </Link>
              )}
              {canAccessDue && (
                <Link href="/shop/due" className="flex flex-col items-center gap-2 p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span className="text-sm font-medium text-amber-700">Due Collection</span>
                </Link>
              )}
              {canAccessReports && (
                <Link href="/shop/reports" className="flex flex-col items-center gap-2 p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                  <span className="text-sm font-medium text-emerald-700">Reports</span>
                </Link>
              )}
              {canAccessInventory && (
                <Link href="/shop/inventory" className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                  <span className="text-sm font-medium text-purple-700">Inventory</span>
                </Link>
              )}
              {canAccessUsers && (
                <Link href="/shop/users" className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-700">Staff</span>
                </Link>
              )}
              {canAccessSettings && (
                <Link href="/shop/settings" className="flex flex-col items-center gap-2 p-4 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors">
                  <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  <span className="text-sm font-medium text-rose-700">Settings</span>
                </Link>
              )}
            </div>
          </Card>

          <div className="mt-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-4 border border-primary-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Logged in as: <span className="text-primary-700">{user?.email}</span>
                </p>
                <p className="text-xs text-text-tertiary">
                  Role: {user?.role || "Unknown"} | Shop ID: {user?.shopId || "N/A"}
                </p>
              </div>
              <div className="flex gap-2">
                {canAccessPOS && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">POS</span>}
                {canAccessProducts && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Products</span>}
                {canAccessInventory && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Inventory</span>}
                {canAccessDue && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Due</span>}
                {canAccessUsers && <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">Staff</span>}
                {canAccessReports && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Reports</span>}
                {canAccessSettings && <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded">Settings</span>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}