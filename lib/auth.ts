import { http } from "./axios";

// ── types ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role: string;
  tenantId?: string | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user?: AuthUser; // may not be returned by the API — we decode the JWT instead
}

// ── JWT decoder (no library needed) ──────────────────────────────────────────
export function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getUserFromToken(token: string): AuthUser | null {
  const claims = decodeJwt(token);
  if (!claims) return null;

  // common JWT claim shapes — adjust keys to match whatever the API puts in
  return {
    id:        String(claims.sub ?? claims.id ?? claims.userId ?? ""),
    role:      String(claims.role ?? claims.roles ?? claims.authority ?? ""),
    firstName: String(claims.firstName ?? claims.given_name ?? ""),
    lastName:  String(claims.lastName  ?? claims.family_name ?? ""),
    email:     String(claims.email     ?? ""),
    phone:     String(claims.phone     ?? ""),
    tenantId:  (claims.tenantId ?? claims.tenant_id ?? null) as string | null,
  };
}

// ── API calls ─────────────────────────────────────────────────────────────────
export const authService = {
  login: (identifier: string, password: string) =>
    http.post<LoginResponse>("/api/v1/auth/login", { identifier, password }),

  logout: () =>
    http.post("/api/v1/auth/logout").catch(() => {}),
};

// ── role → initial route ──────────────────────────────────────────────────────
const ROLE_ROUTES: Record<string, string> = {
  SUPER_ADMIN:       "/super-admin",
  SAN_TECH:          "/super-admin",
  SYSTEM_ADMIN:      "/dashboard",
  OWNER:             "/dashboard",
  DIRECTOR:          "/dashboard",
  STORE_MANAGER:     "/dashboard",
  BRANCH_MANAGER:    "/dashboard",
  CASHIER:           "/dashboard/pos",
  INVENTORY_MANAGER: "/dashboard/inventory",
  PROCUREMENT:       "/dashboard/purchasing",
  WAREHOUSE:         "/dashboard/warehouse",
  ACCOUNTANT:        "/dashboard/finance",
  HR:                "/dashboard/hr",
  AUDITOR:           "/dashboard/reports",
};

export function roleToRoute(role: string): string {
  return ROLE_ROUTES[role?.toUpperCase()] ?? "/dashboard";
}

// ── session helpers ───────────────────────────────────────────────────────────
const isBrowser = typeof window !== "undefined";

export function saveSession(data: LoginResponse) {
  if (!isBrowser) return;
  localStorage.setItem("san_access_token",  data.accessToken);
  localStorage.setItem("san_refresh_token", data.refreshToken);

  // prefer explicit user from response; fall back to decoding the JWT
  const user = data.user ?? getUserFromToken(data.accessToken);
  if (user) localStorage.setItem("san_user", JSON.stringify(user));
}

export function getSession(): AuthUser | null {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem("san_user");
    if (raw) return JSON.parse(raw) as AuthUser;
    // last resort: decode the live token
    const token = localStorage.getItem("san_access_token");
    return token ? getUserFromToken(token) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (!isBrowser) return;
  localStorage.removeItem("san_access_token");
  localStorage.removeItem("san_refresh_token");
  localStorage.removeItem("san_user");
}
