"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { resolveChartUrl, cn } from "@/lib/utils";
import { useT } from "@/i18n/provider";
import { SkeletonChart } from "@/components/ui/Skeleton";

interface ChartImageProps {
  path: string | null;
  title: string;
  alt: string;
  className?: string;
}

/** Clamp a value between min and max */
function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function ChartImage({ path, title, alt, className }: ChartImageProps) {
  const { t } = useT();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  // Zoom/pan state for lightbox
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const translateStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const url = resolveChartUrl(path);

  // Reset loading/error state when the chart URL changes (e.g. after regeneration)
  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [url]);

  // Reset zoom when lightbox opens/closes
  useEffect(() => {
    if (!zoomed) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  }, [zoomed]);

  // Scroll-to-zoom in lightbox
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setScale((prev) => clamp(prev + (e.deltaY < 0 ? 0.2 : -0.2), 0.5, 5));
  }, []);

  // Pan handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (scale <= 1) return;
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY };
    translateStart.current = { ...translate };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [scale, translate]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setTranslate({
      x: translateStart.current.x + dx,
      y: translateStart.current.y + dy,
    });
  }, []);

  const handlePointerUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  // Double-click to toggle fit/zoom
  const handleDoubleClick = useCallback(() => {
    if (scale > 1) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
  }, [scale]);

  // Close on Escape
  useEffect(() => {
    if (!zoomed) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [zoomed]);

  if (!url) {
    return (
      <div
        className={cn(
          "flex aspect-video items-center justify-center rounded-xl border border-dark-border bg-dark-surface",
          className
        )}
      >
        <p className="text-sm text-muted-fg">{t("report.charts.unavailable")}</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn("group relative", className)}>
        <p className="mb-2 text-sm font-medium text-muted-fg">{title}</p>
        <div className="relative overflow-hidden rounded-xl border border-dark-border bg-dark-surface">
          {loading && <SkeletonChart className="absolute inset-0" />}
          {error ? (
            <div className="flex aspect-video items-center justify-center">
              <p className="text-sm text-muted-fg">{t("report.charts.unavailable")}</p>
            </div>
          ) : (
            <img
              src={url}
              alt={alt}
              className={cn(
                "mx-auto max-h-[520px] w-auto cursor-pointer object-contain transition-opacity",
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
              <span className="rounded-full bg-dark-card/80 px-3 py-1 text-xs text-muted-fg">
                {t("report.charts.clickToZoom")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Full-screen lightbox with scroll-to-zoom and pan */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={(e) => {
            // Close when clicking the backdrop (not the image)
            if (e.target === e.currentTarget) setZoomed(false);
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setZoomed(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-dark-card/80 p-2 text-muted-fg transition-colors hover:bg-dark-card hover:text-foreground"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Zoom hint */}
          <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-dark-card/80 px-3 py-1 text-xs text-muted-fg">
            Scroll to zoom · Double-click to fit · Click outside to close
          </div>

          {/* Zoomable image container */}
          <div
            ref={containerRef}
            className="h-full w-full overflow-hidden"
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onDoubleClick={handleDoubleClick}
            style={{ cursor: scale > 1 ? "grab" : "zoom-in", touchAction: "none" }}
          >
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                transition: isPanning.current ? "none" : "transform 0.2s ease-out",
              }}
            >
              <img
                src={url}
                alt={alt}
                className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
