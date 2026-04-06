"use client";

import { useState, useEffect } from "react";
import { mockApi } from "@/lib/api-mock";
import { StockMovement } from "@/types";
import { MOVEMENT_TYPE_LABELS, MOVEMENT_TYPE_COLORS, formatDateTime } from "@/lib/utils";
import { StockMovementType } from "@/types";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

const movementTabs: { label: string; value: StockMovementType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Stock In", value: "stock_in" },
  { label: "Stock Out", value: "stock_out" },
  { label: "Adjustments", value: "adjustment" },
  { label: "Returns", value: "return" },
  { label: "Sales", value: "sale" },
];

export default function MovementHistoryPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StockMovementType | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    mockApi.inventory.ledger().then((res) => {
      setMovements(res.ledger as StockMovement[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = movements.filter((m) => {
    const matchType = filter === "all" || m.type === filter;
    const matchSearch = !search || m.productName.toLowerCase().includes(search.toLowerCase()) || m.reason.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const typeIcons: Record<string, string> = {
    stock_in: "↗",
    stock_out: "↘",
    adjustment: "⟳",
    return: "↩",
    sale: "−",
  };

  return (
    <div>
      <PageHeader
        title="Stock Movement History"
        description="Complete audit trail of all inventory changes"
        breadcrumbs={[
          { label: "Inventory", href: "/shop/inventory" },
          { label: "History" },
        ]}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input placeholder="Search by product name or reason..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {movementTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                filter === tab.value ? "bg-primary-600 text-white border-primary-600" : "bg-surface text-text-secondary border-border hover:border-border-strong"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-text-tertiary">Loading history...</div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {(["stock_in", "stock_out", "adjustment", "return", "sale"] as StockMovementType[]).map((type) => {
              const count = movements.filter((m) => m.type === type).length;
              const totalQty = movements.filter((m) => m.type === type).reduce((s, m) => s + Math.abs(m.quantity), 0);
              return (
                <div key={type} className="bg-surface rounded-lg border border-border p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm">{typeIcons[type]}</span>
                    <span className="text-[11px] font-medium text-text-tertiary uppercase">{MOVEMENT_TYPE_LABELS[type]}</span>
                  </div>
                  <p className="text-lg font-bold text-text-primary">{count}</p>
                  <p className="text-[10px] text-text-tertiary">{totalQty} units total</p>
                </div>
              );
            })}
          </div>

          {/* Full Movement List */}
          <Card padding="none" className="overflow-hidden">
            <div className="p-4 border-b border-border">
              <p className="text-sm text-text-secondary">
                Showing <span className="font-semibold text-text-primary">{filtered.length}</span> of {movements.length} movements
              </p>
            </div>
            <div className="divide-y divide-border">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-sm text-text-tertiary">No movements found</div>
              ) : (
                filtered.map((m) => (
                  <div key={m.id} className="p-4 flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                      m.type === "stock_in" ? "bg-emerald-50 text-emerald-600" :
                      m.type === "stock_out" ? "bg-red-50 text-red-600" :
                      m.type === "adjustment" ? "bg-blue-50 text-blue-600" :
                      m.type === "return" ? "bg-purple-50 text-purple-600" :
                      "bg-amber-50 text-amber-600"
                    }`}>
                      {typeIcons[m.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium text-text-primary">{m.productName}</p>
                        <Badge className={MOVEMENT_TYPE_COLORS[m.type]}>{MOVEMENT_TYPE_LABELS[m.type]}</Badge>
                      </div>
                      <p className="text-xs text-text-tertiary">{m.reason}</p>
                      <p className="text-xs text-text-tertiary">by {m.performedBy}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold ${m.quantity > 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {m.quantity > 0 ? "+" : ""}{m.quantity}
                      </p>
                      <p className="text-[10px] text-text-tertiary">{m.previousStock} → {m.newStock}</p>
                      <p className="text-[10px] text-text-tertiary">{formatDateTime(m.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}