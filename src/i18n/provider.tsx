"use client";

import { createContext, useContext, useCallback, ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { en, type TranslationKeys } from "./en";
import { es } from "./es";

type Language = "en" | "es";

const translations: Record<Language, TranslationKeys> = { en, es };

interface I18nContextType {
  lang: Language;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  t: (key: string) => key,
});

function getNestedValue(obj: unknown, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== "object") {
      return path;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const lang = ((user?.language || "en") as Language);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let value = getNestedValue(translations[lang], key);
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          value = value.replace(`{${k}}`, String(v));
        }
      }
      return value;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  return useContext(I18nContext);
}
