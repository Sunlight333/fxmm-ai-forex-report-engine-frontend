/** API client for the FXMM backend. */

import type {
  User,
  ReportDetail,
  ReportSummary,
  Zone,
  CreditBalance,
  CreditTransaction,
  Subscription,
  CalendarEvent,
  GenerationLog,
  HealthResponse,
  ApiStatusInfo,
  ApiTestResult,
} from "@/types/api";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/v1").replace(/\/+$/, "");

export class ApiError extends Error {
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

// Health
export const health = {
  check: () => request<HealthResponse>("/health"),
};

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
  me: () => request<User>("/user/me"),

  update: (data: { language?: string; selected_pairs?: string[] }) =>
    request<User>("/user/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// Reports
export const reports = {
  latest: (pair: string) =>
    request<ReportDetail>(`/reports/latest/${pair}`),

  generate: (pair: string) =>
    request<ReportDetail>(`/reports/generate/${pair}`, { method: "POST" }),

  byId: (id: string) =>
    request<ReportDetail>(`/reports/${id}`),

  history: (pair: string, limit = 30, offset = 0) =>
    request<ReportSummary[]>(
      `/reports/history/${pair}?limit=${limit}&offset=${offset}`
    ),

  byDate: (date: string) =>
    request<ReportSummary[]>(`/reports/by-date/${date}`),
};

// Zones
export const zones = {
  active: (pair: string) =>
    request<Zone[]>(`/zones/active/${pair}`),

  byReport: (reportId: string) =>
    request<Zone[]>(`/zones/by-report/${reportId}`),
};

// Credits
export const credits = {
  balance: () =>
    request<CreditBalance>("/credits/balance"),

  purchase: (amount: number, paymentRef?: string) =>
    request<CreditTransaction>("/credits/purchase", {
      method: "POST",
      body: JSON.stringify({ amount, payment_reference: paymentRef }),
    }),

  consume: (pair: string) =>
    request<CreditTransaction>("/credits/consume", {
      method: "POST",
      body: JSON.stringify({ pair }),
    }),
};

// Subscriptions
export const subscriptions = {
  list: () =>
    request<Subscription[]>("/subscriptions/"),

  checkAll: () =>
    request<{
      pairs: Record<string, { has_access: boolean; end_date: string | null }>;
    }>("/subscriptions/check-all"),

  check: (pair: string) =>
    request<{ pair: string; has_access: boolean; end_date: string | null }>(
      `/subscriptions/check/${pair}`
    ),
};

// Calendar
export const calendar = {
  today: () => request<CalendarEvent[]>("/calendar/today"),

  week: () => request<CalendarEvent[]>("/calendar/week"),

  byPair: (pair: string) =>
    request<CalendarEvent[]>(`/calendar/pair/${pair}`),
};

// Live quotes
export const quotes = {
  snapshot: () =>
    request<{
      quotes: Record<string, {
        pair: string;
        price: number;
        open: number;
        high: number;
        low: number;
        previous_close: number;
        change: number;
        percent_change: number;
        timestamp: string;
      }>;
      updated_at: number;
      pair_count: number;
    }>("/quotes/snapshot"),
};

// Admin
export const admin = {
  users: () =>
    request<User[]>("/admin/users"),

  adjustCredits: (userId: string, amount: number, reason: string) =>
    request<CreditTransaction>("/admin/credits/adjust", {
      method: "POST",
      body: JSON.stringify({ user_id: userId, amount, reason }),
    }),

  triggerGeneration: (pairs?: string[], language = "en") =>
    request<Record<string, unknown>>("/admin/trigger-generation", {
      method: "POST",
      body: JSON.stringify({ pairs, language }),
    }),

  generationLogs: (runDate?: string) =>
    request<GenerationLog[]>(
      "/admin/generation-logs" + (runDate ? `?run_date=${runDate}` : "")
    ),

  apiStatus: () =>
    request<ApiStatusInfo[]>("/admin/api-status"),

  testApi: (apiName: string) =>
    request<ApiTestResult>(`/admin/api-status/test?api_name=${encodeURIComponent(apiName)}`, {
      method: "POST",
    }),

  updateApiKey: (apiName: string, keyValue: string, password: string, secondaryValue?: string) =>
    request<{ status: string; api_name: string }>("/admin/api-status", {
      method: "PUT",
      body: JSON.stringify({
        api_name: apiName,
        key_value: keyValue,
        secondary_value: secondaryValue || null,
        password,
      }),
    }),
};
