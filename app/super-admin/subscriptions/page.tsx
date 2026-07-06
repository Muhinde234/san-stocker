"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Search,
  ShieldOff,
  XCircle,
  Zap,
} from "lucide-react";

import { Pagination } from "@/components/ui/pagination";

// ── Types ─────────────────────────────────────────────────────────────────────
type Status = "ALL" | "ACTIVE" | "TRIALING" | "SUSPENDED" | "EXPIRED";
type Plan   = "Starter" | "Business" | "Enterprise";

interface Client {
  id: string;
  name: string;
  email: string;
  status: Exclude<Status, "ALL">;
  plan: Plan;
  renewsAt: string | null;
  seats: number;
}

// ── Mock data (replace with API) ───────────────────────────────────────────────
const CLIENTS: Client[] = [
  {
    id: "1", name: "Kigali Fresh Mart",     email: "info@kigalifresh.rw",
    status: "TRIALING",  plan: "Starter",    renewsAt: null,          seats: 4,
  },
  {
    id: "2", name: "Muhanga Supermarket",   email: "admin@muhangamart.rw",
    status: "ACTIVE",    plan: "Business",   renewsAt: "2026-03-15",  seats: 18,
  },
  {
    id: "3", name: "Vision Electronics",    email: "shop@visionrw.com",
    status: "SUSPENDED", plan: "Business",   renewsAt: null,          seats: 9,
  },
  {
    id: "4", name: "Butare Tech Hub",       email: "hello@butaretech.rw",
    status: "ACTIVE",    plan: "Enterprise", renewsAt: "2026-06-01",  seats: 42,
  },
  {
    id: "5", name: "Nyamata Agro Shop",     email: "nyamata@agro.rw",
    status: "EXPIRED",   plan: "Starter",    renewsAt: null,          seats: 2,
  },
  {
    id: "6", name: "Kayonza Market",        email: "admin@kayonza.market",
    status: "ACTIVE",    plan: "Business",   renewsAt: "2026-07-15", seats: 14,
  },
  {
    id: "7", name: "Rubavu Wholesale",     email: "hello@rubavumarket.rw",
    status: "TRIALING",  plan: "Starter",    renewsAt: null,          seats: 5,
  },
];

const PLANS: Plan[] = ["Starter", "Business", "Enterprise"];

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_META: Record<Exclude<Status, "ALL">, { label: string; pill: string; icon: React.ComponentType<{ className?: string }> }> = {
  ACTIVE:    { label: "Active",    pill: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
  TRIALING:  { label: "Trialing",  pill: "bg-amber-50  text-amber-600",   icon: Clock        },
  SUSPENDED: { label: "Suspended", pill: "bg-red-50    text-red-600",     icon: ShieldOff    },
  EXPIRED:   { label: "Expired",   pill: "bg-slate-100 text-slate-500",   icon: XCircle      },
};

const FILTER_TABS: { value: Status; label: string }[] = [
  { value: "ALL",       label: "All"       },
  { value: "ACTIVE",    label: "Active"    },
  { value: "TRIALING",  label: "Trialing"  },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "EXPIRED",   label: "Expired"   },
];

const PLAN_COLOR: Record<Plan, string> = {
  Starter:    "bg-sky-50   text-sky-700",
  Business:   "bg-violet-50 text-violet-700",
  Enterprise: "bg-amber-50 text-amber-700",
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function SubscriptionsPage() {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState<Status>("ALL");
  const [clients, setClients] = useState<Client[]>(CLIENTS);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = clients.filter((c) => {
    const matchesStatus = filter === "ALL" || c.status === filter;
    const q = search.toLowerCase();
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleClients = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function changePlan(id: string, plan: Plan) {
    setClients((prev) => prev.map((c) => c.id === id ? { ...c, plan } : c));
  }

  function changeStatus(id: string, status: Exclude<Status, "ALL">) {
    setClients((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
  }

  const counts = {
    ACTIVE:    clients.filter((c) => c.status === "ACTIVE").length,
    TRIALING:  clients.filter((c) => c.status === "TRIALING").length,
    SUSPENDED: clients.filter((c) => c.status === "SUSPENDED").length,
    EXPIRED:   clients.filter((c) => c.status === "EXPIRED").length,
  };

  return (
    <main className="flex-1 overflow-y-auto">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between px-8 pb-4 pt-8">
        <div>
          <h1 className="text-xl font-extrabold text-[#1a1d3b]">Subscription Management</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Manage plans, activate, suspend, or renew client subscriptions.
          </p>
        </div>
        <div className="flex size-9 items-center justify-center rounded-2xl bg-amber-400/15">
          <CreditCard className="size-4.5 text-amber-600" />
        </div>
      </div>

      {/* ── Summary cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 px-8 pb-6 xl:grid-cols-4">
        {(["ACTIVE", "TRIALING", "SUSPENDED", "EXPIRED"] as const).map((s) => {
          const meta = STATUS_META[s];
          const Icon = meta.icon;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-2xl bg-white p-4 text-left shadow-sm ring-1 transition-all hover:shadow-md ${
                filter === s ? "ring-amber-400" : "ring-[#E4E8F4]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${meta.pill}`}>
                  {meta.label}
                </span>
                <Icon className="size-4 text-slate-300" />
              </div>
              <p className="mt-3 text-2xl font-extrabold text-[#1a1d3b]">{counts[s]}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">clients</p>
            </button>
          );
        })}
      </div>

      {/* ── Filters & search ───────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 px-8 pb-5">
        <div className="flex items-center gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-[#E4E8F4]">
          {FILTER_TABS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                filter === value
                  ? "bg-[#0B1848] text-white shadow-sm"
                  : "text-slate-500 hover:text-[#1a1d3b]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-1 items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-[#E4E8F4]">
          <Search className="size-3.5 shrink-0 text-slate-400" />
          <input
            className="flex-1 bg-transparent text-xs text-[#1a1d3b] outline-none placeholder:text-slate-400"
            placeholder="Search clients…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────── */}
      <div className="px-8 pb-10">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#E4E8F4]">
          <div className="flex items-center justify-between border-b border-[#E4E8F4] px-6 py-4">
            <p className="text-sm font-bold text-[#1a1d3b]">All Subscriptions</p>
            <span className="rounded-full bg-[#EEF1FF] px-2.5 py-1 text-[10px] font-semibold text-[#4264FB]">
              {filtered.length} shown
            </span>
          </div>

                {visibleClients.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">No clients match this filter.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#E4E8F4] text-left text-slate-400">
                    {["Client", "Status", "Plan", "Seats", "Renewal", "Actions"].map((h) => (
                      <th key={h} className="whitespace-nowrap px-5 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleClients.map((c) => {
                    const meta = STATUS_META[c.status];
                    return (
                      <tr
                        key={c.id}
                        className="border-b border-[#F0F3FB] transition-colors last:border-0 hover:bg-[#F8F9FF]"
                      >
                        {/* Client */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#EEF1FF] text-[10px] font-bold text-[#4264FB]">
                              {c.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-[#1a1d3b]">{c.name}</p>
                              <p className="text-[10px] text-slate-400">{c.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${meta.pill}`}>
                            {meta.label}
                          </span>
                        </td>

                        {/* Plan selector */}
                        <td className="px-5 py-4">
                          <select
                            value={c.plan}
                            onChange={(e) => changePlan(c.id, e.target.value as Plan)}
                            className={`cursor-pointer rounded-lg border-0 px-2.5 py-1 text-[10px] font-semibold outline-none ${PLAN_COLOR[c.plan]}`}
                          >
                            {PLANS.map((p) => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        </td>

                        {/* Seats */}
                        <td className="px-5 py-4 font-semibold text-[#1a1d3b]">{c.seats}</td>

                        {/* Renewal */}
                        <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                          {c.renewsAt
                            ? new Date(c.renewsAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                            : "—"}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            {c.status === "SUSPENDED" || c.status === "EXPIRED" ? (
                              <button
                                onClick={() => changeStatus(c.id, "ACTIVE")}
                                title="Activate"
                                className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                              >
                                <Zap className="size-3" />
                                Activate
                              </button>
                            ) : (
                              <button
                                onClick={() => changeStatus(c.id, "SUSPENDED")}
                                title="Suspend"
                                className="flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-[10px] font-semibold text-red-600 transition-colors hover:bg-red-100"
                              >
                                <ShieldOff className="size-3" />
                                Suspend
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </main>
  );
}
