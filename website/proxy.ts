import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("harbor_token")?.value;
  const { pathname } = request.nextUrl;

  // Define public paths that don't require authentication
  const isPublicPath = pathname === "/login";

  // 1. If the user is logged in and trying to access the login page, 
  // redirect them to the home page (dashboard).
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. If the user is NOT logged in and trying to access any protected page,
  // redirect them to the login page.
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// The matcher allows you to filter which routes this middleware runs on.
// We exclude API routes, static files, and internal Next.js paths.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
