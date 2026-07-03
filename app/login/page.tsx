import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { LoginForm } from "@/components/login-form";
import { LoginIllustration } from "@/components/login-illustration";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-linear-to-br from-[#0B1040] via-[#1E2B7A] to-[#c7d0f5] p-4 sm:p-8 lg:p-14">

      {/* Card */}
      <div className="grid h-[680px] w-full max-w-5xl grid-cols-1 overflow-hidden rounded-[2.5rem] bg-white shadow-[0_32px_80px_rgba(4,8,32,0.40)] lg:grid-cols-2">

        {/* Left — illustration */}
        <LoginIllustration />

        {/* Right — form */}
        <div className="relative flex flex-col overflow-hidden bg-white">
          {/* Subtle top-right corner glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[#e8eeff] blur-3xl opacity-70"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-12 -left-12 size-44 rounded-full bg-[#f0f4ff] blur-3xl opacity-60"
          />

          {/* Back button */}
          <div className="relative flex shrink-0 items-center px-8 pt-7">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-brand-navy shadow-[0_2px_0_#dde3f5,0_6px_12px_rgba(15,23,42,0.09)] transition-all hover:-translate-y-0.5 hover:text-brand-blue active:translate-y-0.5"
            >
              <ArrowLeft className="size-3.5 text-brand-blue" />
              Back
            </Link>
          </div>

          {/* Form centred in remaining space */}
          <div className="relative flex flex-1 items-center justify-center px-8 pb-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
