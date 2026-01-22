import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect admin routes only
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  const userId = req.cookies.get("userId")?.value

  // Not logged in → login
  if (!userId) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  // Logged in → allow (role check happens later)
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
