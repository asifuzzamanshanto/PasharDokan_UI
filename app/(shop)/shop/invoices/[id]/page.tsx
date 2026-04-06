"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { mockApi } from "@/lib/api-mock";
import { Invoice } from "@/types";
import { formatBDT, formatDateTime, PAYMENT_STATUS_LABELS } from "@/lib/utils";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.sales.get(id).then((res) => {
      setInvoice(res.sale as Invoice);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-center py-8 text-text-tertiary">Loading...</div>;
  }

  if (!invoice) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={invoice.invoiceNo}
        description={`Invoice from ${formatDateTime(invoice.createdAt)}`}
        breadcrumbs={[
          { label: "Invoices", href: "/shop/invoices" },
          { label: invoice.invoiceNo },
        ]}
        actions={
          <Button variant="outline" size="sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12Zm-3 0h.008v.008h-.008V12Z" />
            </svg>
            Print
          </Button>
        }
      />

      {/* Invoice Header */}
      <Card padding="lg" className="mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-text-tertiary">Shop</p>
            <p className="font-semibold text-text-primary">Rahim Store</p>
            <p className="text-xs text-text-tertiary">12 Kawran Bazar, Dhaka</p>
          </div>
          <Badge variant={invoice.paymentStatus === "paid" ? "success" : invoice.paymentStatus === "partial_due" ? "warning" : "danger"} size="md">
            {PAYMENT_STATUS_LABELS[invoice.paymentStatus]}
          </Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-text-tertiary">Invoice No</p>
            <p className="font-semibold text-text-primary">{invoice.invoiceNo}</p>
          </div>
          <div>
            <p className="text-xs text-text-tertiary">Date</p>
            <p className="font-medium text-text-primary">{formatDateTime(invoice.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-text-tertiary">Customer</p>
            <p className="font-medium text-text-primary">{invoice.customerName || "Walk-in Customer"}</p>
            {invoice.customerPhone && <p className="text-xs text-text-tertiary">{invoice.customerPhone}</p>}
          </div>
          <div>
            <p className="text-xs text-text-tertiary">Sold By</p>
            <p className="font-medium text-text-primary">{invoice.soldBy}</p>
          </div>
        </div>
      </Card>

      {/* Items */}
      <Card padding="none" className="overflow-hidden mb-4">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-sm text-text-primary">Items ({invoice.items.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-raised">
                <th className="text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Product</th>
                <th className="text-center text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Qty</th>
                <th className="text-right text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Unit Price</th>
                <th className="text-right text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-sm text-text-primary">{item.productName}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary text-right">{formatBDT(item.unitPrice)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-text-primary text-right">{formatBDT(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary */}
      <Card padding="lg">
        <h2 className="font-semibold text-sm text-text-primary mb-3">Payment Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">Subtotal</span>
            <span className="font-medium">{formatBDT(invoice.subtotal)}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-text-secondary">Discount</span>
              <span className="font-medium text-emerald-600">-{formatBDT(invoice.discount)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="font-bold text-text-primary">Total</span>
            <span className="font-bold text-lg text-text-primary">{formatBDT(invoice.total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Paid</span>
            <span className="font-semibold text-emerald-600">{formatBDT(invoice.paidAmount)}</span>
          </div>
          {invoice.dueAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-text-secondary">Due</span>
              <span className="font-semibold text-red-600">{formatBDT(invoice.dueAmount)}</span>
            </div>
          )}
        </div>
        {invoice.customerId && invoice.dueAmount > 0 && (
          <div className="mt-4 pt-3 border-t border-border">
            <Link href={`/shop/due/${invoice.customerId}`} className="text-xs font-medium text-primary-600 hover:underline">
              View Customer Due Ledger →
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}

