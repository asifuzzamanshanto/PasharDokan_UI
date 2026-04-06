"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { mockApi } from "@/lib/api-mock";
import { Invoice } from "@/types";
import { formatBDT, PAYMENT_STATUS_LABELS, formatDateTime } from "@/lib/utils";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.sales.list().then((res) => {
      setInvoices(res.sales as Invoice[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Invoices" description="Sales history and invoice records" />

      {loading ? (
        <div className="text-center py-8 text-sm text-text-tertiary">Loading invoices...</div>
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-raised">
                  <th className="text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Invoice</th>
                  <th className="text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Customer</th>
                  <th className="text-right text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Items</th>
                  <th className="text-right text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Total</th>
                  <th className="text-right text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Paid</th>
                  <th className="text-right text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Due</th>
                  <th className="text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Status</th>
                  <th className="text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Date</th>
                  <th className="text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Sold By</th>
                  <th className="text-right text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-border last:border-b-0 hover:bg-surface-raised/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-text-primary">{inv.invoiceNo}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-text-primary">{inv.customerName || "Walk-in"}</p>
                      {inv.customerPhone && <p className="text-xs text-text-tertiary">{inv.customerPhone}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary text-right">{inv.items.length}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-text-primary text-right">{formatBDT(inv.total)}</td>
                    <td className="px-4 py-3 text-sm text-emerald-600 font-medium text-right">{formatBDT(inv.paidAmount)}</td>
                    <td className="px-4 py-3 text-sm text-red-600 font-medium text-right">{inv.dueAmount > 0 ? formatBDT(inv.dueAmount) : "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={inv.paymentStatus === "paid" ? "success" : inv.paymentStatus === "partial_due" ? "warning" : "danger"}>
                        {PAYMENT_STATUS_LABELS[inv.paymentStatus]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-tertiary">{formatDateTime(inv.createdAt)}</td>
                    <td className="px-4 py-3 text-xs text-text-secondary">{inv.soldBy}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/shop/invoices/${inv.id}`} className="text-xs font-medium text-primary-600 hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}