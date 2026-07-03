"use client";

import {
  BarChart3,
  Box,
  Crown,
  DollarSign,
  Headphones,
  Heart,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Truck,
  UserCog,
  Users,
  Wallet,
  Warehouse,
} from "lucide-react";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService, clearSession } from "@/lib/auth";
import { isSuperAdmin, MODULE, type Module } from "@/lib/rbac";
import { tokenStore } from "@/lib/axios";
import { useSession } from "@/hooks/use-session";
import { usePermissions } from "@/hooks/use-permissions";

type NavItem = {
  href:   string;
  icon:   React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label:  string;
  module: Module;
};

const NAV: NavItem[] = [
  { href: "/dashboard",            icon: LayoutDashboard, label: "Dashboard",  module: MODULE.DASHBOARD  },
  { href: "/dashboard/pos",        icon: ShoppingCart,    label: "POS",        module: MODULE.POS        },
  { href: "/dashboard/products",   icon: Box,             label: "Products",   module: MODULE.PRODUCTS   },
  { href: "/dashboard/inventory",  icon: Warehouse,       label: "Inventory",  module: MODULE.INVENTORY  },
  { href: "/dashboard/purchasing", icon: ShoppingBag,     label: "Purchasing", module: MODULE.PURCHASING },
  { href: "/dashboard/suppliers",  icon: Truck,           label: "Suppliers",  module: MODULE.SUPPLIERS  },
  { href: "/dashboard/sales",      icon: BarChart3,       label: "Sales",      module: MODULE.SALES      },
  { href: "/dashboard/customers",  icon: Users,           label: "Customers",  module: MODULE.CUSTOMERS  },
  { href: "/dashboard/warehouse",  icon: Package,         label: "Warehouse",  module: MODULE.WAREHOUSE  },
  { href: "/dashboard/delivery",   icon: Truck,           label: "Delivery",   module: MODULE.DELIVERY   },
  { href: "/dashboard/financials", icon: DollarSign,      label: "Financials", module: MODULE.FINANCIALS },
  { href: "/dashboard/loyalty",    icon: Heart,           label: "Loyalty",    module: MODULE.LOYALTY    },
  { href: "/dashboard/promotions", icon: Tag,             label: "Promotions", module: MODULE.PROMOTIONS },
  { href: "/dashboard/hr",         icon: Users,           label: "HR",         module: MODULE.HR         },
  { href: "/dashboard/payroll",    icon: Wallet,          label: "Payroll",    module: MODULE.PAYROLL    },
  { href: "/dashboard/reports",    icon: BarChart3,       label: "Reports",    module: MODULE.REPORTS    },
  { href: "/dashboard/users",      icon: UserCog,         label: "Users",      module: MODULE.USERS      },
  { href: "/dashboard/audit",      icon: Shield,          label: "Audit Logs", module: MODULE.AUDIT_LOGS },
  { href: "/dashboard/settings",   icon: Settings,        label: "Settings",   module: MODULE.SETTINGS   },
];

export function Sidebar({ onClose }: { onClose?: () => void } = {}) {
  const path   = usePathname();
  const router = useRouter();
  const { user, initials, fullName, roleLabel } = useSession();
  const { canAccess } = usePermissions();

  // Super admins belong in /super-admin, not here
  useEffect(() => {
    if (user && isSuperAdmin(user.role)) {
      router.replace("/super-admin");
    }
  }, [user, router]);

  // Only show nav items the current user's role can access
  const visibleNav = NAV.filter((item) => canAccess(item.module));

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
      <nav className="flex flex-col gap-0.5 overflow-y-auto px-3 pt-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {visibleNav.map(({ href, icon: Icon, label }) => {
          const active = path === href || (href !== "/dashboard" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-150 ${
                active
                  ? "bg-[#4264FB] text-white shadow-[0_4px_16px_rgba(66,100,251,0.35)]"
                  : "text-white/50 hover:bg-white/7 hover:text-white/90"
              }`}
            >
              <Icon
                className={`size-4.5 shrink-0 transition-colors ${active ? "text-white" : "text-white/40"}`}
                strokeWidth={active ? 2.2 : 1.7}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      {/* ── Plan card ──────────────────────────────────── */}
      <div className="mx-3 mb-2 rounded-2xl bg-white/5 p-4 ring-1 ring-white/8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="size-4 text-amber-400" strokeWidth={1.8} />
            <span className="text-xs font-bold text-white">Business Plan</span>
          </div>
          <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-amber-400">
            Premium
          </span>
        </div>
        <p className="mt-2 text-[11px] leading-snug text-white/45">
          Your plan renews on{" "}
          <span className="font-semibold text-white/70">24 Dec 2025</span>
        </p>
        <div className="mt-2 border-t border-white/8 pt-2.5">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-full bg-[#4264FB] text-[10px] font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold text-white">{fullName}</p>
              <p className="truncate text-[10px] text-white/40">{roleLabel}</p>
            </div>
          </div>
        </div>
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
          <LogOut className="size-4.5 shrink-0 text-white/40 transition-colors" strokeWidth={1.7} />
          Logout
        </button>
      </div>

    </aside>
  );
}
