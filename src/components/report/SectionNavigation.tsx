"use client";

import { useState, useEffect } from "react";
import { useT } from "@/i18n/provider";
import { cn } from "@/lib/utils";

const SECTION_KEYS = [
  "market_state",
  "executive_summary",
  "continuity_update",
  "upcoming_events",
  "current_session",
  "multi_timeframe_structure",
  "key_zones_demand",
  "key_zones_supply",
  "annotated_chart",
  "market_positioning",
  "risk_context",
  "structural_invalidation",
  "contextual_recommendation",
] as const;

interface SectionNavigationProps {
  availableSections: string[];
}

export function SectionNavigation({ availableSections }: SectionNavigationProps) {
  const { t } = useT();
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id.replace("section-", ""));
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    for (const key of availableSections) {
      const el = document.getElementById(`section-${key}`);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [availableSections]);

  const scrollTo = (key: string) => {
    const el = document.getElementById(`section-${key}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredKeys = SECTION_KEYS.filter((k) => availableSections.includes(k));

  return (
    <nav className="space-y-0.5" aria-label="Report sections">
      {filteredKeys.map((key) => (
        <button
          key={key}
          onClick={() => scrollTo(key)}
          className={cn(
            "block w-full rounded-md px-3 py-1.5 text-left text-xs transition-colors",
            activeSection === key
              ? "bg-primary-light text-primary font-medium"
              : "text-gray-500 hover:text-gray-300 hover:bg-dark-hover"
          )}
        >
          {t(`report.sections.${key}`)}
        </button>
      ))}
    </nav>
  );
}
