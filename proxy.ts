import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const privateRoutePrefixes = ["/notes", "/profile"];
const authRoutePrefixes = ["/sign-in", "/sign-up"];

const matchesRoute = (pathname: string, prefixes: string[]) =>
  prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const hasAccessToken = Boolean(accessToken);
  const hasRefreshToken = Boolean(refreshToken);

  // If no tokens at all, check if private route
  if (
    !hasAccessToken &&
    !hasRefreshToken &&
    matchesRoute(pathname, privateRoutePrefixes)
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // If has access token and trying to access auth route
  if (hasAccessToken && matchesRoute(pathname, authRoutePrefixes)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If has refresh token but no access token, try to refresh session
  if (
    !hasAccessToken &&
    hasRefreshToken &&
    matchesRoute(pathname, privateRoutePrefixes)
  ) {
    try {
      const sessionResponse = await checkSession();

      // If session check successful, allow request to proceed
      if (sessionResponse.status === 200) {
        const response = NextResponse.next();
        const setCookieHeaders = sessionResponse.headers["set-cookie"];

        if (setCookieHeaders) {
          if (Array.isArray(setCookieHeaders)) {
            setCookieHeaders.forEach((cookie) => {
              response.headers.append("Set-Cookie", cookie);
            });
          } else if (typeof setCookieHeaders === "string") {
            response.headers.set("Set-Cookie", setCookieHeaders);
          }
        }

        return response;
      } else {
        // If session check failed, redirect to sign in
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    } catch {
      // If session refresh fails, redirect to sign in
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // If has refresh token but no access token, and trying to access auth route
  // Try to refresh session - if successful, redirect to home
  if (
    !hasAccessToken &&
    hasRefreshToken &&
    matchesRoute(pathname, authRoutePrefixes)
  ) {
    try {
      const sessionResponse = await checkSession();

      // If session check successful, update cookies and redirect to home
      if (sessionResponse.status === 200) {
        const response = NextResponse.redirect(new URL("/", request.url));
        const setCookieHeaders = sessionResponse.headers["set-cookie"];

        if (setCookieHeaders) {
          if (Array.isArray(setCookieHeaders)) {
            setCookieHeaders.forEach((cookie) => {
              response.headers.append("Set-Cookie", cookie);
            });
          } else if (typeof setCookieHeaders === "string") {
            response.headers.set("Set-Cookie", setCookieHeaders);
          }
        }

        return response;
      } else {
        // If session check failed, allow to proceed to auth route
        return NextResponse.next();
      }
    } catch {
      // If session refresh fails, allow to proceed to auth route
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
