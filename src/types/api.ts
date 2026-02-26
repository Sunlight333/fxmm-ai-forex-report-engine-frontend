/** API response types matching the Python Pydantic schemas. */

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  tier: "retail" | "professional";
  language: string;
  selected_pairs: string[];
  credit_balance: number;
  is_admin: boolean;
  created_at: string;
}

export interface ReportSummary {
  id: string;
  pair: string;
  date: string;
  language: string;
  market_state: string | null;
  executive_summary: string | null;
  created_at: string;
}

export interface ReportDetail extends ReportSummary {
  full_narrative: {
    raw: string;
    sections: Record<string, string>;
  } | null;
  chart_file_url: string | null;
  radar_file_url: string | null;
  sentiment_file_url: string | null;
  risk_overlay_file_url: string | null;
  pdf_file_url: string | null;
  llm_model: string | null;
  llm_tokens_used: number | null;
  generation_time_ms: number | null;
}

export interface Zone {
  id: string;
  pair: string;
  date: string;
  zone_type: "supply" | "demand";
  price_upper: number;
  price_lower: number;
  confluence_score: number;
  detection_factors: Record<string, boolean>;
  status: string;
  test_count: number;
  created_at: string;
}

export interface CreditTransaction {
  id: string;
  type: "purchase" | "consume" | "admin_add";
  amount: number;
  pair: string | null;
  payment_reference: string | null;
  balance_after: number;
  created_at: string;
}

export interface CreditBalance {
  balance: number;
  transactions: CreditTransaction[];
}

export interface Subscription {
  id: string;
  pair: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  date: string;
  time: string | null;
  currency: string;
  event_name: string;
  impact_level: "low" | "medium" | "high";
  forecast: string | null;
  actual: string | null;
  previous: string | null;
}

export interface GenerationLog {
  id: string;
  pair: string;
  run_date: string;
  status: "success" | "failure" | "partial";
  error_details: string | null;
  duration_ms: number | null;
  created_at: string;
}

export interface HealthResponse {
  status: string;
  database: string;
}

export interface ApiStatusInfo {
  name: string;
  display_name: string;
  description: string;
  masked_key: string;
  masked_secondary: string | null;
  has_key: boolean;
  requires_key: boolean;
  has_secondary: boolean;
}

export interface ApiTestResult {
  name: string;
  status: "online" | "offline" | "no_key";
  response_time_ms: number | null;
  error: string | null;
  checked_at: string;
}

export const FX_PAIRS = [
  "EURUSD", "USDJPY", "GBPUSD", "AUDUSD", "USDCAD",
  "USDCHF", "NZDUSD", "EURJPY", "GBPJPY", "EURGBP", "AUDJPY",
] as const;

export const MAJOR_PAIRS = ["EURUSD", "USDJPY", "GBPUSD", "AUDUSD", "USDCAD", "USDCHF", "NZDUSD"] as const;
export const CROSS_PAIRS = ["EURJPY", "GBPJPY", "EURGBP", "AUDJPY"] as const;

export type FXPair = (typeof FX_PAIRS)[number];
