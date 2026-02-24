"use client";

import { SkeletonCard, Skeleton } from "@/components/ui/Skeleton";

export function DashboardSkeleton() {
  return (
    <div className="animate-fade-in">
      {/* Stats row */}
      <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Pair grid */}
      <Skeleton className="mb-4 h-6 w-32" />
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 11 }).map((_, i) => (
          <SkeletonCard key={i} className="h-[140px]" />
        ))}
      </div>
    </div>
  );
}
