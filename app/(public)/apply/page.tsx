"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientApi } from "@/lib/client-api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    address: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await clientApi.shop.apply({
        shopName: form.shopName,
        address: form.address,
        ownerName: form.ownerName,
        ownerPhone: form.ownerPhone,
        ownerEmail: form.ownerEmail,
      });
      
      setApplicationId(result.shopId);
      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-text-primary mb-2">Application Submitted</h1>
        <p className="text-sm text-text-secondary mb-4">
          Your shop application has been received. Our team will review and verify your details within 24-48 hours.
        </p>
        {applicationId && (
          <p className="text-xs text-text-tertiary mb-6">Application ID: {applicationId}</p>
        )}
        <a href="/apply/status" className="text-sm font-medium text-primary-600 hover:underline">Check Application Status →</a>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-text-primary">Apply for Shop Access</h1>
        <p className="text-sm text-text-secondary mt-1">Submit your shop details for verification. Approval takes 24-48 hours.</p>
      </div>
      <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
          <Input 
            label="Shop Name" 
            placeholder="e.g. Rahim Store" 
            value={form.shopName} 
            onChange={(e) => setForm({ ...form, shopName: e.target.value })} 
            required 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              label="Owner Full Name" 
              placeholder="e.g. Rahim Ahmed" 
              value={form.ownerName} 
              onChange={(e) => setForm({ ...form, ownerName: e.target.value })} 
              required 
            />
            <Input 
              label="Phone Number" 
              placeholder="01XXXXXXXXX" 
              type="tel" 
              value={form.ownerPhone} 
              onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })} 
              required 
            />
          </div>
          <Input 
            label="Email" 
            type="email" 
            placeholder="owner@example.com" 
            value={form.ownerEmail} 
            onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} 
            required 
          />
          <Input 
            label="Shop Address" 
            placeholder="Street address, area, city" 
            value={form.address} 
            onChange={(e) => setForm({ ...form, address: e.target.value })} 
            required 
          />
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </div>
    </div>
  );
}