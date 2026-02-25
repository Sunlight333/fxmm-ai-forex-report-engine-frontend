"use client";

import { useEffect, useState } from "react";
import { resolveChartUrl, cn } from "@/lib/utils";
import { useT } from "@/i18n/provider";
import { Modal } from "@/components/ui/Modal";
import { SkeletonChart } from "@/components/ui/Skeleton";

interface ChartImageProps {
  path: string | null;
  title: string;
  alt: string;
  className?: string;
}

export function ChartImage({ path, title, alt, className }: ChartImageProps) {
  const { t } = useT();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const url = resolveChartUrl(path);

  // Reset loading/error state when the chart URL changes (e.g. after regeneration)
  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [url]);

  if (!url) {
    return (
      <div
        className={cn(
          "flex aspect-video items-center justify-center rounded-lg border border-dark-border bg-dark-surface",
          className
        )}
      >
        <p className="text-sm text-gray-500">{t("report.charts.unavailable")}</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn("group relative", className)}>
        <p className="mb-2 text-sm font-medium text-gray-400">{title}</p>
        <div className="relative overflow-hidden rounded-lg border border-dark-border bg-dark-surface">
          {loading && <SkeletonChart className="absolute inset-0" />}
          {error ? (
            <div className="flex aspect-video items-center justify-center">
              <p className="text-sm text-gray-500">{t("report.charts.unavailable")}</p>
            </div>
          ) : (
            <img
              src={url}
              alt={alt}
              className={cn(
                "w-full cursor-pointer transition-opacity",
                loading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError(true);
              }}
              onClick={() => setZoomed(true)}
            />
          )}
          {!loading && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
              <span className="rounded-full bg-dark-card/80 px-3 py-1 text-xs text-gray-300">
                {t("report.charts.clickToZoom")}
              </span>
            </div>
          )}
        </div>
      </div>

      <Modal open={zoomed} onClose={() => setZoomed(false)} size="full">
        <img src={url} alt={alt} className="w-full rounded-lg" />
      </Modal>
    </>
  );
}
