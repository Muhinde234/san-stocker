"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { SuperAdminSidebar } from "@/components/super-admin/sidebar";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

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

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile topbar */}
        <div className="flex items-center gap-3 border-b border-[#E4E8F4] bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setNavOpen(true)}
            className="flex size-9 items-center justify-center rounded-xl text-[#1a1d3b] hover:bg-[#F0F4FF]"
          >
            <Menu className="size-5" />
          </button>
          <p className="text-sm font-extrabold text-[#1a1d3b]">SAN TECH Admin</p>
        </div>

        {children}
      </div>
    </div>
  );
}
