"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { formatBDT } from "@/lib/utils";
import { clientApi } from "@/lib/client-api";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

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

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, hasPermission } = useAuth();

  const canAddProduct = hasPermission("/shop/products/new");
  const canEditProduct = (path: string) => hasPermission(path);

  useEffect(() => {
    clientApi.products.list().then((res) => {
      setProducts(res as Product[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const categories = [...new Set(products.map((p) => p.category || "Uncategorized"))];

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        actions={canAddProduct ? <Link href="/shop/products/new"><Button>+ Add Product</Button></Link> : null}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input placeholder="Search by name or barcode..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary-500"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8 text-sm text-text-tertiary">Loading products...</div>
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-raised">
                  <th className="text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Product</th>
                  <th className="text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Barcode</th>
                  <th className="text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Category</th>
                  <th className="text-right text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Cost</th>
                  <th className="text-right text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Price</th>
                  <th className="text-right text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Stock</th>
                  <th className="text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Status</th>
                  <th className="text-right text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.productId} className="border-b border-border last:border-b-0 hover:bg-surface-raised/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-text-primary">{p.name}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary font-mono">{p.barcode}</td>
                    <td className="px-4 py-3"><Badge variant="outline">{p.category || "N/A"}</Badge></td>
                    <td className="px-4 py-3 text-sm text-text-secondary text-right">{p.costPricePaisa ? formatBDT(p.costPricePaisa) : "-"}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-text-primary text-right">{formatBDT(p.sellPricePaisa)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-bold ${p.currentQty === 0 ? "text-red-600" : p.currentQty <= (p.lowStockThreshold || 50) ? "text-amber-600" : "text-text-primary"}`}>
                        {p.currentQty}
                      </span>
                      <span className="text-xs text-text-tertiary"> {p.unit || "units"}</span>
                    </td>
                    <td className="px-4 py-3">
                      {p.currentQty === 0 ? (
                        <Badge variant="danger">Out of Stock</Badge>
                      ) : p.currentQty <= (p.lowStockThreshold || 50) ? (
                        <Badge variant="warning">Low Stock</Badge>
                      ) : p.isActive ? (
                        <Badge variant="success">In Stock</Badge>
                      ) : (
                        <Badge variant="danger">Inactive</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {canEditProduct(`/shop/products/${p.productId}/edit`) && (
                        <Link href={`/shop/products/${p.productId}/edit`} className="text-xs font-medium text-primary-600 hover:underline">Edit</Link>
                      )}
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