import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privateRoutePrefixes = ["/notes", "/profile"];
const authRoutePrefixes = ["/sign-in", "/sign-up"];

const matchesRoute = (pathname: string, prefixes: string[]) =>
  prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthToken =
    Boolean(request.cookies.get("accessToken")?.value) ||
    Boolean(request.cookies.get("refreshToken")?.value);

  if (!hasAuthToken && matchesRoute(pathname, privateRoutePrefixes)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (hasAuthToken && matchesRoute(pathname, authRoutePrefixes)) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
