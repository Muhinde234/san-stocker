"use client";

import { Building2, Eye, MoreHorizontal, ShieldOff, Zap } from "lucide-react";

export type SubscriptionStatus = "TRIALING" | "ACTIVE" | "SUSPENDED" | "EXPIRED" | "CANCELLED";

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  subscriptionStatus: SubscriptionStatus;
  plan?: string;
  createdAt: string;
  branchCount?: number;
  userCount?: number;
}

const STATUS_STYLE: Record<SubscriptionStatus, string> = {
  ACTIVE:    "bg-emerald-50 text-emerald-700",
  TRIALING:  "bg-amber-50  text-amber-600",
  SUSPENDED: "bg-red-50    text-red-600",
  EXPIRED:   "bg-slate-100 text-slate-500",
  CANCELLED: "bg-rose-50   text-rose-600",
};

function StatusBadge({ status }: { status: SubscriptionStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${STATUS_STYLE[status]}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

interface Props {
  tenants: Tenant[];
  onView?:    (t: Tenant) => void;
  onActivate?: (t: Tenant) => void;
  onSuspend?:  (t: Tenant) => void;
}

export function ClientTable({ tenants, onView, onActivate, onSuspend }: Props) {
  if (tenants.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#EEF1FF]">
          <Building2 className="size-6 text-[#4264FB]" />
        </div>
        <p className="text-sm font-semibold text-[#1a1d3b]">No clients yet</p>
        <p className="text-xs text-slate-400">Register your first client to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-[#E4E8F4] text-left">
            {["Business", "Contact", "Status", "Plan", "Branches", "Users", "Joined", "Actions"].map((h) => (
              <th key={h} className="px-5 py-3 font-semibold text-slate-400 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tenants.map((t) => (
            <tr
              key={t.id}
              className="border-b border-[#F0F3FB] transition-colors last:border-0 hover:bg-[#F8F9FF]"
            >
              {/* Business */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#EEF1FF] text-[10px] font-bold text-[#4264FB]">
                    {t.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1d3b]">{t.name}</p>
                    <p className="text-[10px] text-slate-400">{t.address ?? "—"}</p>
                  </div>
                </div>
              </td>

              {/* Contact */}
              <td className="px-5 py-4">
                <p className="text-[#1a1d3b]">{t.email}</p>
                <p className="text-[10px] text-slate-400">{t.phone}</p>
              </td>

              {/* Status */}
              <td className="px-5 py-4">
                <StatusBadge status={t.subscriptionStatus} />
              </td>

              {/* Plan */}
              <td className="px-5 py-4 font-medium text-[#1a1d3b]">{t.plan ?? "—"}</td>

              {/* Branches */}
              <td className="px-5 py-4 text-center font-semibold text-[#1a1d3b]">
                {t.branchCount ?? 1}
              </td>

              {/* Users */}
              <td className="px-5 py-4 text-center font-semibold text-[#1a1d3b]">
                {t.userCount ?? "—"}
              </td>

              {/* Joined */}
              <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                {new Date(t.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit", month: "short", year: "numeric",
                })}
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onView?.(t)}
                    title="View details"
                    className="flex size-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-[#EEF1FF] hover:text-[#4264FB]"
                  >
                    <Eye className="size-3.5" />
                  </button>

                  {t.subscriptionStatus === "SUSPENDED" ? (
                    <button
                      onClick={() => onActivate?.(t)}
                      title="Activate"
                      className="flex size-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      <Zap className="size-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onSuspend?.(t)}
                      title="Suspend"
                      className="flex size-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <ShieldOff className="size-3.5" />
                    </button>
                  )}

                  <button
                    title="More"
                    className="flex size-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-[#F4F6FC] hover:text-slate-600"
                  >
                    <MoreHorizontal className="size-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
