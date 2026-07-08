"use client";

import { Shield } from "lucide-react";
import { EmptyState } from "@/components/super-admin/empty-state";

export default function SuperAdminAuditPage() {
  return (
    <main className="flex-1 overflow-y-auto">

      {/* Header */}
      <div className="px-8 pb-4 pt-8">
        <div className="flex items-center gap-2">
          <Shield className="size-5 text-amber-400" />
          <h1 className="text-xl font-extrabold text-[#1a1d3b]">Audit Logs</h1>
        </div>
        <p className="mt-0.5 text-sm text-slate-400">
          Track sensitive actions across all client businesses.
        </p>
      </div>

      <div className="px-8 pb-10">
        <EmptyState
          icon={Shield}
          title="Platform-wide audit trail isn't available yet"
          message="GET /api/v1/audit-logs only returns entries for the current tenant. A cross-tenant endpoint (or a tenant filter for super-admin callers) is needed before this page can show real data."
        />
      </div>
    </main>
  );
}
