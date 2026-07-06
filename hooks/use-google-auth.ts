"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, getUserFromToken, normalizeRole, normalizeTokens, resolveLoginPayload, roleToRoute, saveSession } from "@/lib/auth";

export function useGoogleAuth() {
  const router = useRouter();

  return useMutation({
    mutationFn: (idToken: string) => authService.googleSignIn(idToken),
    onSuccess: ({ data }) => {
      const payload = resolveLoginPayload(data) ?? data;
      saveSession(data);
      const { accessToken } = normalizeTokens(payload);
      const user = payload.user ?? getUserFromToken(accessToken);
      const role = normalizeRole(user?.role ?? "");
      router.push(role ? roleToRoute(role) : "/dashboard");
    },
  });
}
