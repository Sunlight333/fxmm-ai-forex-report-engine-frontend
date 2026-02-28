"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-bg p-4">
      <Card className="max-w-md text-center">
        <div className="mb-4 text-5xl text-supply">!</div>
        <h2 className="mb-2 text-xl font-bold text-foreground">
          Something Went Wrong
        </h2>
        <p className="mb-6 text-sm text-muted-fg">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <Button onClick={reset}>Try Again</Button>
      </Card>
    </div>
  );
}
