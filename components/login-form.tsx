"use client";

import { useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import { AxiosError } from "axios";
import { useGoogleLogin } from "@react-oauth/google";

import { ProfileBust } from "@/components/login-illustration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/use-login";
import { useGoogleAuth } from "@/hooks/use-google-auth";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden>
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.66Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A11.99 11.99 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.27a12 12 0 0 0 0 10.74l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.43-3.43C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.63l4 3.1C6.22 6.86 8.87 4.75 12 4.75Z" />
    </svg>
  );
}

function getErrMsg(err: unknown): string {
  if (err instanceof AxiosError) {
    return (
      (err.response?.data as { message?: string } | undefined)?.message ??
      err.message
    );
  }
  return (err as Error)?.message ?? "Something went wrong.";
}

export function LoginForm() {
  const [identifier,   setIdentifier]   = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const login      = useLogin();
  const googleAuth = useGoogleAuth();

  // implicit flow — when 'openid' is in scope the response includes id_token (per the GIS spec)
  const triggerGoogle = useGoogleLogin({
    flow: "implicit",
    scope: "openid email profile",
    onSuccess: (tokenRes) => {
      const idToken = (tokenRes as typeof tokenRes & { id_token?: string }).id_token;
      if (idToken) {
        googleAuth.mutate(idToken);
      }
    },
  });

  const isError    = login.isError    || googleAuth.isError;
  const isPending  = login.isPending  || googleAuth.isPending;
  const errorMsg   = login.error ? getErrMsg(login.error) : googleAuth.error ? getErrMsg(googleAuth.error) : null;

  return (
    <div className="flex w-full max-w-sm flex-col items-center">

      {/* Avatar + heading */}
      <ProfileBust className="mb-5 size-[72px] rounded-full shadow-[0_4px_0_rgba(0,0,0,0.06),0_10px_18px_rgba(24,98,233,0.18)] ring-4 ring-white" />
      <h1 className="text-[2rem] font-extrabold leading-none tracking-tight text-brand-navy">
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-brand-muted">
        Sign in to your SAN Stocker account
      </p>

      <form onSubmit={(e) => { e.preventDefault(); login.mutate({ identifier, password }); }} className="mt-8 w-full space-y-4">

        {/* Identifier */}
        <div className="space-y-1.5">
          <Label htmlFor="identifier" className="text-[11px] font-bold uppercase tracking-widest text-brand-navy/60">
            Phone or Email
          </Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-blue/60" />
            <Input
              id="identifier"
              name="identifier"
              type="text"
              required
              autoComplete="username"
              placeholder="Enter your phone or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="h-12 rounded-full border-[#dde3f5] bg-[#f5f7ff] pl-11 text-sm text-brand-navy placeholder:text-slate-400 focus-visible:border-brand-blue focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-brand-blue/15"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-widest text-brand-navy/60">
              Password
            </Label>
            <a href="#" className="text-xs font-semibold text-brand-blue hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-blue/60" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-full border-[#dde3f5] bg-[#f5f7ff] pl-11 pr-12 text-sm text-brand-navy placeholder:text-slate-400 focus-visible:border-brand-blue focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-brand-blue/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-blue/50 transition-colors hover:text-brand-blue"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Inline error */}
        {isError && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-red-50 px-4 py-3 text-xs text-red-600 ring-1 ring-red-100">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
            <span>{errorMsg ?? "Invalid credentials. Please try again."}</span>
          </div>
        )}

        {/* Primary CTA */}
        <Button
          type="submit"
          disabled={isPending}
          className="relative h-12 w-full overflow-hidden rounded-full border-0 bg-linear-to-b from-brand-blue-light via-brand-blue to-[#0d4fc4] text-base font-semibold tracking-wide text-white transition-transform active:translate-y-0.5 disabled:opacity-75"
          style={{ boxShadow: "0 5px 0 #0d3fa8, 0 12px 22px rgba(24,98,233,0.42)" }}
        >
          {/* Glass sheen */}
          <span className="pointer-events-none absolute inset-x-3 top-1 h-[18px] rounded-full bg-white/28 blur-[3px]" />
          <span className="relative flex items-center justify-center gap-2">
            {login.isPending && <Loader2 className="size-4 animate-spin" />}
            {login.isPending ? "Signing in…" : "Sign in"}
          </span>
        </Button>
      </form>

      {/* Divider */}
      <div className="my-6 flex w-full items-center gap-3">
        <span className="h-px flex-1 bg-[#e4eaf6]" />
        <span className="text-xs font-semibold text-brand-muted/80">or</span>
        <span className="h-px flex-1 bg-[#e4eaf6]" />
      </div>

      {/* Google sign-in — custom button, full design control */}
      <button
        type="button"
        onClick={() => triggerGoogle()}
        disabled={isPending}
        className="group relative flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-[#dde3f5] bg-white text-sm font-semibold text-brand-navy transition-all hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-60"
        style={{
          boxShadow: "0 3px 0 #dde3f5, 0 8px 16px rgba(15,23,42,0.07)",
        }}
      >
        {/* Hover sheen */}
        <span className="pointer-events-none absolute inset-0 rounded-full bg-[#f5f7ff] opacity-0 transition-opacity group-hover:opacity-100" />
        <span className="relative flex items-center gap-3">
          {googleAuth.isPending
            ? <Loader2 className="size-4 animate-spin text-brand-blue" />
            : <GoogleIcon />
          }
          {googleAuth.isPending ? "Connecting to Google…" : "Continue with Google"}
        </span>
      </button>
    </div>
  );
}
