import { Product, Invoice, DueCustomer, DueTransaction, StockMovement, Shop, ShopDashboardStats, AdminDashboardStats } from "@/types";

// ── Mock Data ──
const MOCK_SHOPS: Shop[] = [
  { id: "s1", name: "Rahim Store", nameBn: "রহিম স্টোর", ownerName: "Rahim Ahmed", ownerPhone: "01712345678", address: "12 Kawran Bazar", city: "Dhaka", tradeLicenseNo: "TRAD-2024-001", status: "active", appliedAt: "2025-06-01", verifiedAt: "2025-06-03", activatedAt: "2025-06-05", staffCount: 4, totalSales: 2_450_000, totalDue: 38_500 },
  { id: "s2", name: "Fatema Grocery", nameBn: "ফাতেমা গ্রোসারি", ownerName: "Fatema Begum", ownerPhone: "01898765432", address: "45 Green Road", city: "Dhaka", tradeLicenseNo: "TRAD-2024-002", status: "active", appliedAt: "2025-07-10", verifiedAt: "2025-07-12", activatedAt: "2025-07-14", staffCount: 2, totalSales: 1_120_000, totalDue: 15_200 },
  { id: "s3", name: "Karim Bhai Shop", nameBn: "করিম ভাই শপ", ownerName: "Karim Hossain", phone: "01556789012", address: "78 Uttara Sector 4", city: "Dhaka", tradeLicenseNo: "TRAD-2024-003", status: "pending", appliedAt: "2026-03-28", verifiedAt: null, activatedAt: null, staffCount: 0, totalSales: 0, totalDue: 0 },
  { id: "s4", name: "Shapla Store", nameBn: "শাপলা স্টোর", ownerName: "Nasreen Akter", ownerPhone: "01634567890", address: "22 Mirpur 10", city: "Dhaka", tradeLicenseNo: "TRAD-2024-004", status: "verified", appliedAt: "2026-03-15", verifiedAt: "2026-03-20", activatedAt: null, staffCount: 0, totalSales: 0, totalDue: 0 },
  { id: "s5", name: "Jamal Traders", nameBn: "জামাল ট্রেডার্স", ownerName: "Jamal Uddin", ownerPhone: "01912345678", address: "10 Dhanmondi", city: "Dhaka", tradeLicenseNo: "TRAD-2023-010", status: "suspended", appliedAt: "2025-03-01", verifiedAt: "2025-03-05", activatedAt: "2025-03-07", staffCount: 3, totalSales: 890_000, totalDue: 62_000 },
];

const MOCK_PRODUCTS: Product[] = [
  { id: "p1", shopId: "s1", name: "Rice (Miniket)", nameBn: "চাল (মিনিকেট)", sku: "RC-MNK-001", category: "Rice & Grains", unit: "kg", costPrice: 58, sellPrice: 68, stock: 450, lowStockThreshold: 100, isActive: true, createdAt: "2025-06-10", updatedAt: "2026-04-01" },
  { id: "p2", shopId: "s1", name: "Soybean Oil", nameBn: "সয়াবিন তেল", sku: "OIL-SYB-001", category: "Oil & Ghee", unit: "L", costPrice: 155, sellPrice: 175, stock: 80, lowStockThreshold: 20, isActive: true, createdAt: "2025-06-10", updatedAt: "2026-04-01" },
  { id: "p3", shopId: "s1", name: "Sugar", nameBn: "চিনি", sku: "SGR-WHT-001", category: "Sugar & Sweet", unit: "kg", costPrice: 120, sellPrice: 140, stock: 12, lowStockThreshold: 30, isActive: true, createdAt: "2025-06-10", updatedAt: "2026-04-02" },
  { id: "p4", shopId: "s1", name: "Salt (Iodized)", nameBn: "লবণ (আয়োডিন)", sku: "SLT-IDD-001", category: "Salt & Spice", unit: "kg", costPrice: 38, sellPrice: 48, stock: 200, lowStockThreshold: 50, isActive: true, createdAt: "2025-06-10", updatedAt: "2026-03-30" },
  { id: "p5", shopId: "s1", name: "Onion", nameBn: "পেঁয়াজ", sku: "VEG-ONN-001", category: "Vegetables", unit: "kg", costPrice: 55, sellPrice: 70, stock: 8, lowStockThreshold: 25, isActive: true, createdAt: "2025-06-10", updatedAt: "2026-04-02" },
  { id: "p6", shopId: "s1", name: "Potato", nameBn: "আলু", sku: "VEG-PTO-001", category: "Vegetables", unit: "kg", costPrice: 32, sellPrice: 42, stock: 150, lowStockThreshold: 40, isActive: true, createdAt: "2025-06-10", updatedAt: "2026-04-01" },
  { id: "p7", shopId: "s1", name: "Milk Powder (Dano)", nameBn: "পাউডার দুধ (ড্যানো)", sku: "DRY-MLK-001", category: "Dairy", unit: "pack", costPrice: 520, sellPrice: 580, stock: 5, lowStockThreshold: 10, isActive: true, createdAt: "2025-06-10", updatedAt: "2026-04-01" },
  { id: "p8", shopId: "s1", name: "Egg (Dozen)", nameBn: "ডিম (ডজন)", sku: "DRY-EGG-001", category: "Dairy", unit: "dozen", costPrice: 135, sellPrice: 155, stock: 35, lowStockThreshold: 15, isActive: true, createdAt: "2025-06-10", updatedAt: "2026-04-02" },
  { id: "p9", shopId: "s1", name: "Lentil (Masoor)", nameBn: "মসুর ডাল", sku: "DLT-MSR-001", category: "Lentils & Pulses", unit: "kg", costPrice: 95, sellPrice: 115, stock: 60, lowStockThreshold: 20, isActive: true, createdAt: "2025-06-10", updatedAt: "2026-03-28" },
  { id: "p10", shopId: "s1", name: "Chickpeas (Chhola)", nameBn: "ছোলা", sku: "DLT-CHL-001", category: "Lentils & Pulses", unit: "kg", costPrice: 85, sellPrice: 105, stock: 40, lowStockThreshold: 15, isActive: true, createdAt: "2025-06-10", updatedAt: "2026-03-28" },
  { id: "p11", shopId: "s1", name: "Detergent (Surf Excel)", nameBn: "ডিটারজেন্ট (সার্ফ এক্সেল)", sku: "CLN-DET-001", category: "Cleaning", unit: "pack", costPrice: 175, sellPrice: 210, stock: 18, lowStockThreshold: 10, isActive: true, createdAt: "2025-07-01", updatedAt: "2026-03-25" },
  { id: "p12", shopId: "s1", name: "Toothpaste (Pepsodent)", nameBn: "টুথপেস্ট (পেপসোডেন্ট)", sku: "HYG-TPT-001", category: "Personal Care", unit: "pc", costPrice: 62, sellPrice: 78, stock: 0, lowStockThreshold: 8, isActive: true, createdAt: "2025-07-01", updatedAt: "2026-04-01" },
];

const MOCK_INVOICES: Invoice[] = [
  { id: "inv1", shopId: "s1", invoiceNo: "INV-1044", items: [{ productId: "p1", productName: "Rice (Miniket)", quantity: 5, unitPrice: 68, total: 340 }, { productId: "p2", productName: "Soybean Oil", quantity: 2, unitPrice: 175, total: 350 }, { productId: "p12", productName: "Toothpaste (Pepsodent)", quantity: 8, unitPrice: 78, total: 624 }], subtotal: 1314, discount: 0, total: 1314, paidAmount: 1314, dueAmount: 0, paymentStatus: "paid", customerId: null, customerName: null, customerPhone: null, soldBy: "Nila (Seller)", createdAt: "2026-04-02T10:15:00Z" },
  { id: "inv2", shopId: "s1", invoiceNo: "INV-1043", items: [{ productId: "p7", productName: "Milk Powder (Dano)", quantity: 5, unitPrice: 580, total: 2900 }, { productId: "p8", productName: "Egg (Dozen)", quantity: 3, unitPrice: 155, total: 465 }], subtotal: 3365, discount: 50, total: 3315, paidAmount: 1500, dueAmount: 1815, paymentStatus: "partial_due", customerId: "dc1", customerName: "Abdul Mia", customerPhone: "01711111111", soldBy: "Kamal (Seller)", createdAt: "2026-04-02T08:45:00Z" },
  { id: "inv3", shopId: "s1", invoiceNo: "INV-1042", items: [{ productId: "p1", productName: "Rice (Miniket)", quantity: 10, unitPrice: 68, total: 680 }, { productId: "p3", productName: "Sugar", quantity: 18, unitPrice: 140, total: 2520 }, { productId: "p4", productName: "Salt (Iodized)", quantity: 5, unitPrice: 48, total: 240 }], subtotal: 3440, discount: 0, total: 3440, paidAmount: 0, dueAmount: 3440, paymentStatus: "full_due", customerId: "dc2", customerName: "Salma Khatun", customerPhone: "01822222222", soldBy: "Kamal (Seller)", createdAt: "2026-04-01T11:30:00Z" },
  { id: "inv4", shopId: "s1", invoiceNo: "INV-1041", items: [{ productId: "p6", productName: "Potato", quantity: 8, unitPrice: 42, total: 336 }, { productId: "p9", productName: "Lentil (Masoor)", quantity: 3, unitPrice: 115, total: 345 }], subtotal: 681, discount: 0, total: 681, paidAmount: 681, dueAmount: 0, paymentStatus: "paid", customerId: null, customerName: null, customerPhone: null, soldBy: "Nila (Seller)", createdAt: "2026-04-01T09:20:00Z" },
];

const MOCK_DUE_CUSTOMERS: DueCustomer[] = [
  { id: "dc1", shopId: "s1", name: "Abdul Mia", phone: "01711111111", address: "Kawran Bazar, Dhaka", totalDue: 5815, isOverdue: false, lastTransactionAt: "2026-04-02T08:45:00Z", createdAt: "2025-08-15" },
  { id: "dc2", shopId: "s1", name: "Salma Khatun", phone: "01822222222", address: "Farmgate, Dhaka", totalDue: 12340, isOverdue: true, lastTransactionAt: "2026-04-01T11:30:00Z", createdAt: "2025-09-20" },
  { id: "dc3", shopId: "s1", name: "Rafiq Bepari", phone: "01933333333", address: "Tejgaon, Dhaka", totalDue: 7200, isOverdue: false, lastTransactionAt: "2026-03-31T16:40:00Z", createdAt: "2025-11-05" },
  { id: "dc4", shopId: "s1", name: "Hasina Begum", phone: "01544444444", address: "Mohammadpur, Dhaka", totalDue: 2150, isOverdue: true, lastTransactionAt: "2026-03-15T10:00:00Z", createdAt: "2026-01-10" },
];

const MOCK_DUE_TRANSACTIONS: DueTransaction[] = [
  { id: "dt1", customerId: "dc1", type: "sale", amount: 3315, invoiceId: "inv2", invoiceNo: "INV-1043", note: "Purchase on due", performedBy: "Kamal (Seller)", createdAt: "2026-04-02T08:45:00Z" },
  { id: "dt2", customerId: "dc1", type: "payment", amount: -2000, invoiceId: null, invoiceNo: null, note: "Partial cash payment", performedBy: "Rahim (Owner)", createdAt: "2026-03-28T14:00:00Z" },
  { id: "dt3", customerId: "dc2", type: "sale", amount: 3440, invoiceId: "inv3", invoiceNo: "INV-1042", note: "Purchase on due", performedBy: "Kamal (Seller)", createdAt: "2026-04-01T11:30:00Z" },
];

const MOCK_STOCK_MOVEMENTS: StockMovement[] = [
  { id: "sm1", productId: "p1", productName: "Rice (Miniket)", type: "stock_in", quantity: 200, previousStock: 250, newStock: 450, reason: "Supplier delivery", performedBy: "Rahim (Owner)", createdAt: "2026-04-01T09:00:00Z" },
  { id: "sm2", productId: "p3", productName: "Sugar", type: "sale", quantity: 18, previousStock: 30, newStock: 12, reason: "POS sale #INV-1042", performedBy: "Kamal (Seller)", createdAt: "2026-04-01T11:30:00Z" },
  { id: "sm3", productId: "p5", productName: "Onion", type: "stock_out", quantity: 17, previousStock: 25, newStock: 8, reason: "Spoilage removal", performedBy: "Rahim (Owner)", createdAt: "2026-04-01T14:00:00Z" },
];

// ── Mock API Functions ──
// These functions simulate API calls with mock data
// When backend is ready, switch to use real API from api.ts

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Auth
  auth: {
    login: async (email: string, _password: string) => {
      await delay(300);
      const user = email.includes("admin") 
        ? { id: "a1", name: "Platform Admin", phone: "01811111111", role: "platform_admin", shopId: null }
        : { id: "u1", name: "Rahim Ahmed", phone: "01712345678", role: "owner", shopId: "s1", shopName: "Rahim Store", shopStatus: "active" as const };
      return { token: "mock-token-123", user };
    },
    register: async () => { await delay(300); return { message: "Registration successful" }; },
    logout: async () => { await delay(100); return { message: "Logged out" }; },
  },

  // Shop
  shop: {
    apply: async (data: { ShopName: string; OwnerName: string; OwnerPhone: string; OwnerEmail: string }) => {
      await delay(500);
      return { message: "Application submitted", applicationId: Math.floor(Math.random() * 1000) };
    },
    context: async () => {
      await delay(200);
      return { shop: MOCK_SHOPS[0], user: { id: "u1", name: "Rahim Ahmed", role: "owner" } };
    },
    getMembers: async () => {
      await delay(200);
      return { members: [
        { id: "u1", name: "Rahim Ahmed", phone: "01712345678", role: "owner", active: true },
        { id: "u2", name: "Kamal Hossain", phone: "01556789012", role: "seller", active: true },
        { id: "u3", name: "Nila Akter", phone: "01634567890", role: "seller", active: true },
      ]};
    },
    addMember: async () => { await delay(300); return { message: "Member added" }; },
  },

  // Products
  products: {
    list: async () => {
      await delay(200);
      return { products: MOCK_PRODUCTS };
    },
    get: async (id: string) => {
      await delay(200);
      return { product: MOCK_PRODUCTS.find(p => p.id === id) };
    },
    create: async (data: { Name: string; Barcode: string; SellPricePaisa: number }) => {
      await delay(300);
      const newProduct = { id: `p${Date.now()}`, ...data, shopId: "s1", stock: 0, isActive: true };
      return { product: newProduct, message: "Product created" };
    },
    update: async (id: string, data: Partial<Product>) => {
      await delay(300);
      const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
      if (idx >= 0) Object.assign(MOCK_PRODUCTS[idx], data);
      return { product: MOCK_PRODUCTS[idx], message: "Product updated" };
    },
    toggleActive: async (id: string, active: boolean) => {
      await delay(200);
      const p = MOCK_PRODUCTS.find(p => p.id === id);
      if (p) p.isActive = active;
      return { message: `Product ${active ? "activated" : "deactivated"}` };
    },
  },

  // Sales
  sales: {
    list: async () => {
      await delay(200);
      return { sales: MOCK_INVOICES };
    },
    get: async (id: string) => {
      await delay(200);
      return { sale: MOCK_INVOICES.find(i => i.id === id) };
    },
    create: async (data: { Items: { ProductId: string; Qty: number }[]; PaidAmount?: number; CustomerName?: string; CustomerPhone?: string; Discount?: number }) => {
      await delay(300);
      const items = data.Items.map(item => {
        const product = MOCK_PRODUCTS.find(p => p.id === item.ProductId);
        return { productId: item.ProductId, productName: product?.name || "Unknown", quantity: item.Qty, unitPrice: product?.sellPrice || 0, total: (product?.sellPrice || 0) * item.Qty };
      });
      const subtotal = items.reduce((s, i) => s + i.total, 0);
      const discount = data.Discount || 0;
      const total = subtotal - discount;
      const paidAmount = data.PaidAmount ?? total;
      const dueAmount = total - paidAmount;
      const newInvoice: Invoice = {
        id: `inv${Date.now()}`, shopId: "s1", invoiceNo: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
        items, subtotal, discount, total, paidAmount, dueAmount,
        paymentStatus: dueAmount > 0 ? (paidAmount > 0 ? "partial_due" : "full_due") : "paid",
        customerId: null, customerName: data.CustomerName || null, customerPhone: data.CustomerPhone || null,
        soldBy: "Current User", createdAt: new Date().toISOString()
      };
      return { sale: newInvoice, message: "Sale completed" };
    },
  },

  // Due
  due: {
    getCustomers: async (_shopId?: string) => {
      await delay(200);
      return { customers: MOCK_DUE_CUSTOMERS };
    },
    createCustomer: async (data: { Name: string; PhoneNumber: string; Address: string }) => {
      await delay(300);
      const newCustomer: DueCustomer = {
        id: `dc${Date.now()}`, shopId: "s1", name: data.Name, phone: data.PhoneNumber, address: data.Address, totalDue: 0, isOverdue: false, lastTransactionAt: new Date().toISOString(), createdAt: new Date().toISOString()
      };
      return { customer: newCustomer, message: "Customer created" };
    },
    updateCustomer: async (_customerId: string, data: Partial<DueCustomer>) => {
      await delay(300);
      return { customer: data, message: "Customer updated" };
    },
    getEntries: async (customerId: string) => {
      await delay(200);
      return { entries: MOCK_DUE_TRANSACTIONS.filter(t => t.customerId === customerId) };
    },
    createEntry: async (customerId: string, data: { Amount: number; EntryType: number; Remarks?: string }) => {
      await delay(300);
      const newEntry: DueTransaction = {
        id: `dt${Date.now()}`, customerId, type: data.EntryType === 1 ? "sale" : "payment",
        amount: data.EntryType === 1 ? data.Amount : -data.Amount, invoiceId: null, invoiceNo: null, note: data.Remarks || "", performedBy: "Current User", createdAt: new Date().toISOString()
      };
      return { entry: newEntry, message: "Entry added" };
    },
  },

  // Inventory
  inventory: {
    stockIn: async (data: { ProductId: string; Qty: number; UnitCostPaisa: number; Note?: string }) => {
      await delay(300);
      const p = MOCK_PRODUCTS.find(prod => prod.id === data.ProductId);
      if (p) { p.stock += data.Qty; p.costPrice = data.UnitCostPaisa / 100; }
      return { message: "Stock added" };
    },
    adjust: async (data: { ProductId: string; QtyChange: number; Note?: string }) => {
      await delay(300);
      const p = MOCK_PRODUCTS.find(prod => prod.id === data.ProductId);
      if (p) { p.stock = Math.max(0, p.stock + data.QtyChange); }
      return { message: "Stock adjusted" };
    },
    ledger: async (_productId?: string) => {
      await delay(200);
      return { ledger: MOCK_STOCK_MOVEMENTS };
    },
  },

  // Reports
  reports: {
    salesSummary: async () => {
      await delay(200);
      const paidInvoices = MOCK_INVOICES.filter(i => i.paymentStatus === "paid");
      const dueInvoices = MOCK_INVOICES.filter(i => i.paymentStatus !== "paid");
      return {
        totalSales: MOCK_INVOICES.reduce((s, i) => s + i.total, 0),
        paidSales: paidInvoices.reduce((s, i) => s + i.paidAmount, 0),
        dueOutstanding: dueInvoices.reduce((s, i) => s + i.dueAmount, 0),
        collectionRate: Math.round((paidInvoices.length / MOCK_INVOICES.length) * 100),
        todaySales: MOCK_INVOICES.reduce((s, i) => s + i.total, 0),
        invoiceCount: MOCK_INVOICES.length
      };
    },
    topProducts: async (_limit = 10) => {
      await delay(200);
      return {
        products: [
          { name: "Rice (Miniket)", quantity: 145, revenue: 9860 },
          { name: "Soybean Oil", quantity: 62, revenue: 10850 },
          { name: "Sugar", quantity: 88, revenue: 12320 },
        ]
      };
    },
    categoryDistribution: async () => {
      await delay(200);
      return {
        categories: [
          { category: "Rice & Grains", count: 2, percentage: 17 },
          { category: "Oil & Ghee", count: 2, percentage: 17 },
          { category: "Vegetables", count: 2, percentage: 17 },
          { category: "Dairy", count: 2, percentage: 17 },
          { category: "Lentils & Pulses", count: 2, percentage: 16 },
          { category: "Others", count: 2, percentage: 16 },
        ]
      };
    },
  },

  // Admin
  admin: {
    getDashboard: async () => {
      await delay(200);
      return { totalShops: 5, activeShops: 2, pendingApplications: 1, suspendedShops: 1, totalPlatformRevenue: 4_460_000 };
    },
    getShopApplications: async () => {
      await delay(200);
      return { applications: MOCK_SHOPS.filter(s => s.status === "pending") };
    },
    getShops: async () => {
      await delay(200);
      return { shops: MOCK_SHOPS };
    },
    approveShop: async (id: string) => {
      await delay(300);
      const shop = MOCK_SHOPS.find(s => s.id === id);
      if (shop) shop.status = "verified";
      return { message: "Shop approved" };
    },
    rejectShop: async (id: string) => {
      await delay(300);
      const shop = MOCK_SHOPS.find(s => s.id === id);
      if (shop) shop.status = "suspended";
      return { message: "Shop rejected" };
    },
  },
};

// Helper to decide whether to use mock or real API
export const USE_MOCK_API = true; // Set to false when backend is ready