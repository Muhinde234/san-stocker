"use client";

import { Bell, RefreshCw, Search } from "lucide-react";
import { useState } from "react";

import { RegisterTenantModal } from "@/components/register-tenant-modal";
import { SuperAdminStatCards } from "@/components/super-admin/stat-cards";
import { ClientTable, type Tenant } from "@/components/super-admin/client-table";

// ── placeholder data — replace with API fetch when endpoints are ready ─────────
const MOCK_TENANTS: Tenant[] = [
  {
    id: "1",
    name: "Kigali Fresh Mart",
    email: "info@kigalifresh.rw",
    phone: "0788 123 456",
    address: "KN 4 Ave, Kigali",
    subscriptionStatus: "TRIALING",
    plan: "Starter",
    createdAt: "2025-05-01T08:00:00Z",
    branchCount: 1,
    userCount: 4,
  },
  {
    id: "2",
    name: "Muhanga Supermarket",
    email: "admin@muhangamart.rw",
    phone: "0722 987 654",
    address: "Southern Province, Rwanda",
    subscriptionStatus: "ACTIVE",
    plan: "Business",
    createdAt: "2025-03-15T10:30:00Z",
    branchCount: 3,
    userCount: 18,
  },
  {
    id: "3",
    name: "Vision Electronics",
    email: "shop@visionrw.com",
    phone: "0700 456 789",
    address: "Remera, Kigali",
    subscriptionStatus: "SUSPENDED",
    plan: "Business",
    createdAt: "2025-01-20T09:00:00Z",
    branchCount: 2,
    userCount: 9,
  },
];

export default function SuperAdminPage() {
  const [search, setSearch] = useState("");

  const tenants = MOCK_TENANTS;

  const stats = {
    total:     tenants.length,
    active:    tenants.filter((t) => t.subscriptionStatus === "ACTIVE").length,
    trialing:  tenants.filter((t) => t.subscriptionStatus === "TRIALING").length,
    suspended: tenants.filter((t) => t.subscriptionStatus === "SUSPENDED").length,
  };

  const filtered = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="flex-1 overflow-y-auto">

      {/* Header */}
      <div className="flex items-start justify-between px-8 pb-4 pt-8">
        <div>
          <h1 className="text-xl font-extrabold text-[#1a1d3b]">SAN TECH — Client Overview</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Manage all client businesses and their subscriptions.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="relative flex size-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-[#E4E8F4]">
            <Bell className="size-4 text-slate-500" />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-red-500" />
          </button>
          <div className="flex size-9 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-[#0B1848]">
            SA
          </div>
        </div>
      </div>

      {/* Search + Register */}
      <div className="flex items-center gap-3 px-8 pb-6">
        <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-[#E4E8F4]">
          <Search className="size-4 shrink-0 text-slate-400" />
          <input
            className="flex-1 bg-transparent text-sm text-[#1a1d3b] outline-none placeholder:text-slate-400"
            placeholder="Search clients by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex size-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-[#E4E8F4] text-slate-500 hover:text-[#4264FB] transition-colors">
          <RefreshCw className="size-4" />
        </button>
        <RegisterTenantModal
          adminMode
          triggerLabel="+ Register Client"
          triggerClassName="flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-[#0B1848] shadow-[0_4px_0_#d97706] transition-all hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
        />
      </div>

      <div className="space-y-5 px-8 pb-10">
        {/* Stats */}
        <SuperAdminStatCards {...stats} />

        {/* Client table */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-[#E4E8F4]">
          <div className="flex items-center justify-between border-b border-[#E4E8F4] px-6 py-4">
            <p className="text-sm font-bold text-[#1a1d3b]">All Clients</p>
            <span className="rounded-full bg-[#EEF1FF] px-2.5 py-1 text-[10px] font-semibold text-[#4264FB]">
              {filtered.length} total
            </span>
          </div>
          <ClientTable tenants={filtered} />
        </div>
      </div>
    </main>
  );
}

