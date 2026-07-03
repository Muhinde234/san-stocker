import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPER_ADMIN_ROLES = ["SUPER_ADMIN", "SAN_TECH"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // san_auth=1 is set unconditionally by saveSession() — use it for auth gate
  const isAuthed = request.cookies.get("san_auth")?.value === "1";

  // san_role may be empty if JWT role claim extraction failed — only use when truthy
  const role = request.cookies.get("san_role")?.value?.toUpperCase() ?? "";

  const onDashboard  = pathname.startsWith("/dashboard");
  const onSuperAdmin = pathname.startsWith("/super-admin");

  // Not authenticated — send to login
  if (!isAuthed) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Super admin must stay in /super-admin (only enforce when role is known)
  if (onDashboard && role && SUPER_ADMIN_ROLES.includes(role)) {
    return NextResponse.redirect(new URL("/super-admin", request.url));
  }

  // Regular users cannot enter /super-admin (only enforce when role is known)
  if (onSuperAdmin && role && !SUPER_ADMIN_ROLES.includes(role)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/super-admin/:path*"],
};
