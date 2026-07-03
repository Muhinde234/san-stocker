"use client";

import { useEffect, useState } from "react";
import { getSession, type AuthUser } from "@/lib/auth";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN:       "Super Administrator",
  SAN_TECH:          "SAN TECH Admin",
  SYSTEM_ADMIN:      "System Administrator",
  OWNER:             "Owner / Director",
  DIRECTOR:          "Director",
  STORE_MANAGER:     "Store Manager",
  BRANCH_MANAGER:    "Branch Manager",
  CASHIER:           "Cashier",
  INVENTORY_MANAGER: "Inventory Manager",
  PROCUREMENT:       "Procurement Officer",
  WAREHOUSE:         "Warehouse Officer",
  ACCOUNTANT:        "Accountant",
  HR:                "HR Officer",
  MARKETING:         "Marketing Officer",
  AUDITOR:           "Auditor",
  CUSTOMER_SERVICE:  "Customer Service",
  DELIVERY:          "Delivery Officer",
};

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

export function roleLabel(role: string): string {
  return ROLE_LABELS[role?.toUpperCase()] ?? role ?? "User";
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
    roleLabel: roleLabel(user?.role ?? ""),
    greeting:  greeting(),
  };
}
