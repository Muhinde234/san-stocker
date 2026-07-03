import { Building2, CheckCircle2, Clock, TrendingUp, XCircle } from "lucide-react";

const stats = [
  {
    label:    "Total Clients",
    value:    "0",
    sub:      "registered businesses",
    icon:     Building2,
    iconBg:   "bg-blue-50",
    iconColor:"text-[#4264FB]",
    trend:    null,
  },
  {
    label:    "Active",
    value:    "0",
    sub:      "paid subscriptions",
    icon:     CheckCircle2,
    iconBg:   "bg-emerald-50",
    iconColor:"text-emerald-600",
    trend:    null,
  },
  {
    label:    "Trialing",
    value:    "0",
    sub:      "free trial period",
    icon:     Clock,
    iconBg:   "bg-amber-50",
    iconColor:"text-amber-500",
    trend:    null,
  },
  {
    label:    "Suspended",
    value:    "0",
    sub:      "action required",
    icon:     XCircle,
    iconBg:   "bg-red-50",
    iconColor:"text-red-500",
    trend:    null,
  },
];

interface Props {
  total?:     number;
  active?:    number;
  trialing?:  number;
  suspended?: number;
}

export function SuperAdminStatCards({ total = 0, active = 0, trialing = 0, suspended = 0 }: Props) {
  const values = [total, active, trialing, suspended];

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map(({ label, sub, icon: Icon, iconBg, iconColor }, i) => (
        <div key={label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#E4E8F4]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">{label}</p>
              <p className="mt-2 text-3xl font-extrabold text-[#1a1d3b]">{values[i]}</p>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                <TrendingUp className="size-3" />
                {sub}
              </p>
            </div>
            <div className={`flex size-11 items-center justify-center rounded-2xl ${iconBg}`}>
              <Icon className={`size-5 ${iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
