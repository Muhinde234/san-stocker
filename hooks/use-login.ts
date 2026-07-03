"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import {
  authService,
  decodeJwt,
  getUserFromToken,
  normalizeTokens,
  roleToRoute,
  saveSession,
} from "@/lib/auth";

interface LoginVars {
  identifier: string;
  password: string;
}

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ identifier, password }: LoginVars) =>
      authService.login(identifier, password),

    onSuccess: async ({ data }) => {
      const { accessToken } = normalizeTokens(data);

      console.log("[san-stocker] login response keys:", Object.keys(data));
      console.log("[san-stocker] accessToken (first 40):", accessToken.slice(0, 40) || "(empty — wrong field name)");
      console.log("[san-stocker] JWT claims:", decodeJwt(accessToken));

      saveSession(data);

      let user = data.user ?? getUserFromToken(accessToken);
      let role = user?.role ?? "";
      console.log("[san-stocker] JWT role:", role || "(empty — trying profile endpoint)");

      // If JWT has no role claim, fetch profile with native fetch (no axios interceptors)
      // so a 401/404 from a missing endpoint never triggers the refresh→redirect loop
      if (!role && accessToken) {
        try {
          const resp = await fetch("/proxy/api/v1/users/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
            signal: AbortSignal.timeout(5_000),
          });
          if (resp.ok) {
            const profile = (await resp.json()) as { role?: string; [k: string]: unknown };
            role = profile?.role ?? "";
            if (role) {
              saveSession({ ...data, user: { ...(user ?? {}), role, id: user?.id ?? "" } });
            }
          }
        } catch {
          // profile endpoint unavailable — navigate without role
        }
        console.log("[san-stocker] profile role:", role || "(still empty)");
      }

      router.push(roleToRoute(role));
    },

    onError: (_error: AxiosError<{ message?: string }>) => {
      // error is surfaced via mutation.error
    },
  });
}
