import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  message,
}: {
  icon:    LucideIcon;
  title:   string;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white px-8 py-20 text-center shadow-sm ring-1 ring-[#E4E8F4]">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-400/15">
        <Icon className="size-6 text-amber-500" />
      </div>
      <p className="text-sm font-bold text-[#1a1d3b]">{title}</p>
      <p className="max-w-sm text-sm text-slate-400">{message}</p>
    </div>
  );
}
