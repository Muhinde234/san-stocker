import { Package } from "lucide-react";
import Link from "next/link";

export function HomeNav() {
  return (
    <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 pt-6 sm:px-6 lg:px-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#4264FB] shadow-[0_4px_14px_rgba(66,100,251,0.5)]">
          <Package className="size-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <p className="text-base font-extrabold leading-none text-white">
            SAN Stocker
          </p>
          <p className="mt-0.5 text-[11px] leading-none text-slate-400">
            Stock &amp; Shop Management
          </p>
        </div>
      </Link>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          Get started
        </Link>
      </div>
    </nav>
  );
}
