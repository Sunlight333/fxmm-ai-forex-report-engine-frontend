import { clsx, type ClassValue } from "clsx";

/** Tailwind class merger */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Resolve chart image URL from backend path */
export function resolveChartUrl(path: string | null): string | null {
  if (!path) return null;
  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/v1").replace(/\/+$/, "");
  return `${base}${path}`;
}

/** Format FX pair for display: "EURUSD" -> "EUR/USD" */
export function formatPair(pair: string): string {
  return `${pair.slice(0, 3)}/${pair.slice(3)}`;
}

/** Format price with appropriate decimal places (5 for most, 3 for JPY pairs) */
export function formatPrice(price: number, pair: string): string {
  const decimals = pair.includes("JPY") ? 3 : 5;
  return price.toFixed(decimals);
}

/** Format section key to title: "market_state" -> "Market State" */
export function sectionTitle(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Format number with comma separators */
export function formatNumber(n: number): string {
  return n.toLocaleString();
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}
