"use client";

import React, { useState } from "react";
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

// ── Types ────────────────────────────────────────────────────────────────────

type FormState = {
  tenant: { name: string; email: string; phone: string; address: string };
  owner:  { firstName: string; lastName: string; email: string; phone: string; password: string };
};

const INITIAL: FormState = {
  tenant: { name: "", email: "", phone: "", address: "" },
  owner:  { firstName: "", lastName: "", email: "", phone: "", password: "" },
};

// ── Sub-components ───────────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
      {children}
      {required && <span className="ml-0.5 text-red-400">*</span>}
    </label>
  );
}

function Input({
  icon: Icon,
  rightSlot,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon?:      React.ComponentType<{ className?: string }>;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      )}
      <input
        {...props}
        className={[
          "h-11 w-full rounded-xl border border-[#E4E8F4] bg-[#F8FAFF] text-sm text-[#1a1d3b]",
          "placeholder:text-slate-400 outline-none transition-all",
          "focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20",
          Icon ? "pl-10 pr-4" : "px-4",
          rightSlot ? "pr-11" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      />
      {rightSlot && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

interface RegisterTenantModalProps {
  triggerLabel?:     React.ReactNode;
  triggerClassName?: string;
  adminMode?:        boolean;
  onSuccess?:        () => void;
}

export function RegisterTenantModal({
  triggerLabel     = "Register Business",
  triggerClassName = "inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/25",
  adminMode        = false,
  onSuccess,
}: RegisterTenantModalProps = {}) {
  const [open, setOpen]           = useState(false);
  const [form, setForm]           = useState<FormState>(INITIAL);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);
  const [showPw, setShowPw]       = useState(false);

  function setTenant(field: keyof FormState["tenant"], v: string) {
    setForm((p) => ({ ...p, tenant: { ...p.tenant, [field]: v } }));
  }
  function setOwner(field: keyof FormState["owner"], v: string) {
    setForm((p) => ({ ...p, owner: { ...p.owner, [field]: v } }));
  }

  function close() {
    setOpen(false);
    setTimeout(() => { setForm(INITIAL); setError(""); setSuccess(false); }, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/api/v1/auth/register-tenant", form);
      setSuccess(true);
      if (adminMode) onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className={triggerClassName}>
        {triggerLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#0B1848]/70 backdrop-blur-sm"
            onClick={close}
          />

          {/* Sheet */}
          <div className="relative flex w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-[0_32px_80px_rgba(11,24,72,0.35)]">

            {/* ── Left panel ──────────────────────────────── */}
            <div className="relative hidden w-64 shrink-0 flex-col justify-between overflow-hidden bg-[#0B1848] p-7 sm:flex">
              {/* Ambient glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-amber-400/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 size-40 rounded-full bg-[#4264FB]/20 blur-3xl" />

              <div className="relative z-10">
                {/* Logo mark */}
                <div className="mb-8 flex size-12 items-center justify-center rounded-2xl bg-amber-400 shadow-[0_8px_24px_rgba(251,191,36,0.45)]">
                  <ShieldCheck className="size-6 text-[#0B1848]" />
                </div>

                <p className="text-lg font-extrabold leading-snug text-white">
                  {adminMode ? "Register New Client" : "Start Your Free Trial"}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-white/55">
                  {adminMode
                    ? "Onboard a new business onto the SAN Stocker platform."
                    : "Get your business running in minutes — no credit card needed."}
                </p>

                {/* Feature bullets */}
                <ul className="mt-7 space-y-3">
                  {(adminMode
                    ? [
                        { icon: Zap,        text: "30-day TRIALING subscription created automatically" },
                        { icon: BadgeCheck,  text: "Owner account provisioned instantly" },
                        { icon: ShieldCheck, text: "Full platform access from day one" },
                      ]
                    : [
                        { icon: Zap,        text: "Free 30-day trial, no card required" },
                        { icon: BadgeCheck,  text: "Full access to all features" },
                        { icon: ShieldCheck, text: "Data encrypted & secure" },
                      ]
                  ).map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-400/15">
                        <Icon className="size-3 text-amber-400" />
                      </div>
                      <span className="text-[12px] leading-relaxed text-white/60">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom tag */}
              <div className="relative z-10 mt-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/25">
                  SAN TECH — Super Admin Portal
                </p>
              </div>
            </div>

            {/* ── Right panel (form) ───────────────────────── */}
            <div className="flex flex-1 flex-col min-w-0">

              {/* Header (mobile + desktop) */}
              <div className="flex items-center justify-between border-b border-[#E4E8F4] px-7 py-5">
                <div className="flex items-center gap-3 sm:hidden">
                  <div className="flex size-8 items-center justify-center rounded-xl bg-amber-400">
                    <ShieldCheck className="size-4 text-[#0B1848]" />
                  </div>
                  <p className="text-sm font-extrabold text-[#1a1d3b]">
                    {adminMode ? "Register New Client" : "Create Account"}
                  </p>
                </div>
                <p className="hidden text-sm font-extrabold text-[#1a1d3b] sm:block">
                  {adminMode ? "Client Details" : "Business & Owner Details"}
                </p>
                <button
                  onClick={close}
                  className="ml-auto flex size-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-[#1a1d3b]"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="max-h-[72vh] flex-1 overflow-y-auto px-7 py-6">

                {success ? (
                  <div className="flex flex-col items-center gap-5 py-10 text-center">
                    <div className="flex size-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60">
                      <CheckCircle2 className="size-10 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xl font-extrabold text-[#1a1d3b]">
                        {adminMode ? "Client Registered!" : "Account Created!"}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-400">
                        {adminMode
                          ? "The business has been onboarded with a TRIALING subscription. They can log in immediately."
                          : "Your business has been registered. Sign in to get started."}
                      </p>
                    </div>
                    {adminMode ? (
                      <button
                        onClick={close}
                        className="mt-1 rounded-2xl bg-amber-400 px-8 py-3 text-sm font-bold text-[#0B1848] shadow-[0_4px_0_#d97706] transition-all hover:-translate-y-0.5 active:translate-y-0"
                      >
                        Done
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        onClick={close}
                        className="mt-1 inline-block rounded-2xl bg-[#4264FB] px-8 py-3 text-sm font-bold text-white shadow-[0_4px_0_#2d52d8] transition-all hover:-translate-y-0.5 active:translate-y-0"
                      >
                        Go to Login
                      </Link>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">

                    {/* ── Section 1: Business ── */}
                    <section>
                      <div className="mb-4 flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-xl bg-[#EEF1FF]">
                          <Building2 className="size-4 text-[#4264FB]" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-[#1a1d3b]">Business Details</p>
                          <p className="text-[11px] text-slate-400">Info about the business being registered</p>
                        </div>
                      </div>

                      <div className="space-y-3.5">
                        <div>
                          <Label required>Business Name</Label>
                          <Input
                            icon={Building2}
                            value={form.tenant.name}
                            onChange={(e) => setTenant("name", e.target.value)}
                            placeholder="e.g. Kigali Fresh Mart"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                          <div>
                            <Label required>Business Email</Label>
                            <Input
                              icon={Mail}
                              type="email"
                              value={form.tenant.email}
                              onChange={(e) => setTenant("email", e.target.value)}
                              placeholder="info@business.com"
                              required
                            />
                          </div>
                          <div>
                            <Label required>Business Phone</Label>
                            <Input
                              icon={Phone}
                              type="tel"
                              value={form.tenant.phone}
                              onChange={(e) => setTenant("phone", e.target.value)}
                              placeholder="0788 123 456"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Address</Label>
                          <Input
                            icon={MapPin}
                            value={form.tenant.address}
                            onChange={(e) => setTenant("address", e.target.value)}
                            placeholder="Street, City"
                          />
                        </div>
                      </div>
                    </section>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-[#E4E8F4]" />
                      <span className="rounded-full bg-[#F0F4FF] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#4264FB]">
                        Owner Account
                      </span>
                      <div className="h-px flex-1 bg-[#E4E8F4]" />
                    </div>

                    {/* ── Section 2: Owner ── */}
                    <section>
                      <div className="mb-4 flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-xl bg-[#EEF1FF]">
                          <User className="size-4 text-[#4264FB]" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-[#1a1d3b]">Owner Account</p>
                          <p className="text-[11px] text-slate-400">Primary administrator of this business</p>
                        </div>
                      </div>

                      <div className="space-y-3.5">
                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                          <div>
                            <Label required>First Name</Label>
                            <Input
                              value={form.owner.firstName}
                              onChange={(e) => setOwner("firstName", e.target.value)}
                              placeholder="Jean"
                              required
                            />
                          </div>
                          <div>
                            <Label required>Last Name</Label>
                            <Input
                              value={form.owner.lastName}
                              onChange={(e) => setOwner("lastName", e.target.value)}
                              placeholder="Mugisha"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                          <div>
                            <Label required>Owner Email</Label>
                            <Input
                              icon={Mail}
                              type="email"
                              value={form.owner.email}
                              onChange={(e) => setOwner("email", e.target.value)}
                              placeholder="owner@business.com"
                              required
                            />
                          </div>
                          <div>
                            <Label required>Owner Phone</Label>
                            <Input
                              icon={Phone}
                              type="tel"
                              value={form.owner.phone}
                              onChange={(e) => setOwner("phone", e.target.value)}
                              placeholder="0788 654 321"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label required>Password</Label>
                          <Input
                            type={showPw ? "text" : "password"}
                            value={form.owner.password}
                            onChange={(e) => setOwner("password", e.target.value)}
                            placeholder="Min. 8 chars — uppercase, number & symbol"
                            required
                            rightSlot={
                              <button
                                type="button"
                                onClick={() => setShowPw((p) => !p)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                              </button>
                            }
                          />
                        </div>
                      </div>
                    </section>

                    {/* Error */}
                    {error && (
                      <div className="flex items-start gap-3 rounded-xl bg-red-50 px-4 py-3 ring-1 ring-red-100">
                        <X className="mt-0.5 size-4 shrink-0 text-red-400" />
                        <p className="text-xs font-medium text-red-600">{error}</p>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={[
                        "relative w-full overflow-hidden rounded-2xl py-3.5 text-sm font-bold transition-all",
                        "disabled:cursor-not-allowed disabled:opacity-70",
                        adminMode
                          ? "bg-amber-400 text-[#0B1848] shadow-[0_4px_0_#d97706] hover:-translate-y-0.5 active:translate-y-0"
                          : "bg-[#4264FB] text-white shadow-[0_4px_0_#2d52d8] hover:-translate-y-0.5 active:translate-y-0",
                      ].join(" ")}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="size-4 animate-spin" />
                          {adminMode ? "Registering client…" : "Creating account…"}
                        </span>
                      ) : (
                        adminMode ? "Register Client" : "Create My Account"
                      )}
                    </button>

                    {!adminMode && (
                      <p className="text-center text-xs text-slate-400">
                        Already have an account?{" "}
                        <Link href="/login" onClick={close} className="font-semibold text-[#4264FB] hover:underline">
                          Sign in
                        </Link>
                      </p>
                    )}

                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
