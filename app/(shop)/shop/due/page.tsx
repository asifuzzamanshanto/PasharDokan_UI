"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatBDT, formatDateTime } from "@/lib/utils";
import { clientApi } from "@/lib/client-api";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StatCard from "@/components/ui/StatCard";
import { useAuth } from "@/lib/auth-context";

interface DueCustomer {
  id: string;
  shopId: string;
  name: string;
  phoneNumber: string;
  totalDueRemaining: number;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export default function DueCustomersPage() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<DueCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const shopId = user?.shopId || 1;
    clientApi.due.getCustomers(shopId).then((res) => {
      const data = res as { customers: DueCustomer[] };
      setCustomers(data.customers);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user?.shopId]);

  const filtered = customers.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phoneNumber.includes(search)
  );

  const totalDue = customers.reduce((s, c) => s + c.totalDueRemaining, 0);

  return (
    <div>
      <PageHeader title="Due (Baki) Management" description="Track credit customers and outstanding balances" />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Due Outstanding" value={formatBDT(totalDue)} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>} accent="amber" />
        <StatCard title="Due Customers" value={customers.length.toString()} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>} accent="blue" />
        <StatCard title="Overdue" value="-" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>} accent="red" />
      </div>

      {loading ? (
        <div className="text-center py-8 text-sm text-text-tertiary">Loading customers...</div>
      ) : (
        <>
          <Input placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4" />

          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface-raised">
                    <th className="text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Customer</th>
                    <th className="text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Phone</th>
                    <th className="text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Address</th>
                    <th className="text-right text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Total Due</th>
                    <th className="text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Last Activity</th>
                    <th className="text-right text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-b-0 hover:bg-surface-raised/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-text-primary">{c.name}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{c.phoneNumber}</td>
                      <td className="px-4 py-3 text-xs text-text-tertiary">{c.address}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-bold text-red-600">{formatBDT(c.totalDueRemaining)}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-text-tertiary">{formatDateTime(c.updatedAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/shop/due/${c.id}`} className="text-xs font-medium text-primary-600 hover:underline">View Ledger</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}