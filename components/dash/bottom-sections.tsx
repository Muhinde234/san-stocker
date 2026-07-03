import { Camera, Laptop, Smartphone } from "lucide-react";

const customers = [
  { initials: "JM", bg: "bg-[#4264FB]",    name: "James Mwangi",  detail: "42 yrs • 145 purchases",  date: "31 May, 2025" },
  { initials: "GW", bg: "bg-emerald-500",  name: "Grace Wanjiku",  detail: "35 yrs • 89 purchases",   date: "30 May, 2025" },
  { initials: "DO", bg: "bg-purple-500",   name: "David Ochieng",  detail: "28 yrs • 203 purchases",  date: "29 May, 2025" },
];

const stockItems = [
  {
    icon: Smartphone,
    label: "Samsung Galaxy A15",
    units: 85, total: 100,
    iconBg: "bg-blue-50", iconColor: "text-[#4264FB]", barColor: "bg-[#4264FB]",
  },
  {
    icon: Laptop,
    label: "HP 250 G9 Laptop",
    units: 45, total: 100,
    iconBg: "bg-amber-50", iconColor: "text-amber-500", barColor: "bg-amber-500",
  },
  {
    icon: Camera,
    label: "Canon EOS 250D",
    units: 12, total: 100,
    iconBg: "bg-red-50", iconColor: "text-red-500", barColor: "bg-red-500",
  },
];

const CARD = "rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#E4E8F4]";

export function RecentCustomers() {
  return (
    <div className={CARD}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-bold text-[#1a1d3b]">Recent Customers</p>
        <button className="text-xs font-semibold text-[#4264FB] hover:underline">View all</button>
      </div>
      <div className="space-y-4">
        {customers.map(({ initials, bg, name, detail, date }) => (
          <div key={name} className="flex items-center gap-3">
            <div className={`flex size-9 shrink-0 items-center justify-center rounded-full ${bg} text-xs font-bold text-white`}>
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#1a1d3b]">{name}</p>
              <p className="text-[10px] text-slate-400">{detail}</p>
            </div>
            <span className="shrink-0 text-[10px] text-slate-400">{date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StockHealth() {
  return (
    <div className={CARD}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-bold text-[#1a1d3b]">Stock Health</p>
        <span className="text-xs text-slate-400">This Week</span>
      </div>
      <div className="space-y-5">
        {stockItems.map(({ icon: Icon, label, units, total, iconBg, iconColor, barColor }) => (
          <div key={label}>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`flex size-7 items-center justify-center rounded-xl ${iconBg}`}>
                  <Icon className={`size-3.5 ${iconColor}`} />
                </div>
                <span className="text-xs font-medium text-[#1a1d3b]">{label}</span>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {units}<span className="text-slate-300">/{total}</span>
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${barColor}`}
                style={{ width: `${(units / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
