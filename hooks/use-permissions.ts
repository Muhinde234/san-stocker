"use client";

import { useMemo } from "react";
import {
  canAccessModule,
  getPermissionLevel,
  isSuperAdmin,
  type Module,
  type PermissionLevel,
} from "@/lib/rbac";
import { useSession } from "./use-session";

export interface Permissions {
  role:            string;
  level:           PermissionLevel;
  isSuperAdmin:    boolean;
  canAccess:       (module: Module) => boolean;
  hasAnyModule:    (modules: Module[]) => boolean;
}

export function usePermissions(): Permissions {
  const { user } = useSession();
  const role = user?.role ?? "";

  return useMemo<Permissions>(() => ({
    role,
    level:         getPermissionLevel(role),
    isSuperAdmin:  isSuperAdmin(role),
    canAccess:     (module) => canAccessModule(role, module),
    hasAnyModule:  (modules) => modules.some((m) => canAccessModule(role, m)),
  }), [role]);
}
