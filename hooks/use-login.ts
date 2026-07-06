"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  authService,
  decodeJwt,
  getUserFromToken,
  normalizeTokens,
  normalizeRole,
  resolveLoginPayload,
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
      const payload = resolveLoginPayload(data) ?? data;
      const { accessToken } = normalizeTokens(payload);

      console.log("[san-stocker] login response keys:", Object.keys(data));
      console.log("[san-stocker] accessToken (first 40):", accessToken.slice(0, 40) || "(empty — wrong field name)");
      console.log("[san-stocker] JWT claims:", decodeJwt(accessToken));

      saveSession(data);

      const user = payload.user ?? getUserFromToken(accessToken);
      let role = normalizeRole(user?.role ?? "");
      console.log("[san-stocker] JWT role:", role || "(empty — trying profile endpoint)");

      if (!role && accessToken) {
        try {
          const resp = await fetch("/proxy/api/v1/users/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
            signal: AbortSignal.timeout(5_000),
          });
          if (resp.ok) {
            const profile = (await resp.json()) as { role?: string; [k: string]: unknown };
            role = normalizeRole(profile?.role ?? "");
            if (role) {
              saveSession({ ...payload, user: { ...(user ?? {}), role, id: user?.id ?? "" } });
            }
          }
        } catch {
          // profile endpoint unavailable — navigate without role
        }
        console.log("[san-stocker] profile role:", role || "(still empty)");
      }

      router.push(role ? roleToRoute(role) : "/dashboard");
    },

    onError: () => {
      // error is surfaced via mutation.error
    },
  });
}
