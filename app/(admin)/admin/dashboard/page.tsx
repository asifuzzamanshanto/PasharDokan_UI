"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatBDT, formatDateTime } from "@/lib/utils";
import { clientApi } from "@/lib/client-api";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";

interface DashboardStats {
  totalShops: number;
  activeShops: number;
  pendingApplications: number;
  suspendedShops: number;
  totalPlatformRevenue: number;
}

interface ShopApplication {
  applicationId: number;
  shopName: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  address: string;
  createdAt: string;
}

interface Shop {
  shopId: number;
  shopName: string;
  ownerName: string;
  ownerPhone: string;
  address: string;
  verifiedAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [applications, setApplications] = useState<ShopApplication[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      clientApi.admin.getDashboard(),
      clientApi.admin.getShopApplications(),
      clientApi.admin.getShops()
    ]).then(([statsRes, appsRes, shopsRes]) => {
      setStats(statsRes as DashboardStats);
      setApplications(appsRes as ShopApplication[]);
      setShops(shopsRes as Shop[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      await clientApi.admin.approveShop(id);
      setApplications(prev => prev.filter(a => a.applicationId !== id));
    } catch (error) {
      console.error("Failed to approve:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    try {
      await clientApi.admin.rejectShop(id);
      setApplications(prev => prev.filter(a => a.applicationId !== id));
    } catch (error) {
      console.error("Failed to reject:", error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <PageHeader title="Platform Dashboard" description="Monitor platform health, shop applications, and operations" />

      {loading ? (
        <div className="text-center py-8 text-sm text-text-tertiary">Loading dashboard...</div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Shops" value={stats.totalShops.toString()} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" /></svg>} accent="slate" />
            <StatCard title="Active Shops" value={stats.activeShops.toString()} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>} accent="emerald" />
            <StatCard title="Pending Applications" value={stats.pendingApplications.toString()} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>} accent="amber" />
            <StatCard title="Platform Revenue" value={formatBDT(stats.totalPlatformRevenue)} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>} accent="blue" />
          </div>

          <Card padding="none" className="overflow-hidden mb-8">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-sm text-text-primary">Pending Applications</h2>
              <span className="text-xs text-text-tertiary">{applications.length} pending</span>
            </div>
            {applications.length === 0 ? (
              <div className="p-8 text-center text-sm text-text-tertiary">No pending applications</div>
            ) : (
              <div className="divide-y divide-border">
                {applications.map((app) => (
                  <div key={app.applicationId} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{app.shopName}</p>
                      <p className="text-xs text-text-tertiary">{app.ownerName} · {app.ownerPhone} · {app.address}</p>
                      <p className="text-xs text-text-tertiary">Applied {formatDateTime(app.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="warning">Pending</Badge>
                      <button
                        onClick={() => handleApprove(app.applicationId)}
                        disabled={actionLoading === app.applicationId}
                        className="text-xs font-medium text-emerald-600 hover:underline disabled:opacity-50"
                      >
                        {actionLoading === app.applicationId ? "Loading..." : "Approve"}
                      </button>
                      <button
                        onClick={() => handleReject(app.applicationId)}
                        disabled={actionLoading === app.applicationId}
                        className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card padding="none" className="overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-sm text-text-primary">All Shops</h2>
              <Link href="/admin/shops" className="text-xs font-medium text-primary-600 hover:underline">Manage →</Link>
            </div>
            <div className="divide-y divide-border">
              {shops.map((shop) => (
                <div key={shop.shopId} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{shop.shopName}</p>
                    <p className="text-xs text-text-tertiary">{shop.ownerName} · {shop.ownerPhone} · {shop.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {shop.verifiedAt ? (
                      <Badge variant="success">Verified</Badge>
                    ) : (
                      <Badge variant="warning">Pending</Badge>
                    )}
                    <Link href={`/admin/shops/${shop.shopId}`} className="text-xs font-medium text-primary-600 hover:underline">View</Link>
                  </div>
                </div>
              ))}
              {shops.length === 0 && (
                <div className="p-8 text-center text-sm text-text-tertiary">No shops yet</div>
              )}
            </div>
          </Card>
        </>
      ) : (
        <div className="text-center py-8 text-sm text-text-tertiary">Failed to load dashboard</div>
      )}
    </div>
  );
}