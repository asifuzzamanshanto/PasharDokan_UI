import api from "./api";

const USE_REAL_API = true;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockApi = {
  auth: {
    login: async (data: { email: string; password: string; rememberMe?: boolean }) => {
      await delay(300);
      return { ok: true };
    },
    register: async (_data: { fullName: string; dob: string; nid: string; email: string; password: string; confirmPassword: string }) => { await delay(300); return { message: "Registration successful" }; },
    logout: async () => { await delay(100); return { message: "Logged out" }; },
    me: async () => { await delay(100); return { userId: "u1", email: "demo@example.com", isAuthenticated: true }; },
  },
  shop: {
    apply: async (data: { shopName: string; address: string; ownerName: string; ownerPhone: string; ownerEmail: string }) => {
      await delay(500);
      return { message: "Application submitted", applicationId: Math.floor(Math.random() * 1000), shopId: 123 };
    },
    context: async () => {
      await delay(200);
      return { 
        hasShop: true, 
        ctx: { shopId: 1, role: "OWNER", shopStatus: "ACTIVE", shopName: "Rahim Store", canCreateDue: true, canCollectDue: true } 
      };
    },
    getMembers: async () => {
      await delay(200);
      return { members: [
        { shopUserId: 1, email: "rahim@example.com", fullName: "Rahim Ahmed", role: "OWNER", canCreateDue: true, canCollectDue: true, isActive: true, createdAt: "2025-06-01" },
        { shopUserId: 2, email: "kamal@example.com", fullName: "Kamal Hossain", role: "SELLER", canCreateDue: true, canCollectDue: false, isActive: true, createdAt: "2025-06-15" },
      ]};
    },
    addMember: async () => { await delay(300); return { ok: true }; },
    removeMember: async () => { await delay(300); return { ok: true }; },
  },
  products: {
    list: async () => {
      await delay(200);
      return { 
        products: [
          { productId: 1, name: "Rice (Miniket)", barcode: "RC-MNK-001", sellPricePaisa: 6800, isActive: true, currentQty: 450 },
          { productId: 2, name: "Soybean Oil", barcode: "OIL-SYB-001", sellPricePaisa: 17500, isActive: true, currentQty: 80 },
          { productId: 3, name: "Sugar", barcode: "SGR-WHT-001", sellPricePaisa: 14000, isActive: true, currentQty: 12 },
          { productId: 4, name: "Salt (Iodized)", barcode: "SLT-IDD-001", sellPricePaisa: 4800, isActive: true, currentQty: 200 },
          { productId: 5, name: "Onion", barcode: "VEG-ONN-001", sellPricePaisa: 7000, isActive: true, currentQty: 8 },
          { productId: 6, name: "Potato", barcode: "VEG-PTO-001", sellPricePaisa: 4200, isActive: true, currentQty: 150 },
          { productId: 7, name: "Milk Powder (Dano)", barcode: "DRY-MLK-001", sellPricePaisa: 58000, isActive: true, currentQty: 5 },
          { productId: 8, name: "Egg (Dozen)", barcode: "DRY-EGG-001", sellPricePaisa: 15500, isActive: true, currentQty: 35 },
        ]
      };
    },
    get: async (id: number) => {
      await delay(200);
      return { 
        product: { productId: id, name: "Rice (Miniket)", barcode: "RC-MNK-001", sellPricePaisa: 6800, costPricePaisa: 5800, category: "Rice & Grains", unit: "kg", lowStockThreshold: 100, currentQty: 450, isActive: true }
      };
    },
    create: async (data: { Name: string; Barcode: string; SellPricePaisa: number }) => {
      await delay(300);
      return { productId: Math.floor(Math.random() * 1000), message: "Product created" };
    },
    update: async (id: number, _data: unknown) => {
      await delay(300);
      return { productId: id, ok: true, message: "Product updated" };
    },
    toggleActive: async (_id: number, active: boolean) => {
      await delay(200);
      return { ok: true, message: `Product ${active ? "activated" : "deactivated"}` };
    },
  },
  sales: {
    list: async () => {
      await delay(200);
      return { 
        sales: [
          { saleId: 1, totalPaisa: 131400, createdAt: "2026-04-02T10:15:00Z", items: [
            { productId: 1, productName: "Rice (Miniket)", qty: 5, unitPricePaisa: 6800, totalPaisa: 34000 },
            { productId: 2, productName: "Soybean Oil", qty: 2, unitPricePaisa: 17500, totalPaisa: 35000 },
          ]},
          { saleId: 2, totalPaisa: 331500, createdAt: "2026-04-02T08:45:00Z", items: [
            { productId: 7, productName: "Milk Powder (Dano)", qty: 5, unitPricePaisa: 58000, totalPaisa: 290000 },
          ]},
        ]
      };
    },
    get: async (id: number) => {
      await delay(200);
      return { 
        sale: { 
          saleId: id, invoiceNo: `INV-${1000 + id}`, 
          items: [{ productId: 1, productName: "Rice", qty: 5, unitPricePaisa: 6800, totalPaisa: 34000 }],
          subtotal: 34000, discount: 0, total: 34000, paidAmount: 34000, dueAmount: 0, 
          paymentStatus: "PAID", customerName: null, customerPhone: null, soldBy: 1, createdAt: "2026-04-02T10:15:00Z"
        }
      };
    },
    create: async (data: { items: { productId: number; qty: number }[] }) => {
      await delay(300);
      return { 
        saleId: Math.floor(Math.random() * 10000), 
        totalPaisa: data.items.reduce((sum, item) => sum + (item.qty * 6800), 0), 
        createdAt: new Date().toISOString(),
        items: data.items.map(item => ({ productId: item.productId, qty: item.qty, unitPricePaisa: 6800, totalPaisa: item.qty * 6800 }))
      };
    },
  },
  inventory: {
    stockIn: async (_data: unknown) => { await delay(300); return { ok: true }; },
    adjust: async (_data: unknown) => { await delay(300); return { ok: true }; },
    ledger: async () => {
      await delay(200);
      return { 
        ledger: [
          { movementId: 1, productId: 1, productName: "Rice (Miniket)", type: "IN", qtyChange: 200, unitCostPaisa: 5800, note: "Supplier delivery", createdAt: "2026-04-01T09:00:00Z" },
        ]
      };
    },
  },
  reports: {
    salesSummary: async () => {
      await delay(200);
      return { totalSales: 882300, paidSales: 846800, dueOutstanding: 35500, collectionRate: 96, todaySales: 131400, invoiceCount: 12 };
    },
    topProducts: async () => {
      await delay(200);
      return { 
        products: [
          { productId: 1, name: "Rice (Miniket)", quantity: 145, revenue: 986000 },
          { productId: 2, name: "Soybean Oil", quantity: 62, revenue: 1085000 },
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
        ]
      };
    },
  },
  due: {
    getCustomers: async (_shopId?: number) => {
      await delay(200);
      return { 
        customers: [
          { id: "dc1", shopId: "s1", name: "Abdul Mia", phoneNumber: "01711111111", totalDueRemaining: 5815, address: "Kawran Bazar, Dhaka", createdAt: "2025-08-15", updatedAt: "2026-04-02" },
          { id: "dc2", shopId: "s1", name: "Salma Khatun", phoneNumber: "01822222222", totalDueRemaining: 12340, address: "Farmgate, Dhaka", createdAt: "2025-09-20", updatedAt: "2026-04-01" },
        ]
      };
    },
    createCustomer: async (data: { Name: string; PhoneNumber: string; Address: string }) => {
      await delay(300);
      return { customer: { id: `dc${Date.now()}`, shopId: "s1", name: data.Name, phoneNumber: data.PhoneNumber, address: data.Address }, message: "Customer created" };
    },
    getEntries: async (_customerId: string) => {
      await delay(200);
      return { 
        entries: [
          { id: "dt1", dueCustomerId: "dc1", shopId: "s1", amount: 3315, entryType: "PurchaseAdded", remarks: "Purchase on due", createdAt: "2026-04-02T08:45:00Z" },
        ]
      };
    },
    createEntry: async (_customerId: string, data: { Amount: number; EntryType: number; Remarks?: string }) => {
      await delay(300);
      return { entry: { id: `dt${Date.now()}`, dueCustomerId: _customerId, shopId: "s1", amount: data.Amount, entryType: data.EntryType === 1 ? "PaymentReceived" : "PurchaseAdded", remarks: data.Remarks || "" }, message: "Entry added" };
    },
  },
  admin: {
    getDashboard: async () => {
      await delay(200);
      return { totalShops: 5, activeShops: 2, pendingApplications: 1, suspendedShops: 1, totalPlatformRevenue: 4460000 };
    },
    getShopApplications: async () => {
      await delay(200);
      return { 
        applications: [
          { applicationId: 1, shopName: "Karim Bhai Shop", ownerName: "Karim Hossain", ownerPhone: "01556789012", ownerEmail: "karim@example.com", address: "78 Uttara", createdAt: "2026-03-28" },
        ]
      };
    },
    getShops: async () => {
      await delay(200);
      return { 
        shops: [
          { shopId: 1, shopName: "Rahim Store", ownerName: "Rahim Ahmed", ownerPhone: "01712345678", address: "12 Kawran Bazar", verifiedAt: "2025-06-03" },
          { shopId: 2, shopName: "Fatema Grocery", ownerName: "Fatema Begum", ownerPhone: "01898765432", address: "45 Green Road", verifiedAt: "2025-07-12" },
        ]
      };
    },
    approveShop: async (id: number) => { await delay(300); return { ok: true, message: `Shop ${id} approved` }; },
    rejectShop: async (id: number) => { await delay(300); return { ok: true, message: `Shop ${id} rejected` }; },
  },
};

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function convertKeysToCamel(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamel);
  }
  if (obj !== null && typeof obj === "object") {
    const newObj: Record<string, unknown> = {};
    for (const key in obj) {
      const camelKey = toCamelCase(key);
      newObj[camelKey] = convertKeysToCamel((obj as Record<string, unknown>)[key]);
    }
    return newObj;
  }
  return obj;
}

function convertKeysToSnake(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToSnake);
  }
  if (obj !== null && typeof obj === "object") {
    const newObj: Record<string, unknown> = {};
    for (const key in obj) {
      const snakeKey = toSnakeCase(key);
      newObj[snakeKey] = convertKeysToSnake((obj as Record<string, unknown>)[key]);
    }
    return newObj;
  }
  return obj;
}

async function handleApiCall<T>(fn: () => Promise<T>): Promise<T> {
  try {
    if (USE_REAL_API) {
      const result = await fn();
      return convertKeysToCamel(result) as T;
    }
    const mockResult = await fn();
    return convertKeysToCamel(mockResult) as T;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

const realApiWrapper = {
  auth: {
    register: (data: { fullName: string; dob: string; nid: string; email: string; password: string; confirmPassword: string }) =>
      handleApiCall(() => api.auth.register(data)),
    login: (data: { email: string; password: string; rememberMe?: boolean }) =>
      handleApiCall(() => api.auth.login(data)),
    logout: () => handleApiCall(() => api.auth.logout()),
    me: () => handleApiCall(() => api.auth.me()),
  },
  shop: {
    apply: (data: { shopName: string; address: string; ownerName: string; ownerPhone: string; ownerEmail: string }) =>
      handleApiCall(() => api.shop.apply({
        ShopName: data.shopName,
        Address: data.address,
        OwnerName: data.ownerName,
        OwnerPhone: data.ownerPhone,
        OwnerEmail: data.ownerEmail,
      } as any)),
    context: () => handleApiCall(() => api.shop.context()),
    getMembers: () => handleApiCall(() => api.shop.getMembers()),
    addMember: (data: { email: string; role: "SELLER" | "MANAGER"; canCreateDue: boolean; canCollectDue: boolean }) =>
      handleApiCall(() => api.shop.addMember(data)),
    removeMember: (id: number) => handleApiCall(() => api.shop.removeMember(id)),
  },
  products: {
    list: (q?: string) => handleApiCall(() => api.products.list(q)),
    get: (id: number) => handleApiCall(() => api.products.get(id)),
    create: (data: { name: string; barcode: string; sellPricePaisa: number }) =>
      handleApiCall(() => api.products.create(data)),
    update: (id: number, data: { name?: string; barcode?: string; sellPricePaisa?: number; costPricePaisa?: number; category?: string; unit?: string; lowStockThreshold?: number }) =>
      handleApiCall(() => api.products.update(id, convertKeysToSnake(data) as Parameters<typeof api.products.update>[1])),
    toggleActive: (id: number, active: boolean) => handleApiCall(() => api.products.toggleActive(id, active)),
  },
  inventory: {
    stockIn: (data: { productId: number; qty: number; unitCostPaisa: number; note?: string }) =>
      handleApiCall(() => api.inventory.stockIn(convertKeysToSnake(data) as Parameters<typeof api.inventory.stockIn>[0])),
    adjust: (data: { productId: number; qtyChange: number; note?: string }) =>
      handleApiCall(() => api.inventory.adjust(convertKeysToSnake(data) as Parameters<typeof api.inventory.adjust>[0])),
    ledger: (productId?: number, take?: number) => handleApiCall(() => api.inventory.ledger(productId, take)),
  },
  sales: {
    create: (data: { items: { productId: number; qty: number }[] }) =>
      handleApiCall(() => api.sales.create({
        items: data.items.map(item => ({ ProductId: item.productId, Qty: item.qty })),
      } as any)),
    list: () => handleApiCall(() => api.sales.list()),
    get: (id: number) => handleApiCall(() => api.sales.get(id)),
  },
  reports: {
    salesSummary: () => handleApiCall(() => api.reports.salesSummary()),
    topProducts: (limit?: number) => handleApiCall(() => api.reports.topProducts(limit)),
    categoryDistribution: () => handleApiCall(() => api.reports.categoryDistribution()),
  },
  due: {
    getCustomers: (shopId: number) => handleApiCall(() => api.due.getCustomers(shopId)),
    createCustomer: (shopId: number, data: { name: string; phoneNumber: string; address: string }) =>
      handleApiCall(() => api.due.createCustomer(shopId, convertKeysToSnake(data) as Parameters<typeof api.due.createCustomer>[1])),
    getEntries: (shopId: number, customerId: string) => handleApiCall(() => api.due.getEntries(shopId, customerId)),
    createEntry: (shopId: number, customerId: string, data: { amount: number; entryType: 0 | 1; remarks?: string }) =>
      handleApiCall(() => api.due.createEntry(shopId, customerId, convertKeysToSnake(data) as Parameters<typeof api.due.createEntry>[2])),
  },
  admin: {
    getDashboard: () => handleApiCall(() => api.admin.getDashboard()),
    getShopApplications: () => handleApiCall(() => api.admin.getShopApplications()),
    getShops: () => handleApiCall(() => api.admin.getShops()),
    approveShop: (id: number) => handleApiCall(() => api.admin.approveShop(id)),
    rejectShop: (id: number) => handleApiCall(() => api.admin.rejectShop(id)),
  },
};

const currentApi = USE_REAL_API ? realApiWrapper : mockApi;

export const clientApi = currentApi;
export default clientApi;