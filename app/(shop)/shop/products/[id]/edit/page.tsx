"use client";

import { useState, useEffect, use } from "react";
import { notFound, useRouter } from "next/navigation";
import { mockApi } from "@/lib/api-mock";
import { Product } from "@/types";
import PageHeader from "@/components/ui/PageHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const CATEGORIES = [
  "Rice & Grains", "Oil & Ghee", "Sugar & Sweet", "Salt & Spice",
  "Vegetables", "Dairy", "Lentils & Pulses", "Cleaning", "Personal Care",
  "Snacks & Beverages", "Frozen", "Others",
];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    mockApi.products.get(id).then((res) => {
      setProduct(res.product as Product);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="text-center py-8 text-text-tertiary">Loading...</div>;
  }

  if (!product) {
    notFound();
  }

  const [form, setForm] = useState({
    name: product.name,
    nameBn: product.nameBn || "",
    sku: product.sku,
    category: product.category,
    unit: product.unit,
    costPrice: String(product.costPrice),
    sellPrice: String(product.sellPrice),
    lowStockThreshold: String(product.lowStockThreshold),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await mockApi.products.update(id, {
        name: form.name,
        sku: form.sku,
        sellPrice: Math.round(Number(form.sellPrice) * 100),
        costPrice: Math.round(Number(form.costPrice) * 100),
        category: form.category,
        unit: form.unit,
        lowStockThreshold: Number(form.lowStockThreshold),
      });
      router.push("/shop/products");
    } catch (error) {
      console.error("Failed to update product:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Edit Product"
        description={`Editing: ${product.name}`}
        breadcrumbs={[
          { label: "Products", href: "/shop/products" },
          { label: product.name },
        ]}
      />

      {/* Current Stock Info */}
      <Card padding="lg" className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-text-tertiary">Current Stock</p>
            <p className="text-lg font-bold text-text-primary">{product.stock} {product.unit}</p>
          </div>
          <div>
            <p className="text-xs text-text-tertiary">Status</p>
            {product.stock === 0 ? (
              <Badge variant="danger">Out of Stock</Badge>
            ) : product.stock <= product.lowStockThreshold ? (
              <Badge variant="warning">Low Stock</Badge>
            ) : (
              <Badge variant="success">In Stock</Badge>
            )}
          </div>
          <div>
            <p className="text-xs text-text-tertiary">Stock Value</p>
            <p className="text-lg font-bold text-text-primary">৳{(product.costPrice * product.stock).toLocaleString("en-BD")}</p>
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Product Name (English)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Product Name (Bengali)" value={form.nameBn} onChange={(e) => setForm({ ...form, nameBn: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary-500">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input label="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} required />
            <Input label="Cost Price (৳)" type="number" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} required />
            <Input label="Sell Price (৳)" type="number" value={form.sellPrice} onChange={(e) => setForm({ ...form, sellPrice: e.target.value })} required />
            <Input label="Low Stock Threshold" type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

