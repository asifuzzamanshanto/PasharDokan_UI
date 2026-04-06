"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { mockApi } from "@/lib/api-mock";
import { Shop, ShopStatus } from "@/types";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";

const statusTabs: { label: string; value: ShopStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Verified", value: "verified" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
];

export default function AdminShopsPage() {
  const [filter, setFilter] = useState<ShopStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    mockApi.admin.getShops().then((res) => {
      setShops(res.shops as Shop[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = shops.filter((s) => {
    const matchStatus = filter === "all" || s.status === filter;
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.ownerName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = shops.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await mockApi.admin.approveShop(id);
      setShops(shops.map(s => s.id === id ? { ...s, status: "verified" as ShopStatus } : s));
    } catch (e) { console.error(e); }
    setActionLoading(null);
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await mockApi.admin.rejectShop(id);
      setShops(shops.map(s => s.id === id ? { ...s, status: "suspended" as ShopStatus } : s));
    } catch (e) { console.error(e); }
    setActionLoading(null);
  };

  return (
    <div>
      <PageHeader title="Shop Applications" description="Review, verify, and manage all registered shops" />

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input placeholder="Search by shop name or owner..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                filter === tab.value
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-surface text-text-secondary border-border hover:border-border-strong"
              }`}
            >
              {tab.label} ({tab.value === "all" ? shops.length : counts[tab.value] || 0})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-sm text-text-tertiary">Loading shops...</div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No shops found" description="Try adjusting your search or filter" />
      ) : (
        <div className="space-y-3">
          {filtered.map((shop) => (
            <Card key={shop.id} padding="lg" hover>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm text-text-primary">{shop.name}</h3>
                    <span className="text-xs text-text-tertiary">{shop.nameBn}</span>
                  </div>
                  <p className="text-xs text-text-secondary">{shop.ownerName} · {shop.ownerPhone}</p>
                  <p className="text-xs text-text-tertiary mt-1">{shop.address}, {shop.city} · License: {shop.tradeLicenseNo}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`border ${{
                    pending: "bg-amber-50 text-amber-700 border-amber-200",
                    verified: "bg-blue-50 text-blue-700 border-blue-200",
                    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    suspended: "bg-red-50 text-red-700 border-red-200",
                  }[shop.status]}`}>{shop.status}</Badge>
                  {shop.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleReject(shop.id)} disabled={actionLoading === shop.id}>Reject</Button>
                      <Button size="sm" onClick={() => handleApprove(shop.id)} disabled={actionLoading === shop.id}>Approve</Button>
                    </div>
                  )}
                  <Link href={`/admin/shops/${shop.id}`}>
                    <Button size="sm" variant="outline">View Details</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}