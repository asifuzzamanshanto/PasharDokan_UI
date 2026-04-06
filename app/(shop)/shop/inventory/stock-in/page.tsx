"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockApi } from "@/lib/api-mock";
import { Product } from "@/types";
import PageHeader from "@/components/ui/PageHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function StockInPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    mockApi.products.list().then((res) => {
      setProducts(res.products as Product[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const product = products.find((p) => p.id === selectedProduct);

  const handleSubmit = async () => {
    if (!selectedProduct || !quantity) return;
    setSubmitting(true);
    try {
      await mockApi.inventory.stockIn({
        ProductId: selectedProduct,
        Qty: Number(quantity),
        UnitCostPaisa: Math.round(Number(costPrice || product?.costPrice || 0) * 100),
        Note: reason,
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Stock in failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted && product) {
    const newStock = product.stock + Number(quantity);
    return (
      <div className="max-w-md mx-auto">
        <PageHeader title="Stock In" breadcrumbs={[{ label: "Inventory", href: "/shop/inventory" }, { label: "Stock In" }]} />
        <Card padding="lg" className="text-center">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
          </div>
          <h2 className="font-bold text-lg text-text-primary mb-1">Stock Updated</h2>
          <p className="text-sm text-text-secondary mb-4">{product.name}: {product.stock} → {newStock} {product.unit}</p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => { setSubmitted(false); setSelectedProduct(null); setQuantity(""); setSearch(""); }}>Add More</Button>
            <Button className="flex-1" onClick={() => router.push("/shop/inventory")}>Back to Inventory</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Stock In"
        description="Receive new stock for existing products"
        breadcrumbs={[{ label: "Inventory", href: "/shop/inventory" }, { label: "Stock In" }]}
      />

      {loading ? (
        <div className="text-center py-8 text-text-tertiary">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Selection */}
          <Card padding="lg">
            <h2 className="font-semibold text-sm text-text-primary mb-3">Select Product</h2>
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-3" />
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProduct(p.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors cursor-pointer ${
                    selectedProduct === p.id ? "bg-primary-50 border border-primary-300" : "hover:bg-surface-sunken border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{p.name}</p>
                      <p className="text-xs text-text-tertiary">{p.sku} · {p.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-text-primary">{p.stock}</p>
                      <p className="text-[10px] text-text-tertiary">in {p.unit}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Stock In Form */}
          <Card padding="lg">
            <h2 className="font-semibold text-sm text-text-primary mb-3">Stock In Details</h2>
            {selectedProduct && product ? (
              <div className="space-y-4">
                <div className="p-3 bg-surface-sunken rounded-lg">
                  <p className="text-sm font-medium text-text-primary">{product.name}</p>
                  <p className="text-xs text-text-tertiary">Current stock: {product.stock} {product.unit}</p>
                </div>
                <Input label="Quantity to Add" type="number" min={1} placeholder="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                <Input label="Unit Cost (৳)" type="number" placeholder={String(product.costPrice)} value={costPrice} onChange={(e) => setCostPrice(e.target.value)} />
                <Input label="Reason (Optional)" placeholder="e.g. Supplier delivery, Restock" value={reason} onChange={(e) => setReason(e.target.value)} />
                {quantity && Number(quantity) > 0 && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-xs text-emerald-700">
                      New stock: {product.stock} + {quantity} = <span className="font-bold">{product.stock + Number(quantity)} {product.unit}</span>
                    </p>
                  </div>
                )}
                <Button className="w-full" disabled={!quantity || Number(quantity) <= 0 || submitting} onClick={handleSubmit}>
                  {submitting ? "Processing..." : "Confirm Stock In"}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-text-tertiary text-center py-8">Select a product from the left panel</p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}