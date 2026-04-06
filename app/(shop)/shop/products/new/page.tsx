"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockApi, USE_MOCK_API } from "@/lib/api-mock";
import { formatBDT } from "@/lib/utils";
import { Product } from "@/types";
import PageHeader from "@/components/ui/PageHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const CATEGORIES = [
  "Rice & Grains", "Oil & Ghee", "Sugar & Sweet", "Salt & Spice",
  "Vegetables", "Dairy", "Lentils & Pulses", "Cleaning", "Personal Care",
  "Snacks & Beverages", "Frozen", "Others",
];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", nameBn: "", sku: "", category: CATEGORIES[0],
    unit: "pcs", costPrice: "", sellPrice: "", stock: "", lowStockThreshold: "10",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await mockApi.products.create({
        Name: form.name,
        Barcode: form.sku,
        SellPricePaisa: Math.round(Number(form.sellPrice) * 100),
        Category: form.category,
        Unit: form.unit,
        CostPricePaisa: Math.round(Number(form.costPrice) * 100),
        LowStockThreshold: Number(form.lowStockThreshold),
      });
      router.push("/shop/products");
    } catch (error) {
      console.error("Failed to create product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Add Product" description="Create a new product in your catalog" breadcrumbs={[{ label: "Products", href: "/shop/products" }, { label: "New" }]} />
      <Card padding="lg">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Product Name (English)" placeholder="e.g. Rice (Miniket)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Product Name (Bengali)" placeholder="e.g. চাল (মিনিকেট)" value={form.nameBn} onChange={(e) => setForm({ ...form, nameBn: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="SKU / Barcode" placeholder="e.g. RC-MNK-001" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary-500">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input label="Unit" placeholder="kg, pcs, L" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} required />
            <Input label="Cost Price (৳)" type="number" placeholder="0" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} required />
            <Input label="Sell Price (৳)" type="number" placeholder="0" value={form.sellPrice} onChange={(e) => setForm({ ...form, sellPrice: e.target.value })} required />
            <Input label="Initial Stock" type="number" placeholder="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
          </div>
          <Input label="Low Stock Threshold" type="number" placeholder="10" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} />
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Add Product"}</Button>
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}