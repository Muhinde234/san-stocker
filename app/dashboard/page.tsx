"use client";

import { useState } from "react";
import { Bell, Mail, Menu, Search } from "lucide-react";

import { Sidebar } from "@/components/dash/sidebar";
import { ProfileMenu } from "@/components/dash/profile-menu";
import { StatCards } from "@/components/dash/stat-cards";
import { SalesTrendChart, TodaysOrders } from "@/components/dash/charts";
import { QuickActions, RecentCustomers, StockHealth } from "@/components/dash/bottom-sections";
import { useSession } from "@/hooks/use-session";

export default function DashboardPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { greeting, fullName, initials } = useSession();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F4FF]">

      {/* Mobile backdrop */}
      {navOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setNavOpen(false)}
        />
      )}

      {/* Sidebar — drawer on mobile, static column on lg+ */}
      <div
        className={[
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300",
          "lg:static lg:z-auto lg:translate-x-0 lg:transition-none",
          navOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <Sidebar onClose={() => setNavOpen(false)} />
      </div>

      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">

        {/* ── Mobile topbar ─────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-[#E4E8F4] bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setNavOpen(true)}
            className="flex size-9 items-center justify-center rounded-xl text-[#1a1d3b] hover:bg-[#F0F4FF]"
          >
            <Menu className="size-5" />
          </button>
          <p className="text-sm font-extrabold text-[#1a1d3b]">SAN Stocker</p>
          <div className="flex size-8 items-center justify-center rounded-full bg-[#4264FB] text-xs font-bold text-white">
            {initials}
          </div>
        </div>

        {/* ── Desktop header ────────────────────────────── */}
        <div className="hidden items-start justify-between px-8 pb-4 pt-8 lg:flex">
          <div>
            <h1 className="text-xl font-extrabold text-[#1a1d3b]">
              {greeting}, {fullName} 👋
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
            <ProfileMenu />
          </div>
        </div>

        {/* ── Mobile greeting ───────────────────────────── */}
        <div className="px-4 pb-3 pt-4 lg:hidden">
          <h1 className="text-lg font-extrabold text-[#1a1d3b]">
            {greeting}, {fullName} 👋
          </h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Here&apos;s what&apos;s happening today.
          </p>
        </div>

        {/* ── Search ────────────────────────────────────── */}
        <div className="px-4 pb-5 sm:px-8">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-[#E4E8F4]">
            <Search className="size-4 shrink-0 text-slate-400" />
            <input
              className="flex-1 bg-transparent text-sm text-[#1a1d3b] outline-none placeholder:text-slate-400"
              placeholder="Search products, orders, customers..."
            />
            <span className="hidden rounded-lg border border-[#E4E8F4] px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:block">
              ⌘K
            </span>
          </div>
        </div>

        {/* ── Content ───────────────────────────────────── */}
        <div className="space-y-5 px-4 pb-10 sm:px-8">
          <StatCards />

          {/* Charts row — stacks on small, side-by-side on xl */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <SalesTrendChart />
            </div>
            <TodaysOrders />
          </div>

          {/* Bottom row — stacks on mobile, side-by-side on md+ */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <RecentCustomers />
            <StockHealth />
          </div>

          <QuickActions />
        </div>
      </main>
    </div>
  );
}
