"use client";

import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/types";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user || !user.role || !allowedRoles.includes(user.role as UserRole)) {
    return <>{fallback || null}</>;
  }

  return <>{children}</>;
}
