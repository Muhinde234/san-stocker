"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  authService,
  getUserFromToken,
  normalizeTokens,
  normalizeRole,
  resolveLoginPayload,
  resolveRole,
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

      saveSession(data);

      const user = payload.user ?? getUserFromToken(accessToken);
      let role = normalizeRole(resolveRole(user));

      if (!role && accessToken) {
        try {
          const resp = await fetch("/proxy/api/v1/users/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
            signal: AbortSignal.timeout(5_000),
          });
          if (resp.ok) {
            const profile = (await resp.json()) as { role?: string; isSuperAdmin?: boolean; [k: string]: unknown };
            role = normalizeRole(resolveRole(profile));
            if (role) {
              const id = user?.id ?? String(profile.id ?? "");
              saveSession({ ...payload, user: { ...(user ?? {}), ...profile, id, role } });
            }
          }
        } catch {
          // profile endpoint unavailable — navigate without role
        }
      }

      router.push(role ? roleToRoute(role) : "/dashboard");
    },

    onError: () => {
      // error is surfaced via mutation.error
    },
  });
}
