"use client";

import {
  BarChart3,
  Box,
  Crown,
  Headphones,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  UserCog,
  Users,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService, clearSession } from "@/lib/auth";
import { tokenStore } from "@/lib/axios";
import { useSession } from "@/hooks/use-session";

const nav = [
  { href: "/dashboard",           icon: LayoutDashboard, label: "Dashboard"  },
  { href: "/dashboard/products",  icon: Box,             label: "Products"   },
  { href: "/dashboard/sales",     icon: ShoppingCart,    label: "Sales"      },
  { href: "/dashboard/customers", icon: Users,           label: "Customers"  },
  { href: "/dashboard/suppliers", icon: Truck,           label: "Suppliers"  },
  { href: "/dashboard/inventory", icon: Warehouse,       label: "Inventory"  },
  { href: "/dashboard/reports",   icon: BarChart3,       label: "Reports"    },
  { href: "/dashboard/users",     icon: UserCog,         label: "Users"      },
  { href: "/dashboard/settings",  icon: Settings,        label: "Settings"   },
];

export function Sidebar() {
  const path   = usePathname();
  const router = useRouter();
  const { roleLabel } = useSession();

  async function handleLogout() {
    const refreshToken = tokenStore.getRefresh();
    if (refreshToken) await authService.logout(refreshToken);
    clearSession();
    router.push("/login");
  }

  return (
    <aside className="flex h-screen w-57.5 shrink-0 flex-col bg-[#0B1848]">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 pb-4 pt-6">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#4264FB] shadow-[0_4px_14px_rgba(66,100,251,0.50)]">
          <Package className="size-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold leading-tight text-white">SAN Stocker</p>
          <p className="truncate text-[10px] leading-tight text-white/40">Stock &amp; Shop Management</p>
        </div>
      </div>

      {/* ── Navigation ─────────────────────────────────── */}
      <nav className="flex flex-col gap-0.5 px-3 pt-2">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = path === href || (href !== "/dashboard" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-150 ${
                active
                  ? "bg-[#4264FB] text-white shadow-[0_4px_16px_rgba(66,100,251,0.35)]"
                  : "text-white/50 hover:bg-white/7 hover:text-white/90"
              }`}
            >
              <Icon
                className={`size-4.5 shrink-0 transition-colors ${
                  active ? "text-white" : "text-white/40"
                }`}
                strokeWidth={active ? 2.2 : 1.7}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* ── Spacer ─────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Plan card ──────────────────────────────────── */}
      <div className="mx-3 mb-2 rounded-2xl bg-white/5 p-4 ring-1 ring-white/8">
        {/* Crown + title + badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="size-4 text-amber-400" strokeWidth={1.8} />
            <span className="text-xs font-bold text-white">Business Plan</span>
          </div>
          <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-amber-400">
            Premium
          </span>
        </div>

        {/* Renewal date */}
        <p className="mt-2 text-[11px] leading-snug text-white/45">
          Your plan renews on{" "}
          <span className="font-semibold text-white/70">24 Dec 2025</span>
        </p>

        {/* Upgrade button */}
        <button className="mt-3 w-full rounded-xl bg-[#4264FB] py-2 text-[12px] font-bold text-white shadow-[0_3px_10px_rgba(66,100,251,0.40)] transition-colors hover:bg-[#3555e0] active:scale-[0.98]">
          Upgrade Plan
        </button>
      </div>

      {/* ── Help & Support ─────────────────────────────── */}
      <div className="px-3">
        <Link
          href="/dashboard/support"
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-150 ${
            path === "/dashboard/support"
              ? "bg-[#4264FB] text-white"
              : "text-white/50 hover:bg-white/7 hover:text-white/90"
          }`}
        >
          <Headphones
            className={`size-4.5 shrink-0 ${path === "/dashboard/support" ? "text-white" : "text-white/40"}`}
            strokeWidth={1.7}
          />
          Help &amp; Support
        </Link>
      </div>

      {/* ── Logout ─────────────────────────────────────── */}
      <div className="px-3 pb-5 pt-1">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-white/50 transition-all duration-150 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="size-4.5 shrink-0 text-white/40 transition-colors hover:text-red-400" strokeWidth={1.7} />
          Logout
        </button>
      </div>

    </aside>
  );
}
