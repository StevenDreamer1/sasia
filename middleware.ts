import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // 1. Get the "role" cookie (Simulating auth)
  // In a real app, this would be a secure session token
  const role = request.cookies.get("user_role")?.value;

  // 2. PROTECT ADMIN ROUTES
  // If trying to access /admin...
  if (path.startsWith("/admin")) {
    // ...but not logged in as admin? KICK THEM OUT.
    if (path !== "/admin/login" && role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // 3. PROTECT USER ROUTES
  // If trying to access /chat or /services but not logged in?
  if ((path.startsWith("/chat") || path.startsWith("/services")) && !role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Configure which paths this middleware runs on
export const config = {
  matcher: ["/admin/:path*", "/chat/:path*", "/services/:path*"],
};