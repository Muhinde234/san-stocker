"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import { authService, getUserFromToken, roleToRoute, saveSession } from "@/lib/auth";

interface LoginVars {
  identifier: string;
  password: string;
}

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ identifier, password }: LoginVars) =>
      authService.login(identifier, password),

    onSuccess: ({ data }) => {
      saveSession(data);

      // user may come from the response body OR decoded from the JWT
      const user = data.user ?? getUserFromToken(data.accessToken);
      const role = user?.role ?? "";

      router.push(roleToRoute(role));
    },

    onError: (error: AxiosError<{ message?: string }>) => {
      console.error("[login]", error.response?.data ?? error.message);
    },
  });
}
