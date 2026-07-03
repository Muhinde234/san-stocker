import { Bell, Mail, Search } from "lucide-react";

import { Sidebar } from "@/components/dash/sidebar";
import { StatCards } from "@/components/dash/stat-cards";
import { SalesTrendChart, TodaysOrders } from "@/components/dash/charts";
import { QuickActions, RecentCustomers, StockHealth } from "@/components/dash/bottom-sections";

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F4FF]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between px-8 pb-4 pt-8">
          <div>
            <h1 className="text-xl font-extrabold text-[#1a1d3b]">
              Good Morning, John Mwangi 👋
            </h1>
            <p className="mt-0.5 text-sm text-slate-400">
              Here&apos;s what&apos;s happening in your store today.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="relative flex size-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-[#E4E8F4]">
              <Bell className="size-4 text-slate-500" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#4264FB]" />
            </button>
            <button className="relative flex size-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-[#E4E8F4]">
              <Mail className="size-4 text-slate-500" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-emerald-500" />
            </button>
            <div className="flex size-9 items-center justify-center rounded-full bg-[#4264FB] text-sm font-bold text-white shadow-[0_2px_8px_rgba(66,100,251,0.35)]">
              JM
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-8 pb-6">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-[#E4E8F4]">
            <Search className="size-4 shrink-0 text-slate-400" />
            <input
              className="flex-1 bg-transparent text-sm text-[#1a1d3b] outline-none placeholder:text-slate-400"
              placeholder="Search products, orders, customers..."
            />
            <span className="rounded-lg border border-[#E4E8F4] px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
              ⌘K
            </span>
          </div>
        </div>

        <div className="space-y-5 px-8 pb-10">
          {/* Stat cards */}
          <StatCards />

          {/* Middle: chart + today's orders */}
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2">
              <SalesTrendChart />
            </div>
            <TodaysOrders />
          </div>

          {/* Bottom: recent customers + stock health */}
          <div className="grid grid-cols-2 gap-5">
            <RecentCustomers />
            <StockHealth />
          </div>

          {/* Quick actions */}
          <QuickActions />
        </div>
      </main>
    </div>
  );
}
