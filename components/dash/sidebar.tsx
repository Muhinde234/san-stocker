"use client";

import {
  BarChart3,
  Box,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard",           icon: LayoutDashboard, label: "Overview"   },
  { href: "/dashboard/products",  icon: Box,             label: "Products"   },
  { href: "/dashboard/sales",     icon: ShoppingCart,    label: "Sales"      },
  { href: "/dashboard/customers", icon: Users,           label: "Customers"  },
  { href: "/dashboard/suppliers", icon: Truck,           label: "Suppliers"  },
  { href: "/dashboard/inventory", icon: Warehouse,       label: "Inventory"  },
  { href: "/dashboard/reports",   icon: BarChart3,       label: "Reports"    },
  { href: "/dashboard/settings",  icon: Settings,        label: "Settings"   },
];

export function Sidebar() {
  const path = usePathname();

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col bg-[#0B1848]">

      {/* Top: app logo + user avatar */}
      <div className="flex items-center justify-between px-5 pb-5 pt-6">
        {/* Logo mark */}
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-[#4264FB] shadow-[0_4px_12px_rgba(66,100,251,0.45)]">
            <Package className="size-4 text-white" />
          </div>
          <span className="text-sm font-extrabold text-white">SAN Stocker</span>
        </div>
        {/* User avatar dot */}
        <div className="relative">
          <div className="flex size-8 items-center justify-center rounded-full bg-[#4264FB]/80 text-[11px] font-bold text-white ring-2 ring-white/10">
            JM
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-400 ring-1 ring-[#0B1848]" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-[#4264FB] text-white shadow-[0_4px_16px_rgba(66,100,251,0.40)]"
                  : "text-white/55 hover:bg-white/8 hover:text-white"
              }`}
            >
              <Icon
                className={`size-4 shrink-0 ${active ? "text-white" : "text-white/45"}`}
                strokeWidth={active ? 2.5 : 1.8}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: user profile card */}
      <div className="m-3 rounded-2xl bg-white/6 p-3.5 ring-1 ring-white/8">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#4264FB] text-xs font-bold text-white shadow-[0_2px_8px_rgba(66,100,251,0.4)]">
              JM
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0B1848]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">John Mwangi</p>
            <p className="truncate text-[10px] text-white/50">Store Manager</p>
          </div>
          <Settings className="size-3.5 shrink-0 text-white/35 hover:text-white/70 cursor-pointer transition-colors" />
        </div>
      </div>

    </aside>
  );
}
