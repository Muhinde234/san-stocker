"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, getUserFromToken, normalizeTokens, roleToRoute, saveSession } from "@/lib/auth";

export function useGoogleAuth() {
  const router = useRouter();

  return useMutation({
    mutationFn: (idToken: string) => authService.googleSignIn(idToken),
    onSuccess: ({ data }) => {
      saveSession(data);
      const { accessToken } = normalizeTokens(data);
      const user = data.user ?? getUserFromToken(accessToken);
      router.push(roleToRoute(user?.role ?? ""));
    },
  });
}
