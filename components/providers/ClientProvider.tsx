"use client";

import { AuthProvider } from "@/lib/auth-context";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}