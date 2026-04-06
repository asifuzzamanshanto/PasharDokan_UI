"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import { mockApi } from "@/lib/api-mock";
import { DueCustomer, DueTransaction } from "@/types";
import { formatBDT, formatDateTime, DUE_TX_TYPE_LABELS } from "@/lib/utils";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function DueCustomerProfilePage({ params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = use(params);
  const [customer, setCustomer] = useState<DueCustomer | null>(null);
  const [transactions, setTransactions] = useState<DueTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPayForm, setShowPayForm] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payNote, setPayNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      mockApi.due.getCustomers(),
      mockApi.due.getEntries(customerId)
    ]).then(([customersRes, entriesRes]) => {
      const cust = (customersRes.customers as DueCustomer[]).find(c => c.id === customerId);
      setCustomer(cust || null);
      setTransactions(entriesRes.entries as DueTransaction[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [customerId]);

  const handlePayment = async () => {
    if (!payAmount || Number(payAmount) <= 0) return;
    setSubmitting(true);
    try {
      await mockApi.due.createEntry(customerId, {
        Amount: Number(payAmount),
        EntryType: 2,
        Remarks: payNote,
      });
      const [customersRes, entriesRes] = await Promise.all([
        mockApi.due.getCustomers(),
        mockApi.due.getEntries(customerId)
      ]);
      const cust = (customersRes.customers as DueCustomer[]).find(c => c.id === customerId);
      setCustomer(cust || null);
      setTransactions(entriesRes.entries as DueTransaction[]);
      setShowPayForm(false);
      setPayAmount("");
      setPayNote("");
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-text-tertiary">Loading...</div>;
  }

  if (!customer) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title={customer.name}
        description={`${customer.phone} · ${customer.address}`}
        breadcrumbs={[
          { label: "Due Management", href: "/shop/due" },
          { label: customer.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ledger */}
        <div className="lg:col-span-2">
          <Card padding="none" className="overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-sm text-text-primary">Due Ledger</h2>
            </div>
            <div className="divide-y divide-border">
              {transactions.length === 0 ? (
                <div className="p-8 text-center text-sm text-text-tertiary">No transactions yet</div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                      tx.type === "payment" ? "bg-emerald-50 text-emerald-600" : tx.type === "sale" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                    }`}>
                      {tx.type === "payment" ? "↓" : tx.type === "sale" ? "↑" : "⟳"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">{DUE_TX_TYPE_LABELS[tx.type]}</p>
                      <p className="text-xs text-text-tertiary">
                        {tx.invoiceNo ? `Invoice: ${tx.invoiceNo} · ` : ""}{tx.note} · {tx.performedBy}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${tx.amount > 0 ? "text-red-600" : "text-emerald-600"}`}>
                        {tx.amount > 0 ? "+" : ""}{formatBDT(Math.abs(tx.amount))}
                      </p>
                      <p className="text-xs text-text-tertiary">{formatDateTime(tx.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card padding="lg">
            <h2 className="font-semibold text-sm text-text-primary mb-3">Current Due Balance</h2>
            <p className="text-2xl font-bold text-red-600">{formatBDT(customer.totalDue)}</p>
            {customer.isOverdue && (
              <Badge variant="danger" className="mt-2">Overdue — more than 30 days</Badge>
            )}
          </Card>

          <Card padding="lg">
            <h2 className="font-semibold text-sm text-text-primary mb-3">Actions</h2>
            {!showPayForm ? (
              <div className="space-y-2">
                <Button className="w-full" size="sm" onClick={() => setShowPayForm(true)}>Record Payment</Button>
                <Button className="w-full" size="sm" variant="danger" onClick={() => { setPayAmount(String(customer.totalDue)); setShowPayForm(true); }}>Settle Full Due</Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Input label="Payment Amount (৳)" type="number" placeholder="0" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
                <Input label="Note (Optional)" placeholder="e.g. Partial cash payment" value={payNote} onChange={(e) => setPayNote(e.target.value)} />
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={handlePayment} disabled={submitting}>{submitting ? "Saving..." : "Save"}</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowPayForm(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </Card>

          <Card padding="lg">
            <h2 className="font-semibold text-sm text-text-primary mb-3">Customer Info</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">Phone</span><span>{customer.phone}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Address</span><span className="text-right">{customer.address}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Since</span><span>{new Date(customer.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}