"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

const DEMO_ACCOUNTS = [
  { name: "Platform Admin", phone: "01811111111", role: "Admin", shop: "Platform" },
  { name: "Shop A Owner", phone: "01712345678", role: "Owner", shop: "Rahim Store" },
  { name: "Shop A Manager", phone: "01556789012", role: "Manager", shop: "Rahim Store" },
  { name: "Shop A Seller", phone: "01634567890", role: "Seller", shop: "Rahim Store" },
  { name: "Shop B Owner", phone: "01912345678", role: "Owner", shop: "Fatema Grocery" },
  { name: "Shop B Seller", phone: "01822334455", role: "Seller", shop: "Fatema Grocery" },
];

export function DemoSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { login, logout } = useAuth();
  const router = useRouter();

  const handleSwitch = async (phone: string) => {
    setIsOpen(false);
    logout();
    const success = await login(phone, "password");
    if (success) {
      if (phone === "01811111111") {
        router.push("/admin/dashboard");
      } else {
        router.push("/shop/dashboard");
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-primary-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-primary-700 transition-colors text-sm font-medium cursor-pointer"
      >
        Switch Demo User
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-text-primary">Switch Demo User</h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-surface-sunken rounded cursor-pointer">
                <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.phone}
                  onClick={() => handleSwitch(account.phone)}
                  className="w-full text-left p-3 rounded-lg hover:bg-surface-sunken border border-transparent hover:border-border transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-text-primary">{account.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      account.role === "Admin" ? "bg-purple-100 text-purple-700" :
                      account.role === "Owner" ? "bg-blue-100 text-blue-700" :
                      account.role === "Manager" ? "bg-amber-100 text-amber-700" :
                      "bg-emerald-100 text-emerald-700"
                    }`}>{account.role}</span>
                  </div>
                  <div className="text-xs text-text-tertiary mt-1">{account.shop}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}