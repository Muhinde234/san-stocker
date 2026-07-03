import { Bell, Mail, Menu, Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#E4E8F4] bg-white px-6">
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-slate-700 lg:hidden">
          <Menu className="size-5" />
        </button>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search for products, customers, orders..."
            className="h-10 w-80 rounded-2xl border border-[#E4E8F4] bg-[#F4F6FC] pl-10 pr-16 text-sm text-[#1a1d3b] placeholder:text-slate-400 focus:border-[#4264FB]/40 focus:outline-none focus:ring-2 focus:ring-[#4264FB]/15"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-[#E4E8F4] bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
            ⌘K
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button className="relative flex size-9 items-center justify-center rounded-xl bg-[#F4F6FC] text-slate-500 hover:bg-[#E8ECF8] hover:text-[#4264FB]">
          <Bell className="size-4" />
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#4264FB] text-[9px] font-bold text-white shadow-[0_2px_6px_rgba(66,100,251,0.4)]">
            3
          </span>
        </button>
        <button className="relative flex size-9 items-center justify-center rounded-xl bg-[#F4F6FC] text-slate-500 hover:bg-[#E8ECF8] hover:text-[#4264FB]">
          <Mail className="size-4" />
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
            5
          </span>
        </button>

        <div className="ml-1 flex items-center gap-2.5 rounded-2xl border border-[#E4E8F4] bg-[#F4F6FC] px-3 py-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-[#4264FB] text-xs font-bold text-white shadow-[0_2px_8px_rgba(66,100,251,0.35)]">
            JM
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1a1d3b]">John Mwangi</p>
            <p className="text-[10px] text-slate-400">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
