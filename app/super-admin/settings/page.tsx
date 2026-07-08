"use client";

import { Settings } from "lucide-react";
import { EmptyState } from "@/components/super-admin/empty-state";

export default function SuperAdminSettingsPage() {
  return (
    <main className="flex-1 overflow-y-auto">

      {/* Header */}
      <div className="px-8 pb-4 pt-8">
        <div className="flex items-center gap-2">
          <Settings className="size-5 text-amber-400" />
          <h1 className="text-xl font-extrabold text-[#1a1d3b]">Platform Settings</h1>
        </div>
        <p className="mt-0.5 text-sm text-slate-400">
          Configure global platform behavior.
        </p>
      </div>

      <div className="px-8 pb-10">
        <EmptyState
          icon={Settings}
          title="This module isn't implemented on the backend yet"
          message="GET /api/v1/system-settings/status explicitly reports itself as not yet implemented. This page will be built once the backend exposes real settings to read and update."
        />
      </div>
    </main>
  );
}
