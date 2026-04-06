"use client";

import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ShopStatus } from "@/types";

interface ShopStatusGuardProps {
  children: React.ReactNode;
}

const STATUS_MESSAGES: Record<ShopStatus, { title: string; message: string }> = {
  pending: {
    title: "Pending Verification",
    message: "Your shop application is under review. You will be notified once verification is complete.",
  },
  verified: {
    title: "Activation Required",
    message: "Your shop has been verified but not yet activated. Please contact platform support.",
  },
  active: {
    title: "Shop Active",
    message: "Your shop is active and ready to use.",
  },
  suspended: {
    title: "Shop Suspended",
    message: "Your shop account has been suspended. Please contact platform support for assistance.",
  },
};

export function ShopStatusGuard({ children }: ShopStatusGuardProps) {
  const { user, canAccessShop } = useAuth();
  const pathname = usePathname();

  if (!user || user.role === "platform_admin") {
    return <>{children}</>;
  }

  const shopStatus = user.shopStatus as ShopStatus;
  const canAccess = canAccessShop(shopStatus, pathname);

  if (!canAccess) {
    const statusInfo = STATUS_MESSAGES[shopStatus];
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            shopStatus === "pending" ? "bg-amber-100" :
            shopStatus === "suspended" ? "bg-red-100" :
            "bg-blue-100"
          }`}>
            {shopStatus === "pending" && <span className="text-2xl">⏳</span>}
            {shopStatus === "suspended" && <span className="text-2xl">🚫</span>}
            {shopStatus === "verified" && <span className="text-2xl">⚠️</span>}
          </div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">{statusInfo.title}</h2>
          <p className="text-sm text-text-secondary">{statusInfo.message}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
