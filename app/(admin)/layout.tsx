"use client";

import { useAuth } from "@/lib/auth-context";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { DemoSwitcher } from "@/components/auth/DemoSwitcher";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const userData = user || { 
    name: "Platform Admin", 
    role: "platform_admin" as const 
  };

  return (
    <>
      <Topbar user={{ name: userData.name, role: userData.role }} />
      <div className="flex">
        <Sidebar role={userData.role} />
        <main className="flex-1 min-w-0 p-4 lg:p-6">{children}</main>
      </div>
      <DemoSwitcher />
    </>
  );
}