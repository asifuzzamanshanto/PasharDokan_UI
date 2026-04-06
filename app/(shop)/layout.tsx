"use client";

import { useAuth } from "@/lib/auth-context";
import { UserRole, ShopStatus } from "@/types";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const userData = user || { 
    name: "Demo User", 
    role: "owner" as UserRole, 
    shopName: "Demo Shop" as string | undefined, 
    shopStatus: "active" as ShopStatus | undefined 
  };

  return (
    <>
      <Topbar user={{ 
        name: userData.name || "Demo User", 
        role: userData.role as UserRole, 
        shopName: userData.shopName,
        shopStatus: userData.shopStatus as ShopStatus | undefined
      }} />
      <div className="flex">
        <Sidebar role={userData.role as UserRole} shopName={userData.shopName || "Shop"} />
        <main className="flex-1 min-w-0 p-4 lg:p-6">{children}</main>
      </div>
    </>
  );
}