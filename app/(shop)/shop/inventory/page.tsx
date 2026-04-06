"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { formatBDT, formatDateTime } from "@/lib/utils";
import { clientApi } from "@/lib/client-api";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import Button from "@/components/ui/Button";

interface Product {
  productId: number;
  name: string;
  barcode: string;
  sellPricePaisa: number;
  costPricePaisa?: number;
  isActive: boolean;
  currentQty: number;
  category?: string;
  unit?: string;
  lowStockThreshold?: number;
}

interface StockMovement {
  movementId: number;
  productId: number;
  productName: string;
  type: "IN" | "SALE" | "ADJUST";
  qtyChange: number;
  unitCostPaisa: number;
  note: string;
  createdAt: string;
}

export default function InventoryPage() {
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuth();

  const canStockIn = hasPermission("/shop/inventory/stock-in");
  const canAdjust = hasPermission("/shop/inventory/adjustments");

  useEffect(() => {
    Promise.all([
      clientApi.products.list(),
      clientApi.inventory.ledger(undefined, 20)
    ]).then(([productsRes, ledgerRes]) => {
      setProducts(productsRes as Product[]);
      setMovements(ledgerRes as StockMovement[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredProducts = filter === "low"
    ? products.filter((p) => p.currentQty > 0 && p.currentQty <= (p.lowStockThreshold || 50))
    : filter === "out"
    ? products.filter((p) => p.currentQty === 0)
    : products;

  const lowStockCount = products.filter(p => p.currentQty > 0 && p.currentQty <= (p.lowStockThreshold || 50)).length;
  const outOfStockCount = products.filter(p => p.currentQty === 0).length;
  const totalValue = products.reduce((s, p) => s + (p.costPricePaisa || 0) * p.currentQty, 0);

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Stock levels, movements, and alerts"
        actions={
          <div className="flex gap-2">
            {canStockIn && <Link href="/shop/inventory/stock-in"><Button variant="outline" size="sm">+ Stock In</Button></Link>}
            {canAdjust && <Link href="/shop/inventory/adjustments"><Button variant="outline" size="sm">Adjustment</Button></Link>}
          </div>
        }
      />

      {loading ? (
        <div className="text-center py-8 text-sm text-text-tertiary">Loading inventory...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Products" value={products.length.toString()} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>} accent="blue" />
            <StatCard title="Low Stock" value={lowStockCount.toString()} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>} accent="amber" />
            <StatCard title="Out of Stock" value={outOfStockCount.toString()} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" /></svg>} accent="red" />
            <StatCard title="Total Value" value={formatBDT(totalValue)} subtitle="at cost" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>} accent="emerald" />
          </div>

          <div className="flex gap-2 mb-4">
            {[{ l: "All", v: "all" }, { l: "Low Stock", v: "low" }, { l: "Out of Stock", v: "out" }].map((f) => (
              <button key={f.v} onClick={() => setFilter(f.v as typeof filter)} className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-colors ${filter === f.v ? "bg-primary-600 text-white border-primary-600" : "bg-surface text-text-secondary border-border hover:border-border-strong"}`}>
                {f.l}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card padding="none" className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-surface-raised">
                        <th className="text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Product</th>
                        <th className="text-right text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Stock</th>
                        <th className="text-right text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Value</th>
                        <th className="text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => (
                        <tr key={p.productId} className="border-b border-border last:border-b-0 hover:bg-surface-raised/50">
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-text-primary">{p.name}</p>
                            <p className="text-xs text-text-tertiary">{p.barcode} · {p.category}</p>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={`text-sm font-bold ${p.currentQty === 0 ? "text-red-600" : p.currentQty <= (p.lowStockThreshold || 50) ? "text-amber-600" : "text-text-primary"}`}>
                              {p.currentQty}
                            </span>
                            <span className="text-xs text-text-tertiary">/{p.lowStockThreshold || 50} min</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-text-secondary text-right font-medium">{formatBDT((p.costPricePaisa || 0) * p.currentQty)}</td>
                          <td className="px-4 py-3">
                            {p.currentQty === 0 ? <Badge variant="danger">Out</Badge> : p.currentQty <= (p.lowStockThreshold || 50) ? <Badge variant="warning">Low</Badge> : <Badge variant="success">OK</Badge>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            <Card padding="none" className="overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-semibold text-sm text-text-primary">Recent Movements</h2>
                <Link href="/shop/inventory/history" className="text-xs font-medium text-primary-600 hover:underline">View All →</Link>
              </div>
              <div className="divide-y divide-border">
                {movements.slice(0, 6).map((m) => (
                  <div key={m.movementId} className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-text-primary">{m.productName}</span>
                      <Badge variant={m.type === "IN" ? "success" : m.type === "ADJUST" ? "warning" : "danger"}>
                        {m.type === "IN" ? "Stock In" : m.type === "ADJUST" ? "Adjust" : "Sale"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-text-tertiary">
                      <span>{m.type === "IN" ? "+" : ""}{m.qtyChange}</span>
                      <span>{formatDateTime(m.createdAt)}</span>
                    </div>
                  </div>
                ))}
                {movements.length === 0 && (
                  <div className="p-4 text-center text-xs text-text-tertiary">No movements yet</div>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}