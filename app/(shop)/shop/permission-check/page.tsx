"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { ROLE_PERMISSIONS, SHOP_STATUS_ACCESS } from "@/lib/auth-types";
import { UserRole, ShopStatus } from "@/types";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

const ROLE_LABELS: Record<UserRole, string> = {
  platform_admin: "Platform Admin",
  owner: "Owner",
  manager: "Manager",
  seller: "Seller",
};

const STATUS_LABELS: Record<ShopStatus, string> = {
  pending: "Pending",
  verified: "Verified",
  active: "Active",
  suspended: "Suspended",
};

export default function PermissionCheckerPage() {
  const { user, hasPermission, canAccessShop } = useAuth();
  const [testPath, setTestPath] = useState("/shop/dashboard");
  const [pathResult, setPathResult] = useState<{hasPerm: boolean; statusOk: boolean; final: boolean} | null>(null);

  const currentRole = user?.role as UserRole || "owner";
  const currentStatus = user?.shopStatus as ShopStatus || "active";

  const allPaths = [
    ...ROLE_PERMISSIONS.platform_admin,
    ...ROLE_PERMISSIONS.owner,
  ];

  const uniquePaths = [...new Set(allPaths)];

  useEffect(() => {
    if (testPath) {
      const hp = hasPermission(testPath);
      const sa = canAccessShop(currentStatus, testPath);
      setPathResult({ hasPerm: hp, statusOk: sa, final: hp && sa });
    }
  }, [testPath, hasPermission, canAccessShop, currentStatus]);

  const displayUser = user || { shopName: "Demo Shop" };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-xl font-bold text-text-primary mb-1">Permission Checker</h1>
      <p className="text-sm text-text-secondary mb-6">Test if a path is accessible for your role and shop status</p>

      <Card padding="lg" className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <p className="text-xs text-text-tertiary mb-1">Your Role</p>
            <p className="font-medium text-text-primary">{ROLE_LABELS[currentRole]}</p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-text-tertiary mb-1">Shop Status</p>
            <p className="font-medium text-text-primary">{STATUS_LABELS[currentStatus]}</p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-text-tertiary mb-1">Shop</p>
            <p className="font-medium text-text-primary">{displayUser.shopName}</p>
          </div>
        </div>
      </Card>

      <Card padding="lg" className="mb-6">
        <h2 className="font-semibold text-sm text-text-primary mb-4">Test a Path</h2>
        <div className="flex gap-2">
          <Input
            value={testPath}
            onChange={(e) => setTestPath(e.target.value)}
            placeholder="/shop/dashboard"
            className="flex-1"
          />
        </div>
        {pathResult && (
          <div className="mt-4 flex items-center gap-4">
            <div className={`px-3 py-1 rounded text-sm ${pathResult.hasPerm ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
              hasPermission: {pathResult.hasPerm ? "✓" : "✗"}
            </div>
            <div className={`px-3 py-1 rounded text-sm ${pathResult.statusOk ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
              statusAllowed: {pathResult.statusOk ? "✓" : "✗"}
            </div>
            <div className={`px-3 py-1 rounded text-sm font-medium ${pathResult.final ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
              Final: {pathResult.final ? "✓ ACCESS" : "✗ DENIED"}
            </div>
          </div>
        )}
      </Card>

      <Card padding="lg">
        <h2 className="font-semibold text-sm text-text-primary mb-4">Paths You Can Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {uniquePaths.sort().map((path) => {
            const canAccess = hasPermission(path) && canAccessShop(currentStatus, path);
            return (
              <div
                key={path}
                className={`px-3 py-2 rounded text-xs font-mono ${
                  canAccess
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-surface-sunken text-text-tertiary"
                }`}
              >
                {path}
              </div>
            );
          })}
        </div>
      </Card>

      <Card padding="lg" className="mt-6">
        <h2 className="font-semibold text-sm text-text-primary mb-4">Paths You CANNOT Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {uniquePaths.sort().map((path) => {
            const canAccess = hasPermission(path) && canAccessShop(currentStatus, path);
            if (canAccess) return null;
            return (
              <div
                key={path}
                className="px-3 py-2 rounded text-xs font-mono bg-red-50 text-red-600 border border-red-100"
              >
                {path}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}