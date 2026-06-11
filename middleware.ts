import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth-edge";

/**
 * Gate authenticated areas. Edge-side we only check cookie presence;
 * cryptographic verification happens server-side in layouts/actions.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!hasSession) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  } else if (pathname.startsWith("/dashboard") && !hasSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Let server layouts know the path (used to exempt /admin/login from the
  // role check without a redirect loop).
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
