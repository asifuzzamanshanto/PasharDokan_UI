"use client";

import { useAuth } from "@/lib/auth-context";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const userData = user || { 
    name: "Demo User", 
    role: "owner" as const, 
    shopName: "Demo Shop", 
    shopStatus: "active" as const 
  };

  return (
    <>
      <Topbar user={{ name: userData.name, role: userData.role, shopName: userData.shopName, shopStatus: userData.shopStatus }} />
      <div className="flex">
        <Sidebar role={userData.role} shopName={userData.shopName || "Shop"} />
        <main className="flex-1 min-w-0 p-4 lg:p-6">{children}</main>
      </div>
    </>
  );
}