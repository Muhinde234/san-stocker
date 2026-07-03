import { AlertTriangle, Package, ShoppingCart, TrendingUp } from "lucide-react";

const stats = [
  {
    label: "Total Products",
    value: "1,247",
    change: "+12% from last month",
    positive: true,
    icon: Package,
    iconBg: "bg-blue-50",
    iconColor: "text-[#4264FB]",
  },
  {
    label: "Orders Today",
    value: "38",
    change: "+8% from yesterday",
    positive: true,
    icon: ShoppingCart,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
  {
    label: "Low Stock Items",
    value: "14",
    change: "+5% from last week",
    positive: false,
    icon: AlertTriangle,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map(({ label, value, change, positive, icon: Icon, iconBg, iconColor }) => (
        <div
          key={label}
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#E4E8F4]"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">{label}</p>
              <p className="mt-2 text-3xl font-extrabold text-[#1a1d3b]">{value}</p>
              <p className={`mt-1.5 flex items-center gap-1 text-[11px] font-medium ${positive ? "text-emerald-500" : "text-red-500"}`}>
                <TrendingUp className="size-3" />
                {change}
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
