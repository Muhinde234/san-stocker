"use client";

import { useState } from "react";
import { Bell, Menu, PlusCircle, ShieldCheck } from "lucide-react";
import { SuperAdminSidebar } from "@/components/super-admin/sidebar";
import { RegisterTenantModal } from "@/components/register-tenant-modal";
import { useSession } from "@/hooks/use-session";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const { initials } = useSession();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F4FF]">

      {/* Mobile backdrop */}
      {navOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setNavOpen(false)}
        />
      )}

      {/* Sidebar — drawer on mobile, static on lg+ */}
      <div
        className={[
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300",
          "lg:static lg:z-auto lg:translate-x-0 lg:transition-none",
          navOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <SuperAdminSidebar onClose={() => setNavOpen(false)} />
      </div>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* ── Top navbar ─────────────────────────────────────────────── */}
        <header className="flex shrink-0 items-center justify-between border-b border-[#E4E8F4] bg-white px-4 py-3 lg:px-8 lg:py-4">

          {/* Left — hamburger (mobile) + branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNavOpen(true)}
              className="flex size-9 items-center justify-center rounded-xl text-[#1a1d3b] hover:bg-[#F0F4FF] lg:hidden"
            >
              <Menu className="size-5" />
            </button>

            {/* Logo mark — desktop only */}
            <div className="hidden items-center gap-2.5 lg:flex">
              <div className="flex size-8 items-center justify-center rounded-xl bg-amber-400 shadow-[0_3px_8px_rgba(251,191,36,0.40)]">
                <ShieldCheck className="size-4 text-[#0B1848]" />
              </div>
              <div>
                <p className="text-[13px] font-extrabold leading-none text-[#0B1848]">SAN TECH</p>
                <p className="text-[10px] leading-none text-amber-500">Super Admin Portal</p>
              </div>
            </div>

            {/* Mobile label */}
            <p className="text-sm font-extrabold text-[#1a1d3b] lg:hidden">SAN TECH Admin</p>
          </div>

          {/* Right — actions */}
          <div className="flex items-center gap-2.5">
            {/* Register Business — the primary CTA */}
            <RegisterTenantModal
              adminMode
              onBeforeOpen={() => setNavOpen(false)}
              triggerLabel={
                <span className="flex items-center gap-2">
                  <PlusCircle className="size-4" />
                  <span className="hidden sm:inline">Register Business</span>
                </span>
              }
              triggerClassName={[
                "flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-[13px] font-bold text-[#0B1848]",
                "shadow-[0_3px_0_#d97706] transition-all hover:-translate-y-px hover:shadow-[0_4px_0_#d97706]",
                "active:translate-y-0 active:shadow-[0_1px_0_#d97706]",
              ].join(" ")}
            />

            {/* Notifications */}
            <button className="relative flex size-9 items-center justify-center rounded-xl bg-[#F0F4FF] text-slate-500 transition-colors hover:bg-[#E4E8F4]">
              <Bell className="size-4" />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-red-500" />
            </button>

            {/* Admin avatar */}
            <div className="flex size-9 items-center justify-center rounded-full bg-amber-400 text-xs font-extrabold text-[#0B1848] shadow-[0_2px_8px_rgba(251,191,36,0.40)]">
              {initials || "SA"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

      </div>
    </div>
  );
}
