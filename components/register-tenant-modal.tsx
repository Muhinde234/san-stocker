"use client";

import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  MapPin,
  Phone,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

type FormState = {
  tenant: { name: string; email: string; phone: string; address: string };
  owner: { firstName: string; lastName: string; email: string; phone: string; password: string };
};

const INITIAL: FormState = {
  tenant: { name: "", email: "", phone: "", address: "" },
  owner:  { firstName: "", lastName: "", email: "", phone: "", password: "" },
};

function Field({
  label, type = "text", value, onChange, placeholder, icon: Icon, required = true,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#1a1d3b]">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
        )}
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-[#E4E8F4] bg-[#F8F9FF] py-2.5 text-sm text-[#1a1d3b] placeholder:text-slate-400 outline-none transition-all focus:border-[#4264FB]/50 focus:ring-2 focus:ring-[#4264FB]/12 ${Icon ? "pl-9 pr-4" : "px-4"}`}
        />
      </div>
    </div>
  );
}

interface RegisterTenantModalProps {
  triggerLabel?:     string;
  triggerClassName?: string;
}

export function RegisterTenantModal({
  triggerLabel     = "Register Business",
  triggerClassName = "inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/25",
}: RegisterTenantModalProps = {}) {
  const [open, setOpen]               = useState(false);
  const [form, setForm]               = useState<FormState>(INITIAL);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function setTenant(field: keyof FormState["tenant"], value: string) {
    setForm((prev) => ({ ...prev, tenant: { ...prev.tenant, [field]: value } }));
  }
  function setOwner(field: keyof FormState["owner"], value: string) {
    setForm((prev) => ({ ...prev, owner: { ...prev.owner, [field]: value } }));
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Trigger button */}
      <button onClick={() => setOpen(true)} className={triggerClassName}>
        {triggerLabel}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#1E2048]/60 backdrop-blur-sm"
            onClick={close}
          />

          {/* Card */}
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Header */}
            <div className="bg-linear-to-br from-[#1E2048] via-[#2d3580] to-white px-8 py-6">
              <button
                onClick={close}
                className="absolute right-5 top-5 flex size-8 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
              >
                <X className="size-4" />
              </button>
              <p className="text-xl font-extrabold text-white">Start Your Free Trial</p>
              <p className="mt-1 text-sm text-white/70">
                Set up your business account in minutes — no credit card required.
              </p>
            </div>

            {/* Body */}
            <div className="max-h-[65vh] overflow-y-auto px-8 py-6">
              {success ? (
                /* ── Success state ── */
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-emerald-50">
                    <CheckCircle2 className="size-8 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-[#1a1d3b]">Account Created!</p>
                    <p className="mt-1.5 text-sm text-slate-400">
                      Your business has been registered. Sign in to get started.
                    </p>
                  </div>
                  <Link
                    href="/login"
                    onClick={close}
                    className="mt-2 inline-flex items-center gap-2 rounded-full bg-linear-to-b from-[#6B8BFF] to-[#4264FB] px-8 py-3 text-sm font-semibold text-white shadow-[0_5px_0_#2d52d8,0_12px_20px_rgba(66,100,251,0.35)] transition-transform active:translate-y-0.5"
                  >
                    Go to Login
                  </Link>
                </div>
              ) : (
                /* ── Form ── */
                <form onSubmit={handleSubmit} className="space-y-7">

                  {/* Section 1 — Business */}
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-[#EEF1FF]">
                        <Building2 className="size-3.5 text-[#4264FB]" />
                      </div>
                      <p className="text-sm font-bold text-[#1a1d3b]">Business Details</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Field
                          label="Business Name"
                          value={form.tenant.name}
                          onChange={(v) => setTenant("name", v)}
                          placeholder="e.g. Kigali Fresh Mart"
                          icon={Building2}
                        />
                      </div>
                      <Field
                        label="Business Email"
                        type="email"
                        value={form.tenant.email}
                        onChange={(v) => setTenant("email", v)}
                        placeholder="info@yourbusiness.com"
                      />
                      <Field
                        label="Business Phone"
                        type="tel"
                        value={form.tenant.phone}
                        onChange={(v) => setTenant("phone", v)}
                        placeholder="0788 123 456"
                        icon={Phone}
                      />
                      <div className="sm:col-span-2">
                        <Field
                          label="Address"
                          value={form.tenant.address}
                          onChange={(v) => setTenant("address", v)}
                          placeholder="Street, City"
                          icon={MapPin}
                          required={false}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#E4E8F4]" />

                  {/* Section 2 — Owner */}
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-[#EEF1FF]">
                        <User className="size-3.5 text-[#4264FB]" />
                      </div>
                      <p className="text-sm font-bold text-[#1a1d3b]">Owner Account</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field
                        label="First Name"
                        value={form.owner.firstName}
                        onChange={(v) => setOwner("firstName", v)}
                        placeholder="Jean"
                      />
                      <Field
                        label="Last Name"
                        value={form.owner.lastName}
                        onChange={(v) => setOwner("lastName", v)}
                        placeholder="Mugisha"
                      />
                      <Field
                        label="Owner Email"
                        type="email"
                        value={form.owner.email}
                        onChange={(v) => setOwner("email", v)}
                        placeholder="owner@yourbusiness.com"
                      />
                      <Field
                        label="Owner Phone"
                        type="tel"
                        value={form.owner.phone}
                        onChange={(v) => setOwner("phone", v)}
                        placeholder="0788 654 321"
                        icon={Phone}
                      />
                      {/* Password */}
                      <div className="sm:col-span-2">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-[#1a1d3b]">
                            Password<span className="ml-0.5 text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              required
                              value={form.owner.password}
                              onChange={(e) => setOwner("password", e.target.value)}
                              placeholder="Min. 8 chars, uppercase, number & symbol"
                              className="w-full rounded-xl border border-[#E4E8F4] bg-[#F8F9FF] px-4 py-2.5 pr-11 text-sm text-[#1a1d3b] placeholder:text-slate-400 outline-none transition-all focus:border-[#4264FB]/50 focus:ring-2 focus:ring-[#4264FB]/12"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((p) => !p)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600 ring-1 ring-red-100">
                      {error}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full overflow-hidden rounded-2xl bg-linear-to-b from-[#6B8BFF] to-[#4264FB] py-3.5 text-sm font-bold text-white shadow-[0_5px_0_#2d52d8,0_12px_20px_rgba(66,100,251,0.35)] transition-all active:translate-y-0.5 active:shadow-[0_2px_0_#2d52d8] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span className="pointer-events-none absolute inset-x-4 top-1 h-3 rounded-full bg-white/25 blur-[3px]" />
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        Creating account…
                      </span>
                    ) : (
                      "Create My Account"
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    Already have an account?{" "}
                    <Link href="/login" onClick={close} className="font-semibold text-[#4264FB] hover:underline">
                      Sign in
                    </Link>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
