import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { LoginForm } from "@/components/login-form";
import { LoginIllustration } from "@/components/login-illustration";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-linear-to-br from-[#1E2048] via-[#2d3580] to-white p-6 sm:p-10 lg:p-16">
      <div className="grid h-full w-full max-w-6xl grid-cols-1 overflow-hidden rounded-[2.5rem] bg-white shadow-2xl lg:grid-cols-2">
        <LoginIllustration />
        <div className="relative flex items-center justify-center px-6 py-10 sm:px-12">
          <Link
            href="/"
            className="absolute left-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-navy shadow-[0_3px_0_#d6dceb,0_8px_14px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all hover:-translate-y-0.5 hover:text-brand-blue active:translate-y-0.5 active:shadow-[0_1px_0_#d6dceb,0_3px_6px_rgba(15,23,42,0.12)] sm:left-10 sm:top-8"
          >
            <ArrowLeft className="size-4 text-brand-blue" />
            back to home
          </Link>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
