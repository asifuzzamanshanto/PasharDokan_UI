const API_BASE = "/api";

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, credentials = "include" } = options;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new ApiError(response.status, error.message || "Request failed");
  }

  return response.json();
}

export const api = {
  auth: {
    register: (data: {
      fullName: string;
      dob: string;
      nid: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) => fetchApi<{ ok: boolean }>("/auth/register", { method: "POST", body: data }),

    login: (data: { email: string; password: string; rememberMe?: boolean }) =>
      fetchApi<{ ok: boolean }>("/auth/login", { method: "POST", body: data }),

    logout: () => fetchApi<{ ok: boolean }>("/auth/logout", { method: "POST" }),

    me: () =>
      fetchApi<{ userId: string; email: string; isAuthenticated: boolean }>("/me"),
  },

  shop: {
    apply: (data: {
      shopName: string;
      address: string;
      ownerName: string;
      ownerPhone: string;
      ownerEmail: string;
    }) => fetchApi<{ shopId: number; applicationId?: number }>("/shop/apply", { method: "POST", body: {
      ShopName: data.shopName,
      Address: data.address,
      OwnerName: data.ownerName,
      OwnerPhone: data.ownerPhone,
      OwnerEmail: data.ownerEmail,
    } }),

    context: () =>
      fetchApi<{
        hasShop: boolean;
        ctx: {
          shopId: number;
          role: string;
          shopStatus: string;
          shopName?: string;
          canCreateDue: boolean;
          canCollectDue: boolean;
        };
      }>("/shop/context"),

    getMembers: () =>
      fetchApi<
        {
          shopUserId: number;
          email: string;
          fullName: string;
          role: string;
          canCreateDue: boolean;
          canCollectDue: boolean;
          isActive: boolean;
          createdAt: string;
        }[]
      >("/shop/members"),

    addMember: (data: {
      email: string;
      role: "SELLER" | "MANAGER";
      canCreateDue: boolean;
      canCollectDue: boolean;
    }) => fetchApi<{ ok: boolean }>("/shop/members", { method: "POST", body: data }),

    removeMember: (id: number) =>
      fetchApi<{ ok: boolean }>(`/shop/members/${id}/remove`, { method: "POST" }),
  },

  products: {
    list: (q?: string) =>
      fetchApi<
        {
          productId: number;
          name: string;
          barcode: string;
          sellPricePaisa: number;
          isActive: boolean;
          currentQty: number;
        }[]
      >(`/products${q ? `?q=${encodeURIComponent(q)}` : ""}`),

    get: (id: number) =>
      fetchApi<{
        productId: number;
        name: string;
        barcode: string;
        sellPricePaisa: number;
        costPricePaisa: number;
        category: string;
        unit: string;
        lowStockThreshold: number;
        currentQty: number;
        isActive: boolean;
      }>(`/products/${id}`),

    create: (data: {
      name: string;
      barcode: string;
      sellPricePaisa: number;
    }) => fetchApi<{ productId: number }>("/products", { method: "POST", body: data }),

    update: (
      id: number,
      data: {
        name?: string;
        barcode?: string;
        sellPricePaisa?: number;
        costPricePaisa?: number;
        category?: string;
        unit?: string;
        lowStockThreshold?: number;
      }
    ) =>
      fetchApi<{ productId: number; ok: boolean }>(`/products/${id}`, {
        method: "PUT",
        body: data,
      }),

    toggleActive: (id: number, active: boolean) =>
      fetchApi<{ ok: boolean }>(`/products/${id}/active`, {
        method: "POST",
        body: { active },
      }),
  },

  inventory: {
    stockIn: (data: {
      productId: number;
      qty: number;
      unitCostPaisa: number;
      note?: string;
    }) => fetchApi<{ ok: boolean }>("/inventory/in", { method: "POST", body: data }),

    adjust: (data: {
      productId: number;
      qtyChange: number;
      note?: string;
    }) => fetchApi<{ ok: boolean }>("/inventory/adjust", { method: "POST", body: data }),

    ledger: (productId?: number, take = 50) =>
      fetchApi<
        {
          movementId: number;
          productId: number;
          productName: string;
          type: "IN" | "SALE" | "ADJUST";
          qtyChange: number;
          unitCostPaisa: number;
          note: string;
          createdAt: string;
        }[]
      >(`/inventory/ledger?productId=${productId}&take=${take}`),
  },

  sales: {
    create: (data: { items: { productId: number; qty: number }[] }) =>
      fetchApi<{
        saleId: number;
        totalPaisa: number;
        createdAt: string;
        items: {
          productId: number;
          qty: number;
          unitPricePaisa: number;
          totalPaisa: number;
        }[];
      }>("/sales", { method: "POST", body: { Items: data.items.map(i => ({ ProductId: i.productId, Qty: i.qty })) } }),

    list: () =>
      fetchApi<
        {
          saleId: number;
          totalPaisa: number;
          createdAt: string;
          items: {
            productId: number;
            qty: number;
            unitPricePaisa: number;
            totalPaisa: number;
          }[];
        }[]
      >("/sales"),

    get: (id: number) =>
      fetchApi<{
        saleId: number;
        invoiceNo: string;
        items: {
          productId: number;
          productName: string;
          qty: number;
          unitPricePaisa: number;
          totalPaisa: number;
        }[];
        subtotal: number;
        discount: number;
        total: number;
        paidAmount: number;
        dueAmount: number;
        paymentStatus: string;
        customerName: string | null;
        customerPhone: string | null;
        soldBy: number;
        createdAt: string;
      }>(`/sales/${id}`),
  },

  reports: {
    salesSummary: () =>
      fetchApi<{
        totalSales: number;
        paidSales: number;
        dueOutstanding: number;
        collectionRate: number;
        todaySales: number;
        invoiceCount: number;
      }>("/reports/sales-summary"),

    topProducts: (limit = 10) =>
      fetchApi<
        {
          productId: number;
          name: string;
          quantity: number;
          revenue: number;
        }[]
      >(`/reports/top-products?limit=${limit}`),

    categoryDistribution: () =>
      fetchApi<
        { category: string; count: number; percentage: number }[]
      >("/reports/category-distribution"),
  },

  due: {
    getCustomers: (shopId: number) =>
      fetchApi<
        {
          id: string;
          shopId: string;
          name: string;
          phoneNumber: string;
          totalDueRemaining: number;
          address: string;
          createdAt: string;
          updatedAt: string;
        }[]
      >(`/shops/${shopId}/dues/customers`),

    createCustomer: (
      shopId: number,
      data: { name: string; phoneNumber: string; address: string }
    ) =>
      fetchApi<{
        id: string;
        shopId: string;
        name: string;
        phoneNumber: string;
        address: string;
      }>(`/shops/${shopId}/dues/customers`, { method: "POST", body: data }),

    getEntries: (shopId: number, customerId: string) =>
      fetchApi<
        {
          id: string;
          dueCustomerId: string;
          shopId: string;
          amount: number;
          entryType: string;
          remarks: string;
          createdAt: string;
        }[]
      >(`/shops/${shopId}/dues/customers/${customerId}/entries`),

    createEntry: (
      shopId: number,
      customerId: string,
      data: {
        amount: number;
        entryType: 0 | 1;
        remarks?: string;
      }
    ) =>
      fetchApi<{
        id: string;
        dueCustomerId: string;
        shopId: string;
        amount: number;
        entryType: string;
        remarks: string;
        createdAt: string;
      }>(`/shops/${shopId}/dues/customers/${customerId}/entries`, {
        method: "POST",
        body: data,
      }),
  },

  admin: {
    getDashboard: () =>
      fetchApi<{
        totalShops: number;
        activeShops: number;
        pendingApplications: number;
        suspendedShops: number;
        totalPlatformRevenue: number;
      }>("/admin/dashboard"),

    getShopApplications: () =>
      fetchApi<
        {
          applicationId: number;
          shopName: string;
          ownerName: string;
          ownerPhone: string;
          ownerEmail: string;
          address: string;
          createdAt: string;
        }[]
      >("/admin/shop-applications/pending"),

    getShops: () =>
      fetchApi<
        {
          shopId: number;
          shopName: string;
          ownerName: string;
          ownerPhone: string;
          address: string;
          verifiedAt: string;
        }[]
      >("/admin/shops"),

    approveShop: (id: number) =>
      fetchApi<{ ok: boolean }>(`/admin/shop-applications/${id}/approve`, {
        method: "POST",
      }),

    rejectShop: (id: number) =>
      fetchApi<{ ok: boolean }>(`/admin/shop-applications/${id}/reject`, {
        method: "POST",
      }),
  },
};

export { fetchApi, ApiError };
export default api;