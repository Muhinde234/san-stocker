"use client";

import { useState } from "react";
import { Search, UserPlus, Users } from "lucide-react";

import { Pagination } from "@/components/ui/pagination";

interface CustomerRow {
  id:        string;
  name:      string;
  email:     string;
  phone:     string;
  tenant:    string;
  purchases: number;
  totalSpent:number;
  lastSeen:  string;
  status:    "ACTIVE" | "INACTIVE";
}

const MOCK_CUSTOMERS: CustomerRow[] = [
  { id: "c1", name: "James Mwangi",     email: "james@mail.com",   phone: "0788 100 001", tenant: "Kigali Fresh Mart",   purchases: 145, totalSpent: 2_840_000, lastSeen: "2025-05-31", status: "ACTIVE"   },
  { id: "c2", name: "Grace Wanjiku",    email: "grace@mail.com",   phone: "0788 100 002", tenant: "Kigali Fresh Mart",   purchases: 89,  totalSpent: 1_120_000, lastSeen: "2025-05-30", status: "ACTIVE"   },
  { id: "c3", name: "David Ochieng",    email: "david@mail.com",   phone: "0722 200 001", tenant: "Muhanga Supermarket", purchases: 203, totalSpent: 5_600_000, lastSeen: "2025-05-29", status: "ACTIVE"   },
  { id: "c4", name: "Mary Atieno",      email: "mary@mail.com",    phone: "0722 200 002", tenant: "Muhanga Supermarket", purchases: 12,  totalSpent:   98_000,  lastSeen: "2025-04-10", status: "INACTIVE" },
  { id: "c5", name: "Peter Kamau",      email: "peter@mail.com",   phone: "0700 300 001", tenant: "Vision Electronics",  purchases: 7,   totalSpent:  340_000,  lastSeen: "2025-03-01", status: "ACTIVE"   },
  { id: "c6", name: "Susan Njeri",      email: "susan@mail.com",   phone: "0700 300 002", tenant: "Vision Electronics",  purchases: 31,  totalSpent:  870_000,  lastSeen: "2025-05-20", status: "ACTIVE"   },
];

const STATUS_BADGE: Record<CustomerRow["status"], string> = {
  ACTIVE:   "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  INACTIVE: "bg-slate-50 text-slate-500 ring-1 ring-slate-200",
};

function fmtRwf(n: number) {
  return `RWF ${(n / 1000).toFixed(0)}K`;
}

export default function SuperAdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"" | "ACTIVE" | "INACTIVE">("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = MOCK_CUSTOMERS.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.tenant.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filter || c.status === filter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleCustomers = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const totalPurchases = MOCK_CUSTOMERS.reduce((s, c) => s + c.purchases, 0);
  const totalRevenue   = MOCK_CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0);

  return (
    <main className="flex-1 overflow-y-auto">

      {/* Header */}
      <div className="flex items-start justify-between px-8 pb-4 pt-8">
        <div>
          <div className="flex items-center gap-2">
            <Users className="size-5 text-amber-400" />
            <h1 className="text-xl font-extrabold text-[#1a1d3b]">Customer Management</h1>
          </div>
          <p className="mt-0.5 text-sm text-slate-400">
            View customers and their purchase activity across all businesses.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-[#0B1848] shadow-[0_4px_0_#d97706] transition-all hover:-translate-y-0.5 active:translate-y-0">
          <UserPlus className="size-4" />
          Add Customer
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 px-8 pb-6 sm:grid-cols-4">
        {[
          { label: "Total Customers",  value: MOCK_CUSTOMERS.length,                                             color: "text-[#4264FB]" },
          { label: "Active",           value: MOCK_CUSTOMERS.filter((c) => c.status === "ACTIVE").length,        color: "text-emerald-600" },
          { label: "Total Purchases",  value: totalPurchases,                                                     color: "text-amber-500" },
          { label: "Total Revenue",    value: fmtRwf(totalRevenue),                                              color: "text-violet-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#E4E8F4]">
            <p className="text-xs font-medium text-slate-400">{label}</p>
            <p className={`mt-1 text-xl font-extrabold ${color}`}>{value}</p>
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
          {(["", "ACTIVE", "INACTIVE"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filter === v
                  ? "bg-amber-400 text-[#0B1848] shadow-sm"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {v === "" ? "All" : v === "ACTIVE" ? "Active" : "Inactive"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="px-8 pb-10">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-[#E4E8F4] overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#E4E8F4] px-6 py-4">
            <p className="text-sm font-bold text-[#1a1d3b]">All Customers</p>
            <span className="rounded-full bg-[#EEF1FF] px-2.5 py-1 text-[10px] font-semibold text-[#4264FB]">
              {filtered.length} customers
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E4E8F4] text-left">
                  {["Customer", "Business", "Phone", "Purchases", "Total Spent", "Last Seen", "Status"].map((h) => (
                    <th key={h} className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400">
                      No customers match your search.
                    </td>
                  </tr>
                ) : (
                  visibleCustomers.map((c) => (
                    <tr key={c.id} className="border-b border-[#F4F6FB] transition-colors hover:bg-[#F8FAFF]">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EEF1FF] text-xs font-bold text-[#4264FB]">
                            {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1a1d3b]">{c.name}</p>
                            <p className="text-[11px] text-slate-400">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">{c.tenant}</td>
                      <td className="px-6 py-3.5 text-slate-500">{c.phone}</td>
                      <td className="px-6 py-3.5 font-semibold text-[#1a1d3b]">{c.purchases}</td>
                      <td className="px-6 py-3.5 font-semibold text-emerald-600">{fmtRwf(c.totalSpent)}</td>
                      <td className="px-6 py-3.5 text-slate-500">{c.lastSeen}</td>
                      <td className="px-6 py-3.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_BADGE[c.status]}`}>
                          {c.status}
                        </span>
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
