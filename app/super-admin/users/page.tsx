"use client";

import { useState } from "react";
import { Search, UserCog, UserPlus } from "lucide-react";

import { Pagination } from "@/components/ui/pagination";

interface UserRow {
  id:        string;
  name:      string;
  email:     string;
  role:      string;
  tenant:    string;
  status:    "ACTIVE" | "SUSPENDED" | "PENDING";
  createdAt: string;
}

const MOCK_USERS: UserRow[] = [
  { id: "u1", name: "Alice Uwimana",   email: "alice@kigalifresh.rw",  role: "OWNER",    tenant: "Kigali Fresh Mart",   status: "ACTIVE",    createdAt: "2025-05-01" },
  { id: "u2", name: "Bob Nkurunziza",  email: "bob@kigalifresh.rw",    role: "MANAGER",  tenant: "Kigali Fresh Mart",   status: "ACTIVE",    createdAt: "2025-05-04" },
  { id: "u3", name: "Chloe Ineza",     email: "chloe@muhangamart.rw",  role: "OWNER",    tenant: "Muhanga Supermarket", status: "ACTIVE",    createdAt: "2025-03-15" },
  { id: "u4", name: "David Hakizimana",email: "david@muhangamart.rw",  role: "CASHIER",  tenant: "Muhanga Supermarket", status: "SUSPENDED", createdAt: "2025-03-20" },
  { id: "u5", name: "Eve Mugisha",     email: "eve@visionrw.com",      role: "OWNER",    tenant: "Vision Electronics",  status: "ACTIVE",    createdAt: "2025-01-20" },
  { id: "u6", name: "Frank Bizimana",  email: "frank@visionrw.com",    role: "SALES_REP",tenant: "Vision Electronics",  status: "PENDING",   createdAt: "2025-06-01" },
];

const STATUS_BADGE: Record<UserRow["status"], string> = {
  ACTIVE:    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  SUSPENDED: "bg-red-50 text-red-600 ring-1 ring-red-200",
  PENDING:   "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
};

const ROLE_BADGE: Record<string, string> = {
  OWNER:    "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  MANAGER:  "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  CASHIER:  "bg-slate-50 text-slate-600 ring-1 ring-slate-200",
  SALES_REP:"bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200",
};

const FILTERS: Array<{ label: string; value: string }> = [
  { label: "All Users",   value: ""          },
  { label: "Owners",      value: "OWNER"     },
  { label: "Managers",    value: "MANAGER"   },
  { label: "Cashiers",    value: "CASHIER"   },
  { label: "Suspended",   value: "SUSPENDED" },
];

export default function SuperAdminUsersPage() {
  const [search,  setSearch]  = useState("");
  const [roleFilter, setRole] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = MOCK_USERS.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.tenant.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter
      ? true
      : roleFilter === "SUSPENDED"
        ? u.status === "SUSPENDED"
        : u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleUsers = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <main className="flex-1 overflow-y-auto">

      {/* Header */}
      <div className="flex items-start justify-between px-8 pb-4 pt-8">
        <div>
          <div className="flex items-center gap-2">
            <UserCog className="size-5 text-amber-400" />
            <h1 className="text-xl font-extrabold text-[#1a1d3b]">User Management</h1>
          </div>
          <p className="mt-0.5 text-sm text-slate-400">
            View and manage users across all client businesses.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-[#0B1848] shadow-[0_4px_0_#d97706] transition-all hover:-translate-y-0.5 active:translate-y-0">
          <UserPlus className="size-4" />
          Invite User
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 px-8 pb-6 sm:grid-cols-4">
        {[
          { label: "Total Users",  value: MOCK_USERS.length,                                          color: "text-[#4264FB]" },
          { label: "Active",       value: MOCK_USERS.filter((u) => u.status === "ACTIVE").length,     color: "text-emerald-600" },
          { label: "Suspended",    value: MOCK_USERS.filter((u) => u.status === "SUSPENDED").length,  color: "text-red-500" },
          { label: "Pending",      value: MOCK_USERS.filter((u) => u.status === "PENDING").length,    color: "text-amber-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#E4E8F4]">
            <p className="text-xs font-medium text-slate-400">{label}</p>
            <p className={`mt-1 text-2xl font-extrabold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap items-center gap-3 px-8 pb-5">
        <div className="flex flex-1 min-w-48 items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-[#E4E8F4]">
          <Search className="size-4 shrink-0 text-slate-400" />
          <input
            className="flex-1 bg-transparent text-sm text-[#1a1d3b] outline-none placeholder:text-slate-400"
            placeholder="Search by name, email, or business…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5 rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-[#E4E8F4]">
          {FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setRole(value)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                roleFilter === value
                  ? "bg-amber-400 text-[#0B1848] shadow-sm"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="px-8 pb-10">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-[#E4E8F4] overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#E4E8F4] px-6 py-4">
            <p className="text-sm font-bold text-[#1a1d3b]">All Users</p>
            <span className="rounded-full bg-[#EEF1FF] px-2.5 py-1 text-[10px] font-semibold text-[#4264FB]">
              {filtered.length} users
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E4E8F4] text-left">
                  {["User", "Business", "Role", "Status", "Joined", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                      No users match your search.
                    </td>
                  </tr>
                ) : (
                  visibleUsers.map((u) => (
                    <tr key={u.id} className="border-b border-[#F4F6FB] transition-colors hover:bg-[#F8FAFF]">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EEF1FF] text-xs font-bold text-[#4264FB]">
                            {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1a1d3b]">{u.name}</p>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">{u.tenant}</td>
                      <td className="px-6 py-3.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${ROLE_BADGE[u.role] ?? "bg-slate-50 text-slate-600 ring-1 ring-slate-200"}`}>
                          {u.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_BADGE[u.status]}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-500">{u.createdAt}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <button className="rounded-lg border border-[#E4E8F4] px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors hover:border-[#4264FB] hover:text-[#4264FB]">
                            View
                          </button>
                          {u.status === "ACTIVE" ? (
                            <button className="rounded-lg border border-red-200 px-3 py-1.5 text-[11px] font-semibold text-red-500 transition-colors hover:bg-red-50">
                              Suspend
                            </button>
                          ) : (
                            <button className="rounded-lg border border-emerald-200 px-3 py-1.5 text-[11px] font-semibold text-emerald-600 transition-colors hover:bg-emerald-50">
                              Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </main>
  );
}
