"use client";

import Link from "next/link";
import { useState } from "react";
import { ROLE_LABELS } from "@/lib/utils";
import { UserRole, ShopStatus } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

interface TopbarProps {
  user: { name: string; role: UserRole; shopName?: string; shopStatus?: ShopStatus };
}

export default function Topbar({ user }: TopbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/signin");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border h-14">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PD</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-bold text-text-primary leading-tight">PasharDokan</span>
              <span className="text-[10px] text-text-tertiary leading-tight">Shop Operations Platform</span>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button className="relative p-2 text-text-tertiary hover:text-text-primary hover:bg-surface-sunken rounded-lg transition-colors cursor-pointer">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User info */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1 hover:bg-surface-sunken rounded-lg transition-colors cursor-pointer"
              >
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium text-text-primary">{user.name}</span>
                  <span className="text-[11px] text-text-tertiary">{ROLE_LABELS[user.role]}</span>
                </div>
                <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center text-sm font-bold">
                  {user.name.charAt(0)}
                </div>
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-surface border border-border rounded-lg shadow-lg py-1 z-50">
                  {user.shopName && (
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-xs text-text-tertiary">Shop</p>
                      <p className="text-sm font-medium text-text-primary">{user.shopName}</p>
                      {user.shopStatus && (
                        <span className={`inline-block text-xs px-1.5 py-0.5 rounded font-medium mt-1 ${
                          user.shopStatus === "active" ? "bg-green-100 text-green-700" :
                          user.shopStatus === "pending" ? "bg-amber-100 text-amber-700" :
                          user.shopStatus === "verified" ? "bg-blue-100 text-blue-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {user.shopStatus.charAt(0).toUpperCase() + user.shopStatus.slice(1)}
                        </span>
                      )}
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-text-tertiary hover:text-text-primary hover:bg-surface-sunken rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-surface shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-semibold text-sm text-text-primary">Navigation</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 hover:bg-surface-sunken rounded cursor-pointer">
                <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-3 space-y-1">
              {/* Import NAV_CONFIG dynamically - simplified for mobile */}
              {user.role === "platform_admin" ? (
                <>
                  <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:bg-surface-sunken rounded-lg">Dashboard</Link>
                  <Link href="/admin/shops" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:bg-surface-sunken rounded-lg">Shop Applications</Link>
                  <Link href="/admin/audit" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:bg-surface-sunken rounded-lg">Audit Log</Link>
                </>
              ) : (
                <>
                  <Link href="/shop/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:bg-surface-sunken rounded-lg">Dashboard</Link>
                  <Link href="/shop/pos" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:bg-surface-sunken rounded-lg">POS Billing</Link>
                  <Link href="/shop/products" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:bg-surface-sunken rounded-lg">Products</Link>
                  <Link href="/shop/inventory" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:bg-surface-sunken rounded-lg">Inventory</Link>
                  <Link href="/shop/invoices" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:bg-surface-sunken rounded-lg">Invoices</Link>
                  <Link href="/shop/due" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:bg-surface-sunken rounded-lg">Due (Baki)</Link>
                  <Link href="/shop/users" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:bg-surface-sunken rounded-lg">Staff</Link>
                  <Link href="/shop/reports" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:bg-surface-sunken rounded-lg">Reports</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
