"use client";

import { RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ClientTable, type SubscriptionStatus, type Tenant } from "@/components/super-admin/client-table";
import { SuperAdminStatCards } from "@/components/super-admin/stat-cards";
import { api } from "@/lib/api";

type RawTenant = Record<string, unknown>;
type TenantsResponse = RawTenant[] | { data?: RawTenant[]; items?: RawTenant[]; results?: RawTenant[] };

type TenantDetails = Tenant & {
  status?: string;
  createdBy?: string;
  updatedAt?: string;
  subscription?: {
    plan?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  };
};

type TenantForm = {
  tenant: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
};

type SubscriptionForm = {
  plan: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
};

const EMPTY_TENANT_FORM: TenantForm = {
  tenant: { name: "", email: "", phone: "", address: "" },
};

const EMPTY_SUBSCRIPTION_FORM: SubscriptionForm = {
  plan: "STANDARD",
  status: "ACTIVE",
  startDate: "",
  endDate: "",
};

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

function normalizeStatus(status: string | undefined): SubscriptionStatus {
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

function formatDateInput(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
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

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [selectedTenant, setSelectedTenant] = useState<TenantDetails | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [tenantForm, setTenantForm] = useState<TenantForm>(EMPTY_TENANT_FORM);
  const [subscriptionForm, setSubscriptionForm] = useState<SubscriptionForm>(EMPTY_SUBSCRIPTION_FORM);

  const loadTenants = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await api.get<TenantsResponse>("/api/v1/tenants", {
        query: {
          page: 1,
          limit: 20,
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

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(tenants.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleTenants = tenants.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTenants();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadTenants]);

  const filtered = useMemo(
    () => tenants.filter((tenant) =>
      tenant.name.toLowerCase().includes(search.toLowerCase()) ||
      tenant.email.toLowerCase().includes(search.toLowerCase()) ||
      tenant.phone.toLowerCase().includes(search.toLowerCase())
    ),
    [search, tenants],
  );

  const stats = useMemo(() => ({
    total: tenants.length,
    active: tenants.filter((tenant) => tenant.subscriptionStatus === "ACTIVE").length,
    trialing: tenants.filter((tenant) => tenant.subscriptionStatus === "TRIALING").length,
    suspended: tenants.filter((tenant) => tenant.subscriptionStatus === "SUSPENDED").length,
  }), [tenants]);

  async function loadTenantDetails(tenantId: string) {
    setDetailLoading(true);
    setDetailError("");

    try {
      const data = await api.get<RawTenant>(`/api/v1/tenants/${tenantId}`);
      const mapped = mapTenant(data);
      const details: TenantDetails = {
        ...mapped,
        status: String((data as { status?: string }).status ?? mapped.subscriptionStatus),
        createdBy: String((data as { createdBy?: string }).createdBy ?? ""),
        updatedAt: String((data as { updatedAt?: string }).updatedAt ?? ""),
        subscription: (data as { subscription?: TenantDetails["subscription"] }).subscription,
      };

      setSelectedTenant(details);
      setTenantForm({
        tenant: {
          name: details.name,
          email: details.email,
          phone: details.phone,
          address: details.address ?? "",
        },
      });
      setSubscriptionForm({
        plan: details.subscription?.plan ?? details.plan ?? "STANDARD",
        status: normalizeStatus(details.subscription?.status ?? details.subscriptionStatus),
        startDate: formatDateInput(details.subscription?.startDate),
        endDate: formatDateInput(details.subscription?.endDate),
      });
    } catch (err) {
      setDetailError(err instanceof Error ? err.message : "Failed to load tenant details.");
    } finally {
      setDetailLoading(false);
    }
  }

  async function openDetails(tenant: Tenant) {
    setShowEditModal(false);
    setShowSubscriptionModal(false);
    await loadTenantDetails(tenant.id);
  }

  function closeDetails() {
    setSelectedTenant(null);
    setDetailError("");
    setShowEditModal(false);
    setShowSubscriptionModal(false);
  }

  async function updateTenantStatus(tenant: Tenant, mode: "activate" | "suspend") {
    setSavingId(tenant.id);
    setError("");

    try {
      await api.patch(
        mode === "activate"
          ? `/api/v1/tenants/${tenant.id}/reactivate`
          : `/api/v1/tenants/${tenant.id}/deactivate`,
        {},
      );
      await loadTenants();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update tenant status.");
    } finally {
      setSavingId(null);
    }
  }

  async function saveTenantProfile() {
    if (!selectedTenant) return;

    setSavingId(selectedTenant.id);
    setError("");

    try {
      await api.patch(`/api/v1/tenants/${selectedTenant.id}`, tenantForm);
      await loadTenants();
      await loadTenantDetails(selectedTenant.id);
      setShowEditModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update tenant profile.");
    } finally {
      setSavingId(null);
    }
  }

  async function saveSubscription() {
    if (!selectedTenant) return;

    setSavingId(selectedTenant.id);
    setError("");

    try {
      await api.patch(`/api/v1/tenants/${selectedTenant.id}/subscription`, {
        subscriptionPlan: subscriptionForm.plan,
        status: subscriptionForm.status,
        startDate: subscriptionForm.startDate || undefined,
        endDate: subscriptionForm.endDate || undefined,
      });
      await loadTenants();
      await loadTenantDetails(selectedTenant.id);
      setShowSubscriptionModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update subscription.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="px-8 pb-4 pt-8">
        <h1 className="text-xl font-extrabold text-[#1a1d3b]">Client Overview</h1>
        <p className="mt-0.5 text-sm text-slate-400">
          Manage all client businesses, subscriptions, and access.
        </p>
      </div>

      <div className="flex items-center gap-3 px-8 pb-6">
        <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-[#E4E8F4]">
          <Search className="size-4 shrink-0 text-slate-400" />
          <input
            className="flex-1 bg-transparent text-sm text-[#1a1d3b] outline-none placeholder:text-slate-400"
            placeholder="Search clients by name, email, or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={() => void loadTenants()}
          className="flex size-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-[#E4E8F4] text-slate-500 transition-colors hover:text-[#4264FB]"
          title="Refresh"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="space-y-5 px-8 pb-10">
        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <SuperAdminStatCards {...stats} />

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-[#E4E8F4]">
          <div className="flex items-center justify-between border-b border-[#E4E8F4] px-6 py-4">
            <p className="text-sm font-bold text-[#1a1d3b]">All Clients</p>
            <span className="rounded-full bg-[#EEF1FF] px-2.5 py-1 text-[10px] font-semibold text-[#4264FB]">
              {filtered.length} total
            </span>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center text-sm text-slate-400">
              Loading tenants…
            </div>
          ) : (
            <ClientTable
              tenants={visibleTenants}
              pagination={{ currentPage: safePage, totalPages, onPageChange: setPage }}
              onView={(tenant) => {
                void openDetails(tenant);
              }}
              onEdit={(tenant) => {
                void openDetails(tenant).then(() => setShowEditModal(true));
              }}
              onSubscription={(tenant) => {
                void openDetails(tenant).then(() => setShowSubscriptionModal(true));
              }}
              onActivate={(tenant) => {
                void updateTenantStatus(tenant, "activate");
              }}
              onSuspend={(tenant) => {
                void updateTenantStatus(tenant, "suspend");
              }}
            />
          )}

          {savingId && !loading && (
            <div className="border-t border-[#E4E8F4] px-6 py-3 text-xs text-slate-400">
              Updating tenant {savingId}…
            </div>
          )}
        </div>
      </div>

      {selectedTenant && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={closeDetails} />

          <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-white shadow-[0_20px_70px_rgba(15,23,42,0.24)]">
            <div className="flex items-start justify-between border-b border-[#E4E8F4] px-6 py-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Tenant Details</p>
                <h2 className="mt-1 text-xl font-extrabold text-[#1a1d3b]">{selectedTenant.name}</h2>
                <p className="mt-1 text-sm text-slate-400">{selectedTenant.email}</p>
              </div>
              <button
                type="button"
                onClick={closeDetails}
                className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {detailLoading ? (
                <div className="py-12 text-sm text-slate-400">Loading tenant details…</div>
              ) : detailError ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{detailError}</div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard label="Status" value={selectedTenant.subscriptionStatus} />
                    <StatCard label="Plan" value={selectedTenant.plan || "—"} />
                    <StatCard label="Branches" value={String(selectedTenant.branchCount ?? 1)} />
                    <StatCard label="Users" value={String(selectedTenant.userCount ?? 0)} />
                  </div>

                  <section className="rounded-2xl border border-[#E4E8F4] p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Profile</p>
                    <dl className="mt-3 space-y-3 text-sm">
                      <Row label="Business" value={selectedTenant.name} />
                      <Row label="Email" value={selectedTenant.email} />
                      <Row label="Phone" value={selectedTenant.phone} />
                      <Row label="Address" value={selectedTenant.address ?? "—"} />
                      <Row label="Joined" value={new Date(selectedTenant.createdAt).toLocaleDateString("en-GB")} />
                    </dl>
                  </section>

                  <section className="rounded-2xl border border-[#E4E8F4] p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Actions</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(true)}
                        className="rounded-xl bg-[#4264FB] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Edit Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSubscriptionModal(true)}
                        className="rounded-xl bg-[#0B1848] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Update Subscription
                      </button>
                    </div>
                  </section>
                </div>
              )}
            </div>
          </aside>
        </>
      )}

      {selectedTenant && showEditModal && (
        <ModalShell title="Edit Tenant Profile" onClose={() => setShowEditModal(false)}>
          <div className="space-y-4">
            <Field label="Business Name">
              <input
                className="modal-input"
                value={tenantForm.tenant.name}
                onChange={(e) => setTenantForm((prev) => ({ ...prev, tenant: { ...prev.tenant, name: e.target.value } }))}
              />
            </Field>
            <Field label="Business Email">
              <input
                className="modal-input"
                value={tenantForm.tenant.email}
                onChange={(e) => setTenantForm((prev) => ({ ...prev, tenant: { ...prev.tenant, email: e.target.value } }))}
              />
            </Field>
            <Field label="Business Phone">
              <input
                className="modal-input"
                value={tenantForm.tenant.phone}
                onChange={(e) => setTenantForm((prev) => ({ ...prev, tenant: { ...prev.tenant, phone: e.target.value } }))}
              />
            </Field>
            <Field label="Address">
              <input
                className="modal-input"
                value={tenantForm.tenant.address}
                onChange={(e) => setTenantForm((prev) => ({ ...prev, tenant: { ...prev.tenant, address: e.target.value } }))}
              />
            </Field>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void saveTenantProfile()}
                className="rounded-xl bg-[#4264FB] px-4 py-2 text-sm font-semibold text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {selectedTenant && showSubscriptionModal && (
        <ModalShell title="Subscription Editor" onClose={() => setShowSubscriptionModal(false)}>
          <div className="space-y-4">
            <Field label="Plan">
              <input
                className="modal-input"
                value={subscriptionForm.plan}
                onChange={(e) => setSubscriptionForm((prev) => ({ ...prev, plan: e.target.value }))}
              />
            </Field>
            <Field label="Status">
              <select
                className="modal-input"
                value={subscriptionForm.status}
                onChange={(e) => setSubscriptionForm((prev) => ({ ...prev, status: e.target.value as SubscriptionStatus }))}
              >
                <option value="TRIALING">TRIALING</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="EXPIRED">EXPIRED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </Field>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Start Date">
                <input
                  type="date"
                  className="modal-input"
                  value={subscriptionForm.startDate}
                  onChange={(e) => setSubscriptionForm((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </Field>
              <Field label="End Date">
                <input
                  type="date"
                  className="modal-input"
                  value={subscriptionForm.endDate}
                  onChange={(e) => setSubscriptionForm((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </Field>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSubscriptionModal(false)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void saveSubscription()}
                className="rounded-xl bg-[#0B1848] px-4 py-2 text-sm font-semibold text-white"
              >
                Save Subscription
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      <style jsx global>{`
        .modal-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e4e8f4;
          background: #f8faff;
          padding: 0.75rem 0.9rem;
          font-size: 0.875rem;
          color: #1a1d3b;
          outline: none;
        }

        .modal-input:focus {
          border-color: #4264fb;
          box-shadow: 0 0 0 3px rgba(66, 100, 251, 0.12);
          background: #ffffff;
        }
      `}</style>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#F8FAFF] p-4 ring-1 ring-[#E4E8F4]">
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[#1a1d3b]">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#F0F4FF] pb-2 last:border-0 last:pb-0">
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-right font-medium text-[#1a1d3b]">{value}</dd>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
      {children}
    </label>
  );
}

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-[0_20px_70px_rgba(15,23,42,0.24)]">
          <div className="flex items-center justify-between border-b border-[#E4E8F4] px-6 py-5">
            <h3 className="text-lg font-extrabold text-[#1a1d3b]">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
            >
              ×
            </button>
          </div>
          <div className="px-6 py-5">{children}</div>
        </div>
      </div>
    </>
  );
}
