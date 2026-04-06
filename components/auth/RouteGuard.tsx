"use client";

import { useAuth } from "@/lib/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoutes: string[];
}

export function RouteGuard({ children, allowedRoutes }: RouteGuardProps) {
  return <>{children}</>;
}
