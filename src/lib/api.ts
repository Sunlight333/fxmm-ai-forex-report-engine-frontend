/** API client for the FXMM backend. */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/v1";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("access_token")
    : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiError(res.status, body.detail || res.statusText);
  }

  return res.json();
}

// Auth
export const auth = {
  register: (email: string, password: string, language = "en") =>
    request<{ access_token: string; refresh_token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, language }),
    }),

  login: (email: string, password: string) =>
    request<{ access_token: string; refresh_token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  refresh: (refreshToken: string) =>
    request<{ access_token: string; refresh_token: string }>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),
};

// User
export const user = {
  me: () => request<import("@/types/api").User>("/user/me"),

  update: (data: { language?: string; selected_pairs?: string[] }) =>
    request<import("@/types/api").User>("/user/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// Reports
export const reports = {
  latest: (pair: string) =>
    request<import("@/types/api").ReportDetail>(`/reports/latest/${pair}`),

  byId: (id: string) =>
    request<import("@/types/api").ReportDetail>(`/reports/${id}`),

  history: (pair: string, limit = 30) =>
    request<import("@/types/api").ReportSummary[]>(
      `/reports/history/${pair}?limit=${limit}`
    ),

  byDate: (date: string) =>
    request<import("@/types/api").ReportSummary[]>(`/reports/by-date/${date}`),
};

// Zones
export const zones = {
  active: (pair: string) =>
    request<import("@/types/api").Zone[]>(`/zones/active/${pair}`),

  byReport: (reportId: string) =>
    request<import("@/types/api").Zone[]>(`/zones/by-report/${reportId}`),
};

// Credits
export const credits = {
  balance: () =>
    request<import("@/types/api").CreditBalance>("/credits/balance"),

  purchase: (amount: number, paymentRef?: string) =>
    request<import("@/types/api").CreditTransaction>("/credits/purchase", {
      method: "POST",
      body: JSON.stringify({ amount, payment_reference: paymentRef }),
    }),

  consume: (pair: string) =>
    request<import("@/types/api").CreditTransaction>("/credits/consume", {
      method: "POST",
      body: JSON.stringify({ pair }),
    }),
};

// Subscriptions
export const subscriptions = {
  list: () =>
    request<import("@/types/api").Subscription[]>("/subscriptions/"),

  check: (pair: string) =>
    request<{ pair: string; has_access: boolean; end_date: string | null }>(
      `/subscriptions/check/${pair}`
    ),
};

// Admin
export const admin = {
  users: () =>
    request<import("@/types/api").User[]>("/admin/users"),

  adjustCredits: (userId: string, amount: number, reason: string) =>
    request("/admin/credits/adjust", {
      method: "POST",
      body: JSON.stringify({ user_id: userId, amount, reason }),
    }),

  triggerGeneration: (pairs?: string[], language = "en") =>
    request("/admin/trigger-generation", {
      method: "POST",
      body: JSON.stringify({ pairs, language }),
    }),

  generationLogs: (runDate?: string) =>
    request("/admin/generation-logs" + (runDate ? `?run_date=${runDate}` : "")),
};
