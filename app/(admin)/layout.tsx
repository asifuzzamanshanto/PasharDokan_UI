"use client";

import { useAuth } from "@/lib/auth-context";
import { UserRole, ShopStatus } from "@/types";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { DemoSwitcher } from "@/components/auth/DemoSwitcher";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const userData = user || { 
    name: "Platform Admin", 
    role: "platform_admin" as UserRole,
    shopName: undefined as string | undefined,
    shopStatus: undefined as ShopStatus | undefined
  };

  return (
    <>
      <Topbar user={{ 
        name: userData.name || "Platform Admin", 
        role: userData.role as UserRole,
        shopName: userData.shopName,
        shopStatus: userData.shopStatus as ShopStatus | undefined
      }} />
      <div className="flex">
        <Sidebar role={userData.role as UserRole} />
        <main className="flex-1 min-w-0 p-4 lg:p-6">{children}</main>
      </div>
      <DemoSwitcher />
    </>
  );
}