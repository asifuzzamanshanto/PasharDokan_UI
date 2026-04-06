"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockApi } from "@/lib/api-mock";
import { Product } from "@/types";
import { formatBDT } from "@/lib/utils";
import PageHeader from "@/components/ui/PageHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function ReturnsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [returnType, setReturnType] = useState<"supplier" | "customer">("supplier");
  const [submitted, setSubmitted] = useState(false);

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

  if (submitted && product) {
    return (
      <div className="max-w-md mx-auto">
        <PageHeader title="Return" breadcrumbs={[{ label: "Inventory", href: "/shop/inventory" }, { label: "Return" }]} />
        <Card padding="lg" className="text-center">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
          </div>
          <h2 className="font-bold text-lg text-text-primary mb-1">Return Recorded</h2>
          <p className="text-sm text-text-secondary mb-1">{product.name}: {quantity} {product.unit} returned ({returnType})</p>
          <p className="text-xs text-text-tertiary mb-4">Reason: {reason}</p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => { setSubmitted(false); setSelectedProduct(null); setQuantity(""); }}>More Returns</Button>
            <Button className="flex-1" onClick={() => router.push("/shop/inventory")}>Back to Inventory</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Product Returns"
        description="Record returns to suppliers or from customers"
        breadcrumbs={[{ label: "Inventory", href: "/shop/inventory" }, { label: "Returns" }]}
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
                      <p className="text-xs text-text-tertiary">{p.sku}</p>
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

          {/* Return Form */}
          <Card padding="lg">
            <h2 className="font-semibold text-sm text-text-primary mb-3">Return Details</h2>
            {selectedProduct && product ? (
              <div className="space-y-4">
                <div className="p-3 bg-surface-sunken rounded-lg">
                  <p className="text-sm font-medium text-text-primary">{product.name}</p>
                  <p className="text-xs text-text-tertiary">Current stock: {product.stock} {product.unit} · Price: {formatBDT(product.sellPrice)}/{product.unit}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setReturnType("supplier")}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      returnType === "supplier" ? "bg-primary-600 text-white" : "bg-surface-sunken text-text-secondary border border-border"
                    }`}
                  >
                    Return to Supplier
                  </button>
                  <button
                    onClick={() => setReturnType("customer")}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      returnType === "customer" ? "bg-primary-600 text-white" : "bg-surface-sunken text-text-secondary border border-border"
                    }`}
                  >
                    Customer Return
                  </button>
                </div>
                <Input label="Quantity" type="number" min={1} max={returnType === "supplier" ? product.stock : undefined} placeholder="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-primary">Reason</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary-500"
                    required
                  >
                    <option value="">Select reason</option>
                    {returnType === "supplier" ? (
                      <>
                        <option value="Damaged on arrival">Damaged on arrival</option>
                        <option value="Wrong product received">Wrong product received</option>
                        <option value="Quality issue">Quality issue</option>
                        <option value="Expired">Expired</option>
                      </>
                    ) : (
                      <>
                        <option value="Customer complaint">Customer complaint</option>
                        <option value="Wrong item sold">Wrong item sold</option>
                        <option value="Defective product">Defective product</option>
                      </>
                    )}
                  </select>
                </div>
                <Button className="w-full" variant="danger" disabled={!quantity || Number(quantity) <= 0 || !reason} onClick={() => setSubmitted(true)}>
                  Record Return
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