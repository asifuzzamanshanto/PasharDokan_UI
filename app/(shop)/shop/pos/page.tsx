"use client";

import { useState, useMemo, useEffect } from "react";
import { formatBDT } from "@/lib/utils";
import { clientApi } from "@/lib/client-api";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Product {
  productId: number;
  name: string;
  barcode: string;
  sellPricePaisa: number;
  isActive: boolean;
  currentQty: number;
  category?: string;
  unit?: string;
}

interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function POSPage() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentType, setPaymentType] = useState<"paid" | "due">("paid");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const [lastSale, setLastSale] = useState<{ saleId: number; invoiceNo: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    clientApi.products.list().then((res) => {
      setProducts(res as Product[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    if (!search) return products.filter((p) => p.isActive && p.currentQty > 0);
    return products.filter(
      (p) =>
        p.isActive &&
        p.currentQty > 0 &&
        (p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.barcode.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, products]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.productId
            ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.unitPrice }
            : i
        );
      }
      return [...prev, { 
        productId: product.productId, 
        productName: product.name, 
        quantity: 1, 
        unitPrice: product.sellPricePaisa, 
        total: product.sellPricePaisa 
      }];
    });
  };

  const updateQty = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.productId !== productId) return i;
          const newQty = i.quantity + delta;
          if (newQty <= 0) return null;
          return { ...i, quantity: newQty, total: newQty * i.unitPrice };
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const subtotal = cart.reduce((sum, i) => sum + i.total, 0);
  const [discount, setDiscount] = useState(0);
  const total = subtotal - discount;

  const handleCompleteSale = async () => {
    setSubmitting(true);
    try {
      const result = await clientApi.sales.create({
        items: cart.map((item) => ({ productId: item.productId, qty: item.quantity })),
      }) as { saleId: number; totalPaisa: number; createdAt: string };
      
      setLastSale({ saleId: result.saleId, invoiceNo: `INV-${result.saleId}` });
      setInvoiceGenerated(true);
      
      const res = await clientApi.products.list();
      setProducts(res as Product[]);
    } catch (error) {
      console.error("Sale failed:", error);
      alert("Failed to complete sale. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (invoiceGenerated) {
    return (
      <div className="max-w-md mx-auto">
        <PageHeader title="Invoice Preview" breadcrumbs={[{ label: "POS", href: "/shop/pos" }, { label: "Invoice" }]} />
        <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
            </div>
            <h2 className="text-lg font-bold text-text-primary">Sale Complete</h2>
            <p className="text-sm text-text-tertiary mt-0.5">{lastSale?.invoiceNo}</p>
          </div>

          <div className="border border-border rounded-lg p-4 mb-4">
            <div className="text-xs text-text-tertiary mb-3">
              <p className="font-semibold text-text-primary text-sm mb-1">Your Shop</p>
              <p>Invoice: {lastSale?.invoiceNo} · {new Date().toLocaleString("en-GB")}</p>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-1 font-semibold text-text-secondary">Item</th>
                  <th className="text-center py-1 font-semibold text-text-secondary">Qty</th>
                  <th className="text-right py-1 font-semibold text-text-secondary">Price</th>
                  <th className="text-right py-1 font-semibold text-text-secondary">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.productId} className="border-b border-border">
                    <td className="py-1.5">{item.productName}</td>
                    <td className="py-1.5 text-center">{item.quantity}</td>
                    <td className="py-1.5 text-right">{formatBDT(item.unitPrice)}</td>
                    <td className="py-1.5 text-right font-medium">{formatBDT(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 pt-2 border-t border-border space-y-1 text-xs">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatBDT(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between"><span>Discount</span><span>-{formatBDT(discount)}</span></div>}
              <div className="flex justify-between font-bold text-sm pt-1"><span>Total</span><span>{formatBDT(total)}</span></div>
              <div className="flex justify-between"><span>Paid</span><span className="text-emerald-600">{formatBDT(paymentType === "paid" ? total : 0)}</span></div>
              {paymentType === "due" && <div className="flex justify-between"><span>Due</span><span className="text-red-600">{formatBDT(total)}</span></div>}
            </div>
          </div>

          {customerName && <p className="text-xs text-text-secondary mb-1">Customer: {customerName}</p>}
          {customerPhone && <p className="text-xs text-text-secondary mb-4">Phone: {customerPhone}</p>}

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" size="sm">Print</Button>
            <Button className="flex-1" size="sm" onClick={() => { setCart([]); setInvoiceGenerated(false); setSearch(""); setCustomerName(""); setCustomerPhone(""); setDiscount(0); setLastSale(null); }}>New Sale</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 -m-4 lg:-m-6">
      <div className="flex-1 p-4 lg:p-6">
        <div className="mb-4">
          <h1 className="text-lg font-bold text-text-primary mb-1">POS Billing</h1>
          <p className="text-xs text-text-tertiary">Search products and add to cart</p>
        </div>
        <Input placeholder="Search by name or barcode..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4" />
        {loading ? (
          <div className="text-center py-8 text-sm text-text-tertiary">Loading products...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 max-h-[calc(100vh-14rem)] overflow-y-auto">
            {filteredProducts.map((p) => (
              <button
                key={p.productId}
                onClick={() => addToCart(p)}
                className="pos-item-btn text-left p-3 bg-surface rounded-lg border border-border hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <p className="text-xs font-semibold text-text-primary truncate">{p.name}</p>
                <p className="text-[10px] text-text-tertiary truncate">{p.barcode}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-primary-600">{formatBDT(p.sellPricePaisa)}</span>
                  <span className="text-[10px] text-text-tertiary">{p.currentQty} {p.unit || ""}</span>
                </div>
              </button>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-8 text-sm text-text-tertiary">No products found</div>
            )}
          </div>
        )}
      </div>

      <div className="w-full lg:w-80 bg-surface border-t lg:border-t-0 lg:border-l border-border p-4 lg:p-5">
        <h2 className="font-semibold text-sm text-text-primary mb-3">Current Sale</h2>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <input
            placeholder="Customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="rounded-lg border border-border bg-surface-sunken px-2.5 py-1.5 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary-500"
          />
          <input
            placeholder="Phone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="rounded-lg border border-border bg-surface-sunken px-2.5 py-1.5 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center py-6 text-xs text-text-tertiary">No items added</div>
          ) : (
            cart.map((item) => (
              <div key={item.productId} className="flex items-center gap-2 p-2 bg-surface-sunken rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">{item.productName}</p>
                  <p className="text-[10px] text-text-tertiary">{formatBDT(item.unitPrice)} × {item.quantity}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQty(item.productId, -1)} className="w-6 h-6 flex items-center justify-center rounded bg-surface border border-border text-xs hover:bg-surface-sunken cursor-pointer">−</button>
                  <span className="text-xs font-semibold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.productId, 1)} className="w-6 h-6 flex items-center justify-center rounded bg-surface border border-border text-xs hover:bg-surface-sunken cursor-pointer">+</button>
                </div>
                <span className="text-xs font-bold text-text-primary w-16 text-right">{formatBDT(item.total)}</span>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <>
            <div className="space-y-1.5 text-xs mb-4">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="font-medium text-text-primary">{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-text-secondary">
                <span>Discount</span>
                <input
                  type="number"
                  min={0}
                  max={subtotal}
                  value={discount || ""}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-20 text-right rounded border border-border px-2 py-1 text-xs focus:outline-none focus:border-primary-500"
                  placeholder="0"
                />
              </div>
              <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
                <span>Total</span>
                <span className="text-primary-600">{formatBDT(total)}</span>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setPaymentType("paid")}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  paymentType === "paid" ? "bg-emerald-600 text-white" : "bg-surface-sunken text-text-secondary border border-border"
                }`}
              >
                Paid
              </button>
              <button
                onClick={() => setPaymentType("due")}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  paymentType === "due" ? "bg-amber-600 text-white" : "bg-surface-sunken text-text-secondary border border-border"
                }`}
              >
                Due (Baki)
              </button>
            </div>

            <Button className="w-full" size="lg" onClick={handleCompleteSale} disabled={submitting}>
              {submitting ? "Processing..." : `Complete Sale — ${formatBDT(total)}`}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}