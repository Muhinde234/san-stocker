"use client";

import {
  BarChart3,
  Building2,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearSession } from "@/lib/auth";

const nav = [
  { href: "/super-admin",               icon: LayoutDashboard, label: "Overview"      },
  { href: "/super-admin/clients",        icon: Building2,       label: "Clients"       },
  { href: "/super-admin/subscriptions",  icon: CreditCard,      label: "Subscriptions" },
  { href: "/super-admin/reports",        icon: BarChart3,       label: "Reports"       },
  { href: "/super-admin/audit",          icon: Shield,          label: "Audit Logs"    },
  { href: "/super-admin/settings",       icon: Settings,        label: "Settings"      },
];

export function SuperAdminSidebar() {
  const path   = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-[#0B1848]">

      {/* Branding */}
      <div className="px-5 pb-5 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-amber-400 shadow-[0_4px_12px_rgba(251,191,36,0.45)]">
            <ShieldCheck className="size-5 text-[#0B1848]" />
          </div>
          <div>
            <p className="text-sm font-extrabold leading-none text-white">SAN TECH</p>
            <p className="mt-0.5 text-[10px] leading-none text-amber-400">Super Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = path === href || (href !== "/super-admin" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-amber-400 text-[#0B1848] shadow-[0_4px_16px_rgba(251,191,36,0.35)]"
                  : "text-white/55 hover:bg-white/8 hover:text-white"
              }`}
            >
              <Icon
                className={`size-4 shrink-0 ${active ? "text-[#0B1848]" : "text-white/45"}`}
                strokeWidth={active ? 2.5 : 1.8}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User profile + logout */}
      <div className="m-3 rounded-2xl bg-white/6 p-3.5 ring-1 ring-white/8">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-[#0B1848]">
            SA
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">SAN TECH Admin</p>
            <p className="truncate text-[10px] text-white/50">Super Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-white/35 transition-colors hover:text-red-400"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>

    </aside>
  );
}
