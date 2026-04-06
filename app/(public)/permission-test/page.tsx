"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ROLE_PERMISSIONS, SHOP_STATUS_ACCESS } from "@/lib/auth-types";
import { UserRole, ShopStatus } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const ROLE_LABELS: Record<UserRole, string> = {
  platform_admin: "Platform Admin",
  owner: "Shop Owner",
  manager: "Manager",
  seller: "Seller",
};

const SHOP_STATUS_LABELS: Record<ShopStatus, string> = {
  pending: "Pending",
  verified: "Verified",
  active: "Active",
  suspended: "Suspended",
};

const ALL_SHOP_PATHS = [
  "/shop/dashboard",
  "/shop/pos",
  "/shop/products",
  "/shop/products/new",
  "/shop/products/p1/edit",
  "/shop/inventory",
  "/shop/inventory/stock-in",
  "/shop/inventory/adjustments",
  "/shop/inventory/returns",
  "/shop/inventory/history",
  "/shop/invoices",
  "/shop/invoices/inv1",
  "/shop/due",
  "/shop/due/dc1",
  "/shop/users",
  "/shop/reports",
  "/shop/settings",
];

const ADMIN_PATHS = [
  "/admin/dashboard",
  "/admin/shops",
  "/admin/shops/s1",
  "/admin/audit",
];

export default function PermissionTestPage() {
  const { user, hasPermission, canAccessShop } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [selectedStatus, setSelectedStatus] = useState<ShopStatus>("active");

  const currentUserRole = user?.role as UserRole || "owner";
  const currentUserStatus = user?.shopStatus as ShopStatus || "active";

  const roles: UserRole[] = ["platform_admin", "owner", "manager", "seller"];
  const statuses: ShopStatus[] = ["pending", "verified", "active", "suspended"];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-text-primary mb-2">Permission Test Panel</h1>
      <p className="text-sm text-text-secondary mb-8">
        Test role-based access control and shop status restrictions
      </p>

      {!user ? (
        <Card padding="lg">
          <p className="text-center text-text-secondary">
            Please <a href="/auth/signin" className="text-primary-600 hover:underline">sign in</a> first to test permissions
          </p>
        </Card>
      ) : (
        <>
          {/* Current User Info */}
          <Card padding="lg" className="mb-6">
            <h2 className="font-semibold text-sm text-text-primary mb-4">Current Logged In User</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-text-tertiary">Name</p>
                <p className="text-sm font-medium text-text-primary">{user?.name || "Demo User"}</p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary">Role</p>
                <p className="text-sm font-medium text-text-primary">{ROLE_LABELS[currentUserRole]}</p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary">Shop</p>
                <p className="text-sm font-medium text-text-primary">{user?.shopName || "Demo Shop"}</p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary">Status</p>
                <p className="text-sm font-medium text-text-primary">{user?.shopStatus ? SHOP_STATUS_LABELS[user.shopStatus as ShopStatus] : "Active"}</p>
              </div>
            </div>
          </Card>

          {/* Permission Test Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Role-Based Permissions */}
            <Card padding="lg">
              <h2 className="font-semibold text-sm text-text-primary mb-4">Role-Based Permissions (hasPermission)</h2>
              <div className="space-y-3">
                {roles.map((role) => (
                  <div key={role} className="border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-text-primary">{ROLE_LABELS[role]}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${role === currentUserRole ? "bg-primary-100 text-primary-700" : "bg-surface-sunken text-text-tertiary"}`}>
                        {role === currentUserRole ? "Current" : `Has ${ROLE_PERMISSIONS[role]?.length || 0} routes`}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {ROLE_PERMISSIONS[role]?.map((path) => (
                        <span
                          key={path}
                          className={`text-[10px] px-1.5 py-0.5 rounded ${
                            hasPermission(path) && role === currentUserRole
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-surface-sunken text-text-tertiary"
                          }`}
                        >
                          {path}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Shop Status Access */}
            <Card padding="lg">
              <h2 className="font-semibold text-sm text-text-primary mb-4">Shop Status Access (canAccessShop)</h2>
              <div className="mb-4">
                <label className="text-xs text-text-tertiary mr-2">Select Status to Test:</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ShopStatus)}
                  className="border border-border rounded px-2 py-1 text-sm"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{SHOP_STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                {ALL_SHOP_PATHS.map((path) => {
                  const allowed = SHOP_STATUS_ACCESS[selectedStatus]?.some((p) => {
                    if (p.includes(":id") || p.includes(":customerId")) {
                      const base = p.replace("/:id", "").replace("/:customerId", "");
                      return path.startsWith(base);
                    }
                    return path === p || path.startsWith(p + "/");
                  });
                  return (
                    <div key={path} className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary font-mono text-xs">{path}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${allowed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {allowed ? "✓ Allowed" : "✗ Blocked"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Path Access Table */}
          <Card padding="lg" className="mt-6">
            <h2 className="font-semibold text-sm text-text-primary mb-4">Current User Access Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs text-text-tertiary">Path</th>
                    <th className="text-center py-2 text-xs text-text-tertiary">Has Permission</th>
                    <th className="text-center py-2 text-xs text-text-tertiary">Status Allowed</th>
                    <th className="text-center py-2 text-xs text-text-tertiary">Final Access</th>
                  </tr>
                </thead>
                <tbody>
                  {ALL_SHOP_PATHS.map((path) => {
                    const hasPerm = hasPermission(path);
                    const statusAllowed = canAccessShop(currentUserStatus || "active", path);
                    const finalAccess = hasPerm && statusAllowed;
                    return (
                      <tr key={path} className="border-b border-border last:border-0">
                        <td className="py-2 font-mono text-xs text-text-secondary">{path}</td>
                        <td className={`py-2 text-center text-xs ${hasPerm ? "text-emerald-600" : "text-red-400"}`}>
                          {hasPerm ? "✓" : "✗"}
                        </td>
                        <td className={`py-2 text-center text-xs ${statusAllowed ? "text-emerald-600" : "text-red-400"}`}>
                          {statusAllowed ? "✓" : "✗"}
                        </td>
                        <td className={`py-2 text-center text-xs font-medium ${finalAccess ? "text-emerald-600" : "text-red-600"}`}>
                          {finalAccess ? "✓ ACCESS" : "✗ DENIED"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Admin Paths Test */}
          <Card padding="lg" className="mt-6">
            <h2 className="font-semibold text-sm text-text-primary mb-4">Admin Paths (Current Role: {ROLE_LABELS[currentUserRole]})</h2>
            <div className="flex flex-wrap gap-2">
              {ADMIN_PATHS.map((path) => {
                const allowed = currentUserRole === "platform_admin";
                return (
                  <span
                    key={path}
                    className={`text-xs px-3 py-2 rounded ${allowed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                  >
                    {path}: {allowed ? "✓" : "✗"}
                  </span>
                );
              })}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}