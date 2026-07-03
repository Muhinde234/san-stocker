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
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.66Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A11.99 11.99 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.27a12 12 0 0 0 0 10.74l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.43-3.43C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.63l4 3.1C6.22 6.86 8.87 4.75 12 4.75Z" />
    </svg>
  );
}

function getErrMsg(err: unknown): string {
  if (err instanceof AxiosError) {
    // Network / timeout — no response from server
    if (!err.response) {
      if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
        return "The server is taking too long to respond. It may be starting up — please wait a moment and try again.";
      }
      return "Unable to reach the server. Please check your connection and try again.";
    }
    return (err.response.data as { message?: string } | undefined)?.message ?? err.message;
  }
  return (err as Error)?.message ?? "Something went wrong.";
}

export function LoginForm() {
  const [identifier,   setIdentifier]   = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const login      = useLogin();
  const googleAuth = useGoogleAuth();

  const triggerGoogle = useGoogleLogin({
    flow: "implicit",
    scope: "openid email profile",
    onSuccess: (tokenRes) => {
      const idToken = (tokenRes as typeof tokenRes & { id_token?: string }).id_token;
      if (idToken) googleAuth.mutate(idToken);
    },
  });

  const isError  = login.isError || googleAuth.isError;
  const errorMsg = login.error ? getErrMsg(login.error) : googleAuth.error ? getErrMsg(googleAuth.error) : null;

  return (
    <div className="flex w-full max-w-sm flex-col items-center">
      <ProfileBust className="mb-4 size-20 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.06),0_10px_18px_rgba(24,98,233,0.18)] ring-4 ring-white" />

      <h1 className="text-4xl font-extrabold text-brand-navy">welcome</h1>
      <p className="mt-1 text-sm text-brand-muted">sign in to your account</p>

      <form
        onSubmit={(e) => { e.preventDefault(); login.mutate({ identifier, password }); }}
        className="mt-8 w-full space-y-5"
      >
        {/* Identifier */}
        <div className="space-y-1.5">
          <Label htmlFor="identifier" className="text-sm font-semibold text-brand-navy">
            phone number or email
          </Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-blue" />
            <Input
              id="identifier"
              name="identifier"
              type="text"
              required
              autoComplete="username"
              placeholder="enter your phone number or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="h-12 rounded-full pl-10 text-sm shadow-[inset_0_2px_4px_rgba(15,23,42,0.06)]"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-semibold text-brand-navy">
            password
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-blue" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-full pl-10 pr-10 text-sm shadow-[inset_0_2px_4px_rgba(15,23,42,0.06)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "hide password" : "show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-blue"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <a href="#" className="text-sm font-medium text-brand-blue hover:underline">
            forgot password?
          </a>
        </div>

        {/* Error */}
        {isError && (
          <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600 ring-1 ring-red-100">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
            <span>{errorMsg ?? "Invalid credentials. Please try again."}</span>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={login.isPending || googleAuth.isPending}
          className="relative h-12 w-full overflow-hidden rounded-full border-0 bg-linear-to-b from-brand-blue-light via-brand-blue to-[#0d4fc4] text-base font-semibold transition-transform active:translate-y-0.5 disabled:opacity-80"
          style={{ boxShadow: "0 5px 0 #0d3fa8, 0 12px 22px rgba(24,98,233,0.45)" }}
        >
          <span className="pointer-events-none absolute inset-x-2 top-1 h-4 rounded-full bg-white/30 blur-[3px]" />
          <span className="relative flex items-center justify-center gap-2">
            {login.isPending && <Loader2 className="size-4 animate-spin" />}
            {login.isPending ? "signing in…" : "login"}
          </span>
        </Button>
      </form>

      <div className="my-6 flex w-full items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-sm text-brand-muted">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        onClick={() => triggerGoogle()}
        disabled={login.isPending || googleAuth.isPending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-white text-sm font-medium text-brand-navy transition-colors hover:bg-slate-50 disabled:opacity-60"
      >
        {googleAuth.isPending
          ? <Loader2 className="size-4 animate-spin text-brand-blue" />
          : <GoogleIcon />
        }
        {googleAuth.isPending ? "connecting…" : "continue with google"}
      </button>
    </div>
  );
}
