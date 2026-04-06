"use client";

import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";

export default function ShopSettingsPage() {
  const { hasPermission } = useAuth();
  const canAccessSettings = hasPermission("/shop/settings");

  if (!canAccessSettings) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Access Restricted</h2>
          <p className="text-sm text-text-secondary">
            Only the shop owner can access settings. Contact your shop owner to make changes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Shop Settings" description="Manage your shop configuration" />

      <Card padding="lg" className="mb-6">
        <h2 className="font-semibold text-sm text-text-primary mb-4">Shop Information</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Shop Name (English)" defaultValue="Rahim Store" />
            <Input label="Shop Name (Bengali)" defaultValue="রহিম স্টোর" />
          </div>
          <Input label="Address" defaultValue="12 Kawran Bazar, Dhaka" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Owner Phone" defaultValue="01712345678" />
            <Input label="Trade License" defaultValue="TRAD-2024-001" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </Card>

      <Card padding="lg">
        <h2 className="font-semibold text-sm text-text-primary mb-4">Danger Zone</h2>
        <p className="text-sm text-text-secondary mb-4">These actions are irreversible. Proceed with caution.</p>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">Export All Data</Button>
          <Button variant="danger" size="sm">Deactivate Shop</Button>
        </div>
      </Card>
    </div>
  );
}
