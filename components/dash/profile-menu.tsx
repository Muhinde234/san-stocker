"use client";

import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { authService, clearSession } from "@/lib/auth";
import { tokenStore } from "@/lib/axios";

export function ProfileMenu() {
  const router = useRouter();
  const { initials, fullName, roleLabel } = useSession();

  async function handleLogout() {
    const refreshToken = tokenStore.getRefresh();
    if (refreshToken) await authService.logout(refreshToken);
    clearSession();
    router.push("/login");
  }

  return (
    /* Wrapper — `group` drives all hover states */
    <div className="group relative">

      {/* ── Trigger chip ───────────────────────────────── */}
      <button
        type="button"
        className="flex items-center gap-2.5 rounded-2xl border border-[#E4E8F4] bg-white px-3 py-1.5 shadow-sm transition-all group-hover:border-[#C8D4F0] group-hover:shadow-md"
      >
        <div className="flex size-8 items-center justify-center rounded-full bg-[#4264FB] text-xs font-bold text-white shadow-[0_2px_8px_rgba(66,100,251,0.35)]">
          {initials}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-semibold leading-none text-[#1a1d3b]">{fullName}</p>
          <p className="mt-0.5 text-[10px] leading-none text-slate-400">{roleLabel}</p>
        </div>
        <ChevronDown className="hidden size-3.5 text-slate-400 transition-transform sm:block group-hover:rotate-180" />
      </button>

      {/* ── Dropdown ───────────────────────────────────── */}
      {/* pt-2 bridges the gap so the mouse doesn't drop hover state */}
      <div className="pointer-events-none absolute right-0 top-full z-50 w-56 pt-2 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(15,23,42,0.12)] ring-1 ring-[#E4E8F4]">

          {/* User info header */}
          <div className="flex items-center gap-3 border-b border-[#F0F4FF] bg-[#F8FAFF] px-4 py-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#4264FB] text-sm font-bold text-white shadow-[0_2px_8px_rgba(66,100,251,0.35)]">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#1a1d3b]">{fullName}</p>
              <p className="truncate text-[11px] text-slate-400">{roleLabel}</p>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-1.5">
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-[#F0F4FF] hover:text-[#1a1d3b]"
            >
              <div className="flex size-7 items-center justify-center rounded-lg bg-[#EEF2FF]">
                <User className="size-3.5 text-[#4264FB]" />
              </div>
              My Profile
            </Link>

            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-[#F0F4FF] hover:text-[#1a1d3b]"
            >
              <div className="flex size-7 items-center justify-center rounded-lg bg-[#EEF2FF]">
                <Settings className="size-3.5 text-[#4264FB]" />
              </div>
              Account Settings
            </Link>
          </div>

          {/* Divider */}
          <div className="mx-3 border-t border-[#F0F4FF]" />

          {/* Logout */}
          <div className="p-1.5">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <div className="flex size-7 items-center justify-center rounded-lg bg-slate-100 transition-colors group/btn hover:bg-red-100">
                <LogOut className="size-3.5 text-slate-400 transition-colors hover:text-red-500" />
              </div>
              Logout
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
