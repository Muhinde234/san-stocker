import { http } from "./axios";
import { getRoleLabel, getRoleRoute, isSuperAdmin, normalizeRole, ROLE_LABELS, ROLE_ROUTES } from "./rbac";

export type { PermissionLevel, Role, Module } from "./rbac";
export { MODULE, ROLE, PERMISSION, canAccessModule, getPermissionLevel } from "./rbac";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role: string;
  tenantId?: string | null;
}

// Backend may return camelCase OR OAuth2 snake_case field names
export interface LoginResponse {
  // camelCase
  accessToken?:  string;
  refreshToken?: string;
  // OAuth2 standard snake_case
  access_token?:  string;
  refresh_token?: string;
  // Other common patterns
  token?: string;
  user?: AuthUser;
}

export function resolveLoginPayload(data: LoginResponse): LoginResponse | null {
  const seen = new Set<unknown>();

  const visit = (value: unknown): LoginResponse | null => {
    if (!value || typeof value !== "object" || seen.has(value)) return null;
    seen.add(value);

    const record = value as Record<string, unknown>;
    const directToken = record.accessToken ?? record.access_token ?? record.token;
    const directRefresh = record.refreshToken ?? record.refresh_token;
    const hasUser = Boolean(record.user);

    if (directToken || directRefresh || hasUser) {
      return record as LoginResponse;
    }

    for (const key of ["data", "result", "payload", "body"]) {
      const nested = visit(record[key]);
      if (nested) return nested;
    }

    return null;
  };

  return visit(data);
}

// Normalise token fields to a consistent shape
export function normalizeTokens(data: LoginResponse): { accessToken: string; refreshToken: string } {
  const payload = resolveLoginPayload(data) ?? data;

  return {
    accessToken:  payload.accessToken  ?? payload.access_token  ?? payload.token ?? "",
    refreshToken: payload.refreshToken ?? payload.refresh_token ?? "",
  };
}

// ── JWT decoder (no library) ──────────────────────────────────────────────────
export function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    // atob requires length % 4 === 0 — add padding if needed
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function stripRole(raw: string): string {
  return normalizeRole(raw);
}

function extractRoleFromClaims(claims: Record<string, unknown>): string {
  // ── 1. Simple string claims ──────────────────────────────────────
  for (const key of ["role", "roles", "userRole", "user_role", "roleName"]) {
    const v = claims[key];
    if (typeof v === "string" && v) return stripRole(v);
    if (Array.isArray(v) && v.length > 0) return stripRole(String(v[0]));
  }

  // ── 2. Spring Security authorities / authority ────────────────────
  // Formats: [{ authority: "ROLE_OWNER" }]  |  ["ROLE_OWNER"]  |  "ROLE_OWNER"
  const auths = claims.authorities ?? claims.authority;
  if (Array.isArray(auths) && auths.length > 0) {
    const first = auths[0];
    const raw = typeof first === "object" && first !== null
      ? String((first as { authority?: string }).authority ?? "")
      : String(first);
    if (raw) return stripRole(raw);
  }
  if (typeof auths === "string" && auths) return stripRole(auths);

  // ── 3. OAuth2 scope string: "ROLE_OWNER read write" ──────────────
  const scope = claims.scope ?? claims.scp;
  if (typeof scope === "string") {
    const roleToken = scope.split(/\s+/).find((t) => /^ROLE_/i.test(t));
    if (roleToken) return stripRole(roleToken);
  }

  return "";
}

export function getUserFromToken(token: string): AuthUser | null {
  const claims = decodeJwt(token);
  if (!claims) return null;
  return {
    id:        String(claims.sub ?? claims.id ?? claims.userId ?? ""),
    role:      extractRoleFromClaims(claims),
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

  logout: (refreshToken: string) =>
    http.post("/api/v1/auth/logout", { refreshToken, refresh_token: refreshToken }).catch(() => {}),

  googleSignIn: (idToken: string) =>
    http.post<LoginResponse>("/api/v1/auth/google", { idToken }),

  // Fetch the authenticated user's profile — tried as fallback when JWT extraction fails
  profile: () => http.get<AuthUser>("/api/v1/users/me").catch(
    () => http.get<AuthUser>("/api/v1/auth/me")
  ),
};

// ── Role helpers (delegated to rbac.ts) ──────────────────────────────────────
export { getRoleLabel, getRoleRoute, isSuperAdmin, normalizeRole, ROLE_LABELS, ROLE_ROUTES };

export function roleToRoute(role: string): string {
  return getRoleRoute(role);
}

// ── Session helpers ───────────────────────────────────────────────────────────
const isBrowser = typeof window !== "undefined";

// Cookie helpers — read by proxy.ts for server-side route protection
const COOKIE_MAX_AGE = `max-age=${60 * 60 * 24 * 7}`;

function setAuthCookie() {
  document.cookie = `san_auth=1;path=/;${COOKIE_MAX_AGE};SameSite=Lax`;
}
function clearAuthCookie() {
  document.cookie = "san_auth=;path=/;max-age=0";
}
function setRoleCookie(role: string) {
  document.cookie = `san_role=${role};path=/;${COOKIE_MAX_AGE};SameSite=Lax`;
}
function clearRoleCookie() {
  document.cookie = "san_role=;path=/;max-age=0";
}

export function saveSession(data: LoginResponse) {
  if (!isBrowser) return;
  const payload = resolveLoginPayload(data) ?? data;
  const { accessToken, refreshToken } = normalizeTokens(payload);

  localStorage.setItem("san_access_token",  accessToken);
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("san_refresh_token", refreshToken);

  // san_auth signals "logged in" to proxy.ts — set unconditionally
  setAuthCookie();

  const user = payload.user ?? getUserFromToken(accessToken);
  if (user) {
    localStorage.setItem("san_user", JSON.stringify(user));
    if (user.role) setRoleCookie(normalizeRole(user.role));
  }
}

export function getSession(): AuthUser | null {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem("san_user");
    if (raw) return JSON.parse(raw) as AuthUser;
    const token = localStorage.getItem("san_access_token") ?? localStorage.getItem("accessToken");
    return token ? getUserFromToken(token) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (!isBrowser) return;
  localStorage.removeItem("san_access_token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("san_refresh_token");
  localStorage.removeItem("san_user");
  clearAuthCookie();
  clearRoleCookie();
}
