import { ArrowRight, Check, Store } from "lucide-react";
import Link from "next/link";

import { DashboardMockup } from "@/components/dashboard-mockup";

const checklist = [
  "modular design",
  "role-based access",
  "any shop size",
  "qr ordering",
];

export function HomeHero() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-12 lg:py-20 xl:gap-16">

      {/* ── Left: text content ── */}
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-blue/40 px-4 py-1.5 text-xs font-bold tracking-wide text-sky-400 sm:text-sm">
          <Store className="size-3.5 sm:size-4" />
          BUILT FOR SHOPS OF EVERY SIZE
        </span>

        <h1 className="mt-5 text-2xl font-extrabold leading-[1.08] text-white sm:mt-6 sm:text-3xl lg:text-3xl xl:text-3xl 2xl:text-4xl">
          one platform.
          <br />
          total operational
          <br />
          control.
        </h1>

        <p className="mt-5 max-w-sm text-base text-slate-300 sm:mt-6 sm:max-w-md sm:text-lg lg:max-w-sm xl:max-w-md">
          Inventory, Purchasing, HR, Finance — enable only what your shop
          needs.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-3 sm:mt-8 sm:gap-y-4">
          {checklist.map((item) => (
            <div key={item} className="flex items-center gap-2 sm:gap-2.5">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-blue sm:size-6">
                <Check className="size-3 text-white sm:size-3.5" strokeWidth={3} />
              </span>
              <span className="text-sm text-slate-200 sm:text-base">{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-10">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-linear-to-b from-brand-blue-light to-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-[0_5px_0_#0d3fa8,0_14px_24px_rgba(24,98,233,0.45)] transition-transform active:translate-y-0.5 sm:px-8 sm:py-4 sm:text-base"
          >
            get started
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* ── Right: dashboard mockup — hidden on mobile, visible lg+ ── */}
      <div className="mt-14 hidden lg:block lg:mt-0">
        <DashboardMockup />
      </div>
    </section>
  );
}
