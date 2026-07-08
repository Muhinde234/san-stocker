"use client";

import { BarChart3 } from "lucide-react";
import { EmptyState } from "@/components/super-admin/empty-state";

export default function SuperAdminReportsPage() {
  return (
    <main className="flex-1 overflow-y-auto">

      {/* Header */}
      <div className="px-8 pb-4 pt-8">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-5 text-amber-400" />
          <h1 className="text-xl font-extrabold text-[#1a1d3b]">Platform Reports</h1>
        </div>
        <p className="mt-0.5 text-sm text-slate-400">
          Aggregated analytics across all client businesses.
        </p>
      </div>

      <div className="px-8 pb-10">
        <EmptyState
          icon={BarChart3}
          title="Platform-wide reports aren't available yet"
          message="The backend only exposes sales and inventory summaries scoped to a single tenant (GET /api/v1/reports/sales-summary, /inventory-summary). A cross-tenant aggregate endpoint is needed before this page can show real data."
        />
      </div>
    </main>
  );
}
