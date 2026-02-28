"use client";

import { GenerationTrigger } from "@/components/admin/GenerationTrigger";
import { GenerationLogs } from "@/components/admin/GenerationLogs";

export default function AdminGenerationPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <GenerationTrigger />
      <GenerationLogs />
    </div>
  );
}
