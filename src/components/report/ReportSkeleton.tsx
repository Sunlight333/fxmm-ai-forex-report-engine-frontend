"use client";

import { Skeleton, SkeletonText, SkeletonChart, SkeletonCard } from "@/components/ui/Skeleton";

export function ReportSkeleton() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-40" />
        <div className="mt-2 flex gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <SkeletonChart />
        <SkeletonChart />
        <SkeletonChart />
        <SkeletonChart />
      </div>

      {/* Sections */}
      {[1, 2, 3, 4].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
