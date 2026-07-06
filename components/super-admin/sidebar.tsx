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
  UserCog,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService, clearSession } from "@/lib/auth";
import { tokenStore } from "@/lib/axios";
import { useSession } from "@/hooks/use-session";

const NAV_SECTIONS = [
  {
    label: "Platform",
    items: [
      { href: "/super-admin",              icon: LayoutDashboard, label: "Overview"         },
      { href: "/super-admin/clients",       icon: Building2,       label: "Clients"          },
      { href: "/super-admin/subscriptions", icon: CreditCard,      label: "Subscriptions"    },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/super-admin/users",         icon: UserCog,         label: "User Management"     },
      { href: "/super-admin/customers",     icon: Users,           label: "Customer Management" },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/super-admin/reports",  icon: BarChart3, label: "Reports"    },
      { href: "/super-admin/audit",    icon: Shield,    label: "Audit Logs" },
      { href: "/super-admin/settings", icon: Settings,  label: "Settings"   },
    ],
  },
];

export function SuperAdminSidebar({ onClose }: { onClose?: () => void } = {}) {
  const path   = usePathname();
  const router = useRouter();
  const { initials, fullName } = useSession();

  async function handleLogout() {
    const refreshToken = tokenStore.getRefresh();
    if (refreshToken) await authService.logout(refreshToken);
    clearSession();
    router.push("/login");
  }

  function isActive(href: string) {
    return href === "/super-admin"
      ? path === href
      : path === href || path.startsWith(href + "/");
  }

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-[#0B1848]">

      {/* Branding */}
      <div className="px-5 pb-4 pt-6">
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
      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 pt-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="mb-1 px-3 text-[9px] font-extrabold uppercase tracking-widest text-white/30">
              {section.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map(({ href, icon: Icon, label }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-150 ${
                      active
                        ? "bg-amber-400 text-[#0B1848] shadow-[0_4px_16px_rgba(251,191,36,0.35)]"
                        : "text-white/55 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`size-4 shrink-0 ${active ? "text-[#0B1848]" : "text-white/40"}`}
                      strokeWidth={active ? 2.5 : 1.8}
                    />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Profile + Logout */}
      <div className="m-3 rounded-2xl bg-white/6 p-3.5 ring-1 ring-white/8">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-[#0B1848]">
            {initials || "SA"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">{fullName || "SAN TECH Admin"}</p>
            <p className="truncate text-[10px] text-white/50">Super Administrator</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/8 px-3 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-red-500/15 hover:text-red-300"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </div>

    </aside>
  );
}
