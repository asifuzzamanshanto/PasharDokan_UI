"use client";

import { useAuth } from "@/lib/auth-context";
import { ROLE_PERMISSIONS, SHOP_STATUS_ACCESS } from "@/lib/auth-types";
import { UserRole, ShopStatus } from "@/types";

export function UserInfoPanel() {
  const { user, hasPermission, canAccessShop } = useAuth();

  if (!user) return null;

  const role = user.role as Exclude<UserRole, "platform_admin">;
  const rolePermissions = user.role === "platform_admin" 
    ? ["All admin routes"] 
    : ROLE_PERMISSIONS[role] || [];
  
  const shopStatus = user.shopStatus as ShopStatus;
  const statusPermissions = user.role === "platform_admin"
    ? ["All routes"]
    : SHOP_STATUS_ACCESS[shopStatus] || [];

  const blockedRoutes = rolePermissions.filter(r => !statusPermissions.includes(r));

  return (
    <div className="bg-surface-sunken rounded-lg border border-border p-4 space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Current User</h3>
        <div className="text-sm font-medium text-text-primary">{user.name}</div>
        <div className="text-xs text-text-tertiary">{user.phone}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Role</h3>
          <span className="inline-block bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded font-medium">
            {user.role === "platform_admin" ? "Platform Admin" : user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Unknown"}
          </span>
        </div>
        
        <div>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Shop Status</h3>
          <span className={`inline-block text-xs px-2 py-1 rounded font-medium ${
            shopStatus === "active" ? "bg-green-100 text-green-700" :
            shopStatus === "pending" ? "bg-amber-100 text-amber-700" :
            shopStatus === "verified" ? "bg-blue-100 text-blue-700" :
            "bg-red-100 text-red-700"
          }`}>
            {shopStatus.charAt(0).toUpperCase() + shopStatus.slice(1)}
          </span>
        </div>
      </div>

      {user.shopName && (
        <div>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Shop</h3>
          <div className="text-sm font-medium text-text-primary">{user.shopName}</div>
          <div className="text-xs text-text-tertiary">ID: {user.shopId}</div>
        </div>
      )}

      <div>
        <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Allowed Routes ({rolePermissions.length})</h3>
        <div className="text-xs text-text-tertiary space-y-1 max-h-24 overflow-y-auto">
          {rolePermissions.slice(0, 10).map((route) => (
            <div key={route} className="text-green-600">✓ {route}</div>
          ))}
          {rolePermissions.length > 10 && (
            <div className="text-text-tertiary">+{rolePermissions.length - 10} more...</div>
          )}
        </div>
      </div>

      {blockedRoutes.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Blocked Routes ({blockedRoutes.length})</h3>
          <div className="text-xs text-text-tertiary space-y-1 max-h-20 overflow-y-auto">
            {blockedRoutes.slice(0, 5).map((route) => (
              <div key={route} className="text-red-500">✗ {route}</div>
            ))}
            {blockedRoutes.length > 5 && (
              <div className="text-text-tertiary">+{blockedRoutes.length - 5} more...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
