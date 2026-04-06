"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import { mockApi } from "@/lib/api-mock";
import { Shop } from "@/types";
import { formatBDT, formatDate, SHOP_STATUS_LABELS } from "@/lib/utils";
import { ShopStatus } from "@/types";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function ShopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = params;
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.admin.getShops().then((res) => {
      const found = (res.shops as Shop[]).find((s) => s.id === id);
      setShop(found || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!shop) return;
    try {
      if (newStatus === "verified") {
        await mockApi.admin.approveShop(shop.id);
      } else if (newStatus === "suspended") {
        await mockApi.admin.rejectShop(shop.id);
      }
      setShop({ ...shop, status: newStatus as ShopStatus });
    } catch (error) {
      console.error("Status change failed:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-text-tertiary">Loading...</div>;
  }

  if (!shop) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title={shop.name}
        description={`${shop.nameBn} · ${shop.address}, ${shop.city}`}
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Shops", href: "/admin/shops" },
          { label: shop.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-4">
          <Card padding="lg">
            <h2 className="font-semibold text-sm text-text-primary mb-4">Shop Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-text-tertiary text-xs">Owner Name</p>
                <p className="font-medium text-text-primary">{shop.ownerName}</p>
              </div>
              <div>
                <p className="text-text-tertiary text-xs">Owner Phone</p>
                <p className="font-medium text-text-primary">{shop.ownerPhone}</p>
              </div>
              <div>
                <p className="text-text-tertiary text-xs">Address</p>
                <p className="font-medium text-text-primary">{shop.address}</p>
              </div>
              <div>
                <p className="text-text-tertiary text-xs">City</p>
                <p className="font-medium text-text-primary">{shop.city}</p>
              </div>
              <div>
                <p className="text-text-tertiary text-xs">Trade License</p>
                <p className="font-medium text-text-primary">{shop.tradeLicenseNo}</p>
              </div>
              <div>
                <p className="text-text-tertiary text-xs">Applied On</p>
                <p className="font-medium text-text-primary">{formatDate(shop.appliedAt)}</p>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card padding="lg">
            <h2 className="font-semibold text-sm text-text-primary mb-4">Verification Timeline</h2>
            <div className="space-y-4">
              {[
                { label: "Application Submitted", date: shop.appliedAt, done: true },
                { label: "Verified by Admin", date: shop.verifiedAt, done: !!shop.verifiedAt },
                { label: "Shop Activated", date: shop.activatedAt, done: !!shop.activatedAt },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${step.done ? "bg-primary-600 text-white" : "bg-surface-sunken text-text-tertiary border border-border"}`}>
                    {step.done ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    ) : (
                      <span className="text-[10px]">{i + 1}</span>
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${step.done ? "text-text-primary" : "text-text-tertiary"}`}>{step.label}</p>
                    {step.date && <p className="text-xs text-text-tertiary">{formatDate(step.date)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-4">
          <Card padding="lg">
            <h2 className="font-semibold text-sm text-text-primary mb-3">Status</h2>
            <Badge className={`border text-sm ${{
              pending: "bg-amber-50 text-amber-700 border-amber-200",
              verified: "bg-blue-50 text-blue-700 border-blue-200",
              active: "bg-emerald-50 text-emerald-700 border-emerald-200",
              suspended: "bg-red-50 text-red-700 border-red-200",
            }[shop.status]}`}>{SHOP_STATUS_LABELS[shop.status]}</Badge>
          </Card>

          <Card padding="lg">
            <h2 className="font-semibold text-sm text-text-primary mb-3">Actions</h2>
            <div className="space-y-2">
              {shop.status === "pending" && (
                <>
                  <Button className="w-full" size="sm" variant="success" onClick={() => handleStatusChange("verified")}>Verify Shop</Button>
                  <Button className="w-full" size="sm" variant="danger" onClick={() => handleStatusChange("suspended")}>Reject</Button>
                </>
              )}
              {shop.status === "verified" && (
                <Button className="w-full" size="sm" onClick={() => handleStatusChange("active")}>Activate Shop</Button>
              )}
              {shop.status === "active" && (
                <Button className="w-full" size="sm" variant="danger" onClick={() => handleStatusChange("suspended")}>Suspend Shop</Button>
              )}
              {shop.status === "suspended" && (
                <Button className="w-full" size="sm" variant="success" onClick={() => handleStatusChange("active")}>Reactivate Shop</Button>
              )}
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="font-semibold text-sm text-text-primary mb-3">Shop Stats</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Staff</span>
                <span className="font-medium">{shop.staffCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Total Sales</span>
                <span className="font-medium">{formatBDT(shop.totalSales)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Total Due</span>
                <span className="font-medium text-red-600">{formatBDT(shop.totalDue)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}