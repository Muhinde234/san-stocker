"use client";

import { RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { SuperAdminStatCards } from "@/components/super-admin/stat-cards";
import { ClientTable, type Tenant } from "@/components/super-admin/client-table";
import { api } from "@/lib/api";

type RawTenant = Record<string, unknown>;
type TenantsResponse = RawTenant[] | { data?: RawTenant[]; items?: RawTenant[]; results?: RawTenant[] };

function extractTenants(payload: TenantsResponse | null | undefined): RawTenant[] {
  if (Array.isArray(payload)) return payload;
  if (!payload) return [];

  const candidates = [
    payload.data,
    payload.items,
    payload.results,
    (payload as { content?: RawTenant[] }).content,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

function normalizeStatus(status: string | undefined): Tenant["subscriptionStatus"] {
  switch ((status ?? "").toUpperCase()) {
    case "ACTIVE":
      return "ACTIVE";
    case "TRIALING":
      return "TRIALING";
    case "SUSPENDED":
      return "SUSPENDED";
    case "EXPIRED":
      return "EXPIRED";
    case "CANCELLED":
    case "CANCELED":
      return "CANCELLED";
    default:
      return "TRIALING";
  }
}

function mapTenant(raw: RawTenant): Tenant {
  const createdAt = String(raw.createdAt ?? raw.created_at ?? raw.createdOn ?? new Date().toISOString());
  const subscription = raw.subscription as { plan?: string } | undefined;

  return {
    id: String(raw.id ?? raw._id ?? raw.tenantId ?? raw.tenant_id ?? raw.uuid ?? crypto.randomUUID()),
    name: String(raw.name ?? raw.businessName ?? raw.tenantName ?? "Unnamed business"),
    email: String(raw.email ?? raw.businessEmail ?? raw.contactEmail ?? ""),
    phone: String(raw.phone ?? raw.businessPhone ?? raw.contactPhone ?? ""),
    address: String(raw.address ?? raw.location ?? raw.businessAddress ?? ""),
    subscriptionStatus: normalizeStatus(String(raw.subscriptionStatus ?? raw.subscriptionStatusName ?? raw.status ?? "")),
    plan: String(raw.plan ?? raw.subscriptionPlan ?? subscription?.plan ?? ""),
    createdAt,
    branchCount: Number(raw.branchCount ?? raw.branchesCount ?? raw.branches ?? 1),
    userCount: Number(raw.userCount ?? raw.usersCount ?? raw.users ?? 0),
  };
}

function toTenantList(payload: TenantsResponse | null | undefined): Tenant[] {
  return extractTenants(payload).map(mapTenant);
}

export default function SuperAdminPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pageSize = 5;

  const loadTenants = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await api.get<TenantsResponse>("/api/v1/tenants", {
        query: {
          page: 1,
          limit: 100,
          search: search.trim() || undefined,
        },
      });
      setTenants(toTenantList(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tenants.");
      setTenants([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTenants();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadTenants]);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleTenants = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <main className="flex-1 overflow-y-auto">

      {/* Page title */}
      <div className="px-8 pb-4 pt-8">
        <h1 className="text-xl font-extrabold text-[#1a1d3b]">Client Overview</h1>
        <p className="mt-0.5 text-sm text-slate-400">
          Manage all client businesses and their subscriptions.
        </p>
      </div>

      {/* Search */}
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
      </div>

      <div className="space-y-5 px-8 pb-10">
        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

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
          {loading ? (
            <div className="px-6 py-16 text-center text-sm text-slate-400">Loading tenants…</div>
          ) : (
          <ClientTable
            tenants={visibleTenants}
            pagination={{ currentPage: safePage, totalPages, onPageChange: setPage }}
          />
          )}
        </div>
      </div>
    </main>
  );
}

