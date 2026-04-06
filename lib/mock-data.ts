import {
  Product, Invoice, DueCustomer, DueTransaction, StockMovement,
  Shop, ShopDashboardStats, AdminDashboardStats,
} from "@/types";

// ── Shops ──
export const SHOPS: Shop[] = [
  {
    id: "s1", name: "Rahim Store", nameBn: "রহিম স্টোর",
    ownerName: "Rahim Ahmed", ownerPhone: "01712345678",
    address: "12 Kawran Bazar", city: "Dhaka",
    tradeLicenseNo: "TRAD-2024-001", status: "active",
    appliedAt: "2025-06-01", verifiedAt: "2025-06-03", activatedAt: "2025-06-05",
    staffCount: 4, totalSales: 2_450_000, totalDue: 38_500,
  },
  {
    id: "s2", name: "Fatema Grocery", nameBn: "ফাতেমা গ্রোসারি",
    ownerName: "Fatema Begum", ownerPhone: "01898765432",
    address: "45 Green Road", city: "Dhaka",
    tradeLicenseNo: "TRAD-2024-002", status: "active",
    appliedAt: "2025-07-10", verifiedAt: "2025-07-12", activatedAt: "2025-07-14",
    staffCount: 2, totalSales: 1_120_000, totalDue: 15_200,
  },
  {
    id: "s3", name: "Karim Bhai Shop", nameBn: "করিম ভাই শপ",
    ownerName: "Karim Hossain", ownerPhone: "01556789012",
    address: "78 Uttara Sector 4", city: "Dhaka",
    tradeLicenseNo: "TRAD-2024-003", status: "pending",
    appliedAt: "2026-03-28", verifiedAt: null, activatedAt: null,
    staffCount: 0, totalSales: 0, totalDue: 0,
  },
  {
    id: "s4", name: "Shapla Store", nameBn: "শাপলা স্টোর",
    ownerName: "Nasreen Akter", ownerPhone: "01634567890",
    address: "22 Mirpur 10", city: "Dhaka",
    tradeLicenseNo: "TRAD-2024-004", status: "verified",
    appliedAt: "2026-03-15", verifiedAt: "2026-03-20", activatedAt: null,
    staffCount: 0, totalSales: 0, totalDue: 0,
  },
  {
    id: "s5", name: "Jamal Traders", nameBn: "জামাল ট্রেডার্স",
    ownerName: "Jamal Uddin", ownerPhone: "01912345678",
    address: "10 Dhanmondi", city: "Dhaka",
    tradeLicenseNo: "TRAD-2023-010", status: "suspended",
    appliedAt: "2025-03-01", verifiedAt: "2025-03-05", activatedAt: "2025-03-07",
    staffCount: 3, totalSales: 890_000, totalDue: 62_000,
  },
];

// ── Products (for shop s1 and s2) ──
export const PRODUCTS: Product[] = [
  // Shop A (Rahim Store) products
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
  // Shop B (Fatema Grocery) products
  { id: "p13", shopId: "s2", name: "Basmati Rice", nameBn: "বাসমতি চাল", sku: "RC-BAS-001", category: "Rice & Grains", unit: "kg", costPrice: 120, sellPrice: 145, stock: 200, lowStockThreshold: 50, isActive: true, createdAt: "2025-07-15", updatedAt: "2026-04-01" },
  { id: "p14", shopId: "s2", name: "Mustard Oil", nameBn: "সরিষার তেল", sku: "OIL-MUS-001", category: "Oil & Ghee", unit: "L", costPrice: 200, sellPrice: 240, stock: 45, lowStockThreshold: 15, isActive: true, createdAt: "2025-07-15", updatedAt: "2026-04-01" },
  { id: "p15", shopId: "s2", name: "Turmeric Powder", nameBn: "হলুদ গুঁড়ো", sku: "SPT-TUR-001", category: "Salt & Spice", unit: "kg", costPrice: 180, sellPrice: 220, stock: 25, lowStockThreshold: 10, isActive: true, createdAt: "2025-07-15", updatedAt: "2026-03-28" },
  { id: "p16", shopId: "s2", name: "Coriander Seeds", nameBn: "জিরা", sku: "SPT-COR-001", category: "Salt & Spice", unit: "kg", costPrice: 250, sellPrice: 300, stock: 15, lowStockThreshold: 5, isActive: true, createdAt: "2025-07-15", updatedAt: "2026-03-20" },
  { id: "p17", shopId: "s2", name: "Garlic", nameBn: "রসুন", sku: "VEG-GAR-001", category: "Vegetables", unit: "kg", costPrice: 150, sellPrice: 180, stock: 30, lowStockThreshold: 10, isActive: true, createdAt: "2025-07-15", updatedAt: "2026-04-02" },
  { id: "p18", shopId: "s2", name: "Ginger", nameBn: "আদা", sku: "VEG-GIN-001", category: "Vegetables", unit: "kg", costPrice: 180, sellPrice: 220, stock: 18, lowStockThreshold: 8, isActive: true, createdAt: "2025-07-15", updatedAt: "2026-04-01" },
];

// ── Stock Movements ──
export const STOCK_MOVEMENTS: StockMovement[] = [
  { id: "sm1", productId: "p1", productName: "Rice (Miniket)", type: "stock_in", quantity: 200, previousStock: 250, newStock: 450, reason: "Supplier delivery", performedBy: "Rahim (Owner)", createdAt: "2026-04-01T09:00:00Z" },
  { id: "sm2", productId: "p3", productName: "Sugar", type: "sale", quantity: 18, previousStock: 30, newStock: 12, reason: "POS sale #INV-1042", performedBy: "Kamal (Seller)", createdAt: "2026-04-01T11:30:00Z" },
  { id: "sm3", productId: "p5", productName: "Onion", type: "stock_out", quantity: 17, previousStock: 25, newStock: 8, reason: "Spoilage removal", performedBy: "Rahim (Owner)", createdAt: "2026-04-01T14:00:00Z" },
  { id: "sm4", productId: "p7", productName: "Milk Powder (Dano)", type: "sale", quantity: 5, previousStock: 10, newStock: 5, reason: "POS sale #INV-1043", performedBy: "Kamal (Seller)", createdAt: "2026-04-02T08:45:00Z" },
  { id: "sm5", productId: "p12", productName: "Toothpaste (Pepsodent)", type: "sale", quantity: 8, previousStock: 8, newStock: 0, reason: "POS sale #INV-1044", performedBy: "Nila (Seller)", createdAt: "2026-04-02T10:15:00Z" },
  { id: "sm6", productId: "p2", productName: "Soybean Oil", type: "stock_in", quantity: 50, previousStock: 30, newStock: 80, reason: "Supplier restock", performedBy: "Rahim (Owner)", createdAt: "2026-04-02T07:00:00Z" },
  { id: "sm7", productId: "p9", productName: "Lentil (Masoor)", type: "adjustment", quantity: -5, previousStock: 65, newStock: 60, reason: "Weight correction after audit", performedBy: "Rahim (Owner)", createdAt: "2026-03-30T16:00:00Z" },
];

// ── Invoices ──
export const INVOICES: Invoice[] = [
  // Shop A (Rahim Store) invoices
  {
    id: "inv1", shopId: "s1", invoiceNo: "INV-1044",
    items: [
      { productId: "p1", productName: "Rice (Miniket)", quantity: 5, unitPrice: 68, total: 340 },
      { productId: "p2", productName: "Soybean Oil", quantity: 2, unitPrice: 175, total: 350 },
      { productId: "p12", productName: "Toothpaste (Pepsodent)", quantity: 8, unitPrice: 78, total: 624 },
    ],
    subtotal: 1314, discount: 0, total: 1314, paidAmount: 1314, dueAmount: 0,
    paymentStatus: "paid", customerId: null, customerName: null, customerPhone: null,
    soldBy: "Nila (Seller)", createdAt: "2026-04-02T10:15:00Z",
  },
  {
    id: "inv2", shopId: "s1", invoiceNo: "INV-1043",
    items: [
      { productId: "p7", productName: "Milk Powder (Dano)", quantity: 5, unitPrice: 580, total: 2900 },
      { productId: "p8", productName: "Egg (Dozen)", quantity: 3, unitPrice: 155, total: 465 },
    ],
    subtotal: 3365, discount: 50, total: 3315, paidAmount: 1500, dueAmount: 1815,
    paymentStatus: "partial_due", customerId: "dc1", customerName: "Abdul Mia", customerPhone: "01711111111",
    soldBy: "Kamal (Seller)", createdAt: "2026-04-02T08:45:00Z",
  },
  {
    id: "inv3", shopId: "s1", invoiceNo: "INV-1042",
    items: [
      { productId: "p1", productName: "Rice (Miniket)", quantity: 10, unitPrice: 68, total: 680 },
      { productId: "p3", productName: "Sugar", quantity: 18, unitPrice: 140, total: 2520 },
      { productId: "p4", productName: "Salt (Iodized)", quantity: 5, unitPrice: 48, total: 240 },
    ],
    subtotal: 3440, discount: 0, total: 3440, paidAmount: 0, dueAmount: 3440,
    paymentStatus: "full_due", customerId: "dc2", customerName: "Salma Khatun", customerPhone: "01822222222",
    soldBy: "Kamal (Seller)", createdAt: "2026-04-01T11:30:00Z",
  },
  {
    id: "inv4", shopId: "s1", invoiceNo: "INV-1041",
    items: [
      { productId: "p6", productName: "Potato", quantity: 8, unitPrice: 42, total: 336 },
      { productId: "p9", productName: "Lentil (Masoor)", quantity: 3, unitPrice: 115, total: 345 },
    ],
    subtotal: 681, discount: 0, total: 681, paidAmount: 681, dueAmount: 0,
    paymentStatus: "paid", customerId: null, customerName: null, customerPhone: null,
    soldBy: "Nila (Seller)", createdAt: "2026-04-01T09:20:00Z",
  },
  {
    id: "inv5", shopId: "s1", invoiceNo: "INV-1040",
    items: [
      { productId: "p1", productName: "Rice (Miniket)", quantity: 25, unitPrice: 68, total: 1700 },
      { productId: "p2", productName: "Soybean Oil", quantity: 5, unitPrice: 175, total: 875 },
      { productId: "p3", productName: "Sugar", quantity: 10, unitPrice: 140, total: 1400 },
    ],
    subtotal: 3975, discount: 100, total: 3875, paidAmount: 2000, dueAmount: 1875,
    paymentStatus: "partial_due", customerId: "dc3", customerName: "Rafiq Bepari", customerPhone: "01933333333",
    soldBy: "Kamal (Seller)", createdAt: "2026-03-31T16:40:00Z",
  },
  // Shop B (Fatema Grocery) invoices
  {
    id: "inv6", shopId: "s2", invoiceNo: "FG-2024",
    items: [
      { productId: "p13", productName: "Basmati Rice", quantity: 10, unitPrice: 145, total: 1450 },
      { productId: "p14", productName: "Mustard Oil", quantity: 2, unitPrice: 240, total: 480 },
    ],
    subtotal: 1930, discount: 0, total: 1930, paidAmount: 1930, dueAmount: 0,
    paymentStatus: "paid", customerId: null, customerName: null, customerPhone: null,
    soldBy: "Rahim Store Seller", createdAt: "2026-04-02T09:00:00Z",
  },
  {
    id: "inv7", shopId: "s2", invoiceNo: "FG-2023",
    items: [
      { productId: "p15", productName: "Turmeric Powder", quantity: 2, unitPrice: 220, total: 440 },
      { productId: "p16", productName: "Coriander Seeds", quantity: 1, unitPrice: 300, total: 300 },
      { productId: "p17", productName: "Garlic", quantity: 0.5, unitPrice: 180, total: 90 },
    ],
    subtotal: 830, discount: 30, total: 800, paidAmount: 0, dueAmount: 800,
    paymentStatus: "full_due", customerId: "dc5", customerName: "Habib Molla", customerPhone: "01798887777",
    soldBy: "Rahim Store Seller", createdAt: "2026-04-01T14:30:00Z",
  },
];

// ── Due Customers ──
export const DUE_CUSTOMERS: DueCustomer[] = [
  // Shop A customers
  { id: "dc1", shopId: "s1", name: "Abdul Mia", phone: "01711111111", address: "Kawran Bazar, Dhaka", totalDue: 5_815, isOverdue: false, lastTransactionAt: "2026-04-02T08:45:00Z", createdAt: "2025-08-15" },
  { id: "dc2", shopId: "s1", name: "Salma Khatun", phone: "01822222222", address: "Farmgate, Dhaka", totalDue: 12_340, isOverdue: true, lastTransactionAt: "2026-04-01T11:30:00Z", createdAt: "2025-09-20" },
  { id: "dc3", shopId: "s1", name: "Rafiq Bepari", phone: "01933333333", address: "Tejgaon, Dhaka", totalDue: 7_200, isOverdue: false, lastTransactionAt: "2026-03-31T16:40:00Z", createdAt: "2025-11-05" },
  { id: "dc4", shopId: "s1", name: "Hasina Begum", phone: "01544444444", address: "Mohammadpur, Dhaka", totalDue: 2_150, isOverdue: true, lastTransactionAt: "2026-03-15T10:00:00Z", createdAt: "2026-01-10" },
  // Shop B customers
  { id: "dc5", shopId: "s2", name: "Habib Molla", phone: "01798887777", address: "Green Road, Dhaka", totalDue: 800, isOverdue: false, lastTransactionAt: "2026-04-01T14:30:00Z", createdAt: "2026-02-01" },
];

// ── Due Transactions ──
export const DUE_TRANSACTIONS: DueTransaction[] = [
  { id: "dt1", customerId: "dc1", type: "sale", amount: 3315, invoiceId: "inv2", invoiceNo: "INV-1043", note: "Purchase on due", performedBy: "Kamal (Seller)", createdAt: "2026-04-02T08:45:00Z" },
  { id: "dt2", customerId: "dc1", type: "payment", amount: -2000, invoiceId: null, invoiceNo: null, note: "Partial cash payment", performedBy: "Rahim (Owner)", createdAt: "2026-03-28T14:00:00Z" },
  { id: "dt3", customerId: "dc1", type: "sale", amount: 4500, invoiceId: null, invoiceNo: "INV-1030", note: "Weekly groceries", performedBy: "Kamal (Seller)", createdAt: "2026-03-20T10:00:00Z" },
  { id: "dt4", customerId: "dc2", type: "sale", amount: 3440, invoiceId: "inv3", invoiceNo: "INV-1042", note: "Purchase on due", performedBy: "Kamal (Seller)", createdAt: "2026-04-01T11:30:00Z" },
  { id: "dt5", customerId: "dc2", type: "sale", amount: 8900, invoiceId: null, invoiceNo: "INV-1015", note: "Bulk order", performedBy: "Nila (Seller)", createdAt: "2026-02-15T09:00:00Z" },
  { id: "dt6", customerId: "dc3", type: "sale", amount: 1875, invoiceId: "inv5", invoiceNo: "INV-1040", note: "Purchase on due", performedBy: "Kamal (Seller)", createdAt: "2026-03-31T16:40:00Z" },
];

// ── Dashboard Stats ──
export const SHOP_STATS: ShopDashboardStats = {
  todaySales: 4629,
  totalSales: 2_450_000,
  totalDue: 27_505,
  lowStockCount: 4,
  totalProducts: PRODUCTS.length,
  todayInvoiceCount: 3,
  totalStaff: 4,
  recentInvoices: INVOICES.slice(0, 5),
  topProducts: [
    { name: "Rice (Miniket)", quantity: 145, revenue: 9860 },
    { name: "Soybean Oil", quantity: 62, revenue: 10850 },
    { name: "Sugar", quantity: 88, revenue: 12320 },
  ],
  lowStockProducts: PRODUCTS.filter((p) => p.stock <= p.lowStockThreshold),
};

export const ADMIN_STATS: AdminDashboardStats = {
  totalShops: 5,
  activeShops: 2,
  pendingApplications: 1,
  totalPlatformRevenue: 4_460_000,
  suspendedShops: 1,
};

export const PRODUCT_CATEGORIES = [
  "Rice & Grains", "Oil & Ghee", "Sugar & Sweet", "Salt & Spice",
  "Vegetables", "Dairy", "Lentils & Pulses", "Cleaning", "Personal Care",
  "Snacks & Beverages", "Frozen", "Others",
];
