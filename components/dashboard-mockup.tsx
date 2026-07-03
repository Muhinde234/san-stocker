import {
  BarChart3,
  Box,
  ChevronRight,
  Crown,
  ShoppingCart,
  Store,
  User,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";

const stats = [
  { icon: Users, label: "tenants",        value: "128",   delta: "12.4%" },
  { icon: Box,   label: "active modules", value: "18",    suffix: "/ 24", delta: "8.7%" },
  { icon: Store, label: "total outlets",  value: "356",   delta: "15.3%" },
  { icon: User,  label: "active users",   value: "1,248", delta: "10.6%" },
];

const usage = [
  { day: "mon", value: 58 },
  { day: "tue", value: 82 },
  { day: "wed", value: 68 },
  { day: "thu", value: 96 },
  { day: "fri", value: 80 },
  { day: "sat", value: 60 },
  { day: "sun", value: 88 },
];

const modules = [
  { icon: Box,       label: "inventory",  active: true  },
  { icon: ShoppingCart, label: "purchasing", active: true  },
  { icon: Wallet,    label: "finance",    active: true  },
  { icon: UserCog,   label: "hr",         active: false },
  { icon: BarChart3, label: "analytics",  active: true  },
  { icon: Users,     label: "crm",        active: false },
];

function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${
        active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
      }`}
    >
      {active ? "active" : "disabled"}
    </span>
  );
}

export function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-2xl xl:max-w-3xl xl:pb-40 xl:pr-8">
      {/* ── Main card ── */}
      <div className="rounded-2xl bg-white p-5 shadow-[0_30px_60px_-15px_rgba(1,11,65,0.5)] xl:rounded-3xl xl:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand-blue shadow-[0_3px_0_rgba(0,0,0,0.15)] xl:size-12">
              <Crown className="size-5 text-white xl:size-6" />
            </div>
            <span className="text-lg font-bold text-brand-navy xl:text-xl">pro max</span>
          </div>
          <StatusPill active />
        </div>

        <p className="mt-5 text-sm font-semibold text-brand-navy xl:mt-6 xl:text-base">overview</p>
        <div className="mt-2.5 grid grid-cols-2 gap-3 xl:mt-3 xl:grid-cols-4 xl:gap-4">
          {stats.map(({ icon: Icon, label, value, suffix, delta }) => (
            <div key={label} className="rounded-xl bg-slate-50 p-3 xl:rounded-2xl xl:p-4">
              <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 xl:size-9">
                <Icon className="size-4 text-brand-blue" />
              </div>
              <p className="mt-2 text-[11px] text-brand-muted xl:text-xs">{label}</p>
              <p className="text-lg font-bold text-brand-navy xl:text-xl">
                {value}
                {suffix && <span className="text-xs font-medium text-brand-muted xl:text-sm"> {suffix}</span>}
              </p>
              <p className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 xl:text-xs">
                <span aria-hidden>↑</span>
                {delta}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-sm font-semibold text-brand-navy xl:mt-6 xl:text-base">usage overview</p>
        <div className="mt-2.5 flex h-28 items-end gap-1.5 xl:mt-3 xl:h-36 xl:gap-2">
          {usage.map(({ day, value }) => (
            <div key={day} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex h-20 w-full items-end xl:h-28">
                <div
                  className="w-full rounded-t-md bg-linear-to-b from-brand-blue-light to-brand-blue"
                  style={{ height: `${value}%` }}
                />
              </div>
              <span className="text-[9px] text-brand-muted xl:text-xs">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── System status card — xl+ only ── */}
      <div className="absolute left-[88%] top-[20%] z-20 hidden w-[40%] rounded-3xl bg-white p-5 shadow-[0_30px_60px_-15px_rgba(1,11,65,0.5)] xl:block">
        <p className="text-base font-bold text-brand-navy">system status</p>
        <div className="mt-4 space-y-3">
          {modules.map(({ icon: Icon, label, active }) => (
            <div key={label} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Icon className="size-4 shrink-0 text-brand-blue" />
                <span className="text-sm text-brand-navy">{label}</span>
              </div>
              <StatusPill active={active} />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-5 flex w-full items-center justify-center gap-1 rounded-full bg-blue-50 py-2.5 text-sm font-semibold text-brand-blue transition-colors hover:bg-blue-100"
        >
          manage modules
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* ── Phone mockup — xl+ only ── */}
      <div className="absolute -bottom-28 left-[22%] z-30 hidden w-52 overflow-hidden rounded-[2.8rem] border-[7px] border-slate-900 bg-slate-900 shadow-[0_30px_60px_-10px_rgba(1,11,65,0.65)] xl:block">
        <span className="absolute -left-1 top-16 h-7 w-0.75 rounded-l-sm bg-slate-700" />
        <span className="absolute -left-1 top-24 h-12 w-0.75 rounded-l-sm bg-slate-700" />
        <span className="absolute -left-1 top-38 h-12 w-0.75 rounded-l-sm bg-slate-700" />
        <span className="absolute -right-1 top-20 h-16 w-0.75 rounded-r-sm bg-slate-700" />

        <div className="flex items-center justify-between bg-slate-900 px-4 pt-3 pb-1">
          <span className="text-[10px] font-semibold text-white">9:41</span>
          <div className="flex items-center gap-1">
            <svg viewBox="0 0 16 10" className="h-2.5 w-4 fill-white">
              <rect x="0" y="6" width="2.5" height="4" rx="0.5" />
              <rect x="3.5" y="4" width="2.5" height="6" rx="0.5" />
              <rect x="7" y="2" width="2.5" height="8" rx="0.5" />
              <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" opacity="0.35" />
              <rect x="14" y="0" width="2.5" height="10" rx="0.5" opacity="0.35" />
            </svg>
            <svg viewBox="0 0 14 10" className="h-2.5 w-3.5 fill-white">
              <path d="M7 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm0-3.5A6 6 0 0 1 11.6 6l-1.2 1a4 4 0 0 0-6.8 0L2.4 6A6 6 0 0 1 7 4.5Zm0-3.5a9 9 0 0 1 6.4 2.6L12.2 4.8A7 7 0 0 0 1.8 4.8L.6 3.6A9 9 0 0 1 7 1Z" />
            </svg>
            <svg viewBox="0 0 22 11" className="h-2.5 w-5 fill-white">
              <rect x="0.5" y="0.5" width="18" height="10" rx="2" stroke="white" strokeWidth="1" fill="none" opacity="0.5" />
              <rect x="1.5" y="1.5" width="14" height="8" rx="1.2" />
              <rect x="19.5" y="3.5" width="2" height="4" rx="1" opacity="0.5" />
            </svg>
          </div>
        </div>

        <div className="flex justify-center bg-slate-900 pb-2">
          <div className="h-6 w-24 rounded-full bg-black" />
        </div>

        <div className="bg-white">
          <div className="bg-linear-to-b from-brand-blue to-[#0a3fb0] px-4 py-4 text-center">
            <p className="text-base font-bold text-white">scan to order</p>
            <p className="mt-0.5 text-[10px] text-blue-200">point camera at QR code</p>
          </div>

          <div className="flex flex-col items-center px-4 py-5">
            <div className="flex size-32 items-center justify-center rounded-2xl border-2 border-slate-100 bg-slate-50 shadow-inner">
              <svg viewBox="0 0 100 100" className="size-28">
                <rect x="8" y="8" width="28" height="28" fill="none" stroke="#0a1142" strokeWidth="6" />
                <rect x="18" y="18" width="8" height="8" fill="#0a1142" />
                <rect x="64" y="8" width="28" height="28" fill="none" stroke="#0a1142" strokeWidth="6" />
                <rect x="74" y="18" width="8" height="8" fill="#0a1142" />
                <rect x="8" y="64" width="28" height="28" fill="none" stroke="#0a1142" strokeWidth="6" />
                <rect x="18" y="74" width="8" height="8" fill="#0a1142" />
                <rect x="48" y="8" width="6" height="6" fill="#0a1142" />
                <rect x="48" y="20" width="6" height="6" fill="#0a1142" />
                <rect x="60" y="48" width="6" height="6" fill="#0a1142" />
                <rect x="48" y="48" width="6" height="6" fill="#0a1142" />
                <rect x="72" y="48" width="6" height="6" fill="#0a1142" />
                <rect x="84" y="48" width="6" height="6" fill="#0a1142" />
                <rect x="48" y="60" width="6" height="6" fill="#0a1142" />
                <rect x="48" y="72" width="6" height="6" fill="#0a1142" />
                <rect x="48" y="84" width="6" height="6" fill="#0a1142" />
                <rect x="64" y="72" width="6" height="6" fill="#0a1142" />
                <rect x="76" y="84" width="16" height="8" fill="#0a1142" />
                <rect x="64" y="84" width="6" height="6" fill="#0a1142" />
              </svg>
            </div>
            <p className="mt-3 text-[10px] text-brand-muted">scan &amp; order instantly</p>
          </div>

          <div className="flex justify-center pb-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-linear-to-b from-brand-blue-light to-brand-blue shadow-[0_6px_16px_rgba(24,98,233,0.45)]">
              <ShoppingCart className="size-6 text-white" />
            </div>
          </div>

          <div className="flex justify-center bg-white pb-3 pt-1">
            <div className="h-1 w-20 rounded-full bg-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
