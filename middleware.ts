import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // 1. Protect Admin Routes
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Requires the user to be logged in
    },
  }
);

export const config = { matcher: ["/dashboard/:path*", "/admin/:path*"] };