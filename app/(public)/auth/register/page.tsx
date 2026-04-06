"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clientApi } from "@/lib/client-api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", dob: "", nid: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!form.nid || form.nid.length < 8) {
      setError("NID must be at least 8 digits");
      return;
    }

    setLoading(true);
    try {
      await clientApi.auth.register({
        fullName: form.fullName,
        dob: form.dob,
        nid: form.nid,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      router.push("/auth/signin");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto py-16 px-4">
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold text-text-primary">Create your account</h1>
        <p className="text-sm text-text-secondary mt-1">Join as a shop owner or staff member</p>
      </div>
      <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
          <Input label="Full Name" placeholder="e.g. Rahim Ahmed" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          <Input label="Date of Birth" type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} required />
          <Input label="NID Number" placeholder="Enter NID (8+ digits)" value={form.nid} onChange={(e) => setForm({ ...form, nid: e.target.value })} required />
          <Input label="Email" type="email" placeholder="e.g. test@test.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" placeholder="Min 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Input label="Confirm Password" type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>
        <p className="text-xs text-text-tertiary text-center mt-4">
          Already have an account? <Link href="/auth/signin" className="text-primary-600 font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}