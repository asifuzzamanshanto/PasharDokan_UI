"use client";

import Link from "next/link";
import Badge from "@/components/ui/Badge";

interface Shop {
  id: string;
  name: string;
  nameBn: string;
  city: string;
  status: string;
  appliedAt: string;
  verifiedAt: string | null;
}

const SHOPS: Shop[] = [
  { id: "s3", name: "Karim Bhai Shop", nameBn: "করিম ভাই শপ", city: "Dhaka", status: "pending", appliedAt: "2026-03-28", verifiedAt: null },
  { id: "s4", name: "Shapla Store", nameBn: "শাপলা স্টোর", city: "Dhaka", status: "verified", appliedAt: "2026-03-15", verifiedAt: "2026-03-20" },
];

const SHOP_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  verified: "Verified",
  active: "Active",
  suspended: "Suspended",
};

const SHOP_STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  verified: "bg-blue-50 text-blue-700 border-blue-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  suspended: "bg-red-50 text-red-700 border-red-200",
};

export default function ApplicationStatusPage() {
  const pendingShops = SHOPS.filter((s) => s.status === "pending" || s.status === "verified");

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-text-primary">Application Status</h1>
        <p className="text-sm text-text-secondary mt-1">Track your shop application progress</p>
      </div>

      <div className="space-y-4">
        {pendingShops.map((shop) => (
          <div key={shop.id} className="bg-surface rounded-xl border border-border shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-text-primary text-sm">{shop.name}</h3>
                <p className="text-xs text-text-tertiary mt-0.5">{shop.nameBn} · {shop.city}</p>
              </div>
              <Badge className={SHOP_STATUS_COLORS[shop.status]}>{SHOP_STATUS_LABELS[shop.status]}</Badge>
            </div>
            <div className="space-y-2 text-xs text-text-secondary">
              <div className="flex justify-between">
                <span>Applied</span>
                <span className="font-medium">{new Date(shop.appliedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
              </div>
              {shop.verifiedAt && (
                <div className="flex justify-between">
                  <span>Verified</span>
                  <span className="font-medium">{new Date(shop.verifiedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-4">
              {["Applied", "Verified", "Active"].map((step, i) => {
                const done = shop.status === "active" || (i === 0) || (i === 1 && shop.status === "verified");
                return (
                  <div key={step} className="flex items-center gap-2 flex-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${done ? "bg-primary-600 text-white" : "bg-surface-sunken text-text-tertiary border border-border"}`}>
                      {done ? "✓" : i + 1}
                    </div>
                    <span className={`text-xs ${done ? "text-text-primary font-medium" : "text-text-tertiary"}`}>{step}</span>
                    {i < 2 && <div className={`flex-1 h-px ${done ? "bg-primary-300" : "bg-border"}`} />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-sm text-text-tertiary hover:text-text-primary transition-colors">← Back to Home</Link>
      </div>
    </div>
  );
}