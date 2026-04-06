"use client";

import { useState, useEffect } from "react";
import { formatBDT } from "@/lib/utils";
import { clientApi } from "@/lib/client-api";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";

interface SalesSummary {
  totalSales: number;
  paidSales: number;
  dueOutstanding: number;
  collectionRate: number;
  todaySales: number;
  invoiceCount: number;
}

interface TopProduct {
  productId: number;
  name: string;
  quantity: number;
  revenue: number;
}

interface CategoryDist {
  category: string;
  count: number;
  percentage: number;
}

export default function ReportsPage() {
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [categories, setCategories] = useState<CategoryDist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      clientApi.reports.salesSummary(),
      clientApi.reports.topProducts(10),
      clientApi.reports.categoryDistribution()
    ]).then(([summaryRes, topRes, catRes]) => {
      setSummary(summaryRes as SalesSummary);
      setTopProducts(topRes as TopProduct[]);
      setCategories(catRes as CategoryDist[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Reports & Analytics" description="Business insights and performance data" />

      {loading ? (
        <div className="text-center py-8 text-sm text-text-tertiary">Loading reports...</div>
      ) : summary ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Sales" value={formatBDT(summary.totalSales)} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>} accent="emerald" />
            <StatCard title="Paid Sales" value={formatBDT(summary.paidSales)} subtitle={`${summary.invoiceCount} invoices`} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>} accent="blue" />
            <StatCard title="Due Outstanding" value={formatBDT(summary.dueOutstanding)} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>} accent="amber" />
            <StatCard title="Collection Rate" value={`${summary.collectionRate}%`} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>} accent="slate" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card padding="lg">
              <h2 className="font-semibold text-sm text-text-primary mb-4">Top Selling Products</h2>
              <div className="space-y-3">
                {topProducts.map((p, i) => (
                  <div key={p.productId} className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center text-xs font-bold">{i + 1}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">{p.name}</p>
                      <p className="text-xs text-text-tertiary">{p.quantity} units sold</p>
                    </div>
                    <span className="text-sm font-semibold text-text-primary">{formatBDT(p.revenue)}</span>
                  </div>
                ))}
                {topProducts.length === 0 && (
                  <div className="text-center py-4 text-sm text-text-tertiary">No data available</div>
                )}
              </div>
            </Card>

            <Card padding="lg">
              <h2 className="font-semibold text-sm text-text-primary mb-4">Product Category Distribution</h2>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-text-secondary">{cat.category}</span>
                      <span className="font-medium text-text-primary">{cat.count} items</span>
                    </div>
                    <div className="h-2 bg-surface-sunken rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${cat.percentage}%` }} />
                    </div>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="text-center py-4 text-sm text-text-tertiary">No data available</div>
                )}
              </div>
            </Card>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-sm text-text-tertiary">No data available</div>
      )}
    </div>
  );
}