"use client";

import { useEffect, useState } from "react";
import { getSession, type AuthUser } from "@/lib/auth";
import { getRoleLabel } from "@/lib/rbac";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export function initials(user: AuthUser | null): string {
  if (!user) return "?";
  const f = user.firstName?.[0] ?? "";
  const l = user.lastName?.[0]  ?? "";
  return (f + l).toUpperCase() || user.email?.[0]?.toUpperCase() || "?";
}

export function fullName(user: AuthUser | null): string {
  if (!user) return "";
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return name || user.email || "User";
}

export function useSession() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getSession());
  }, []);

  return {
    user,
    initials:  initials(user),
    fullName:  fullName(user),
    roleLabel: getRoleLabel(user?.role ?? ""),
    greeting:  greeting(),
  };
}
