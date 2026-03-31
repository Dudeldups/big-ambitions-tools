import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

const isTestMode = process.env.TEST_MODE === "1";

const allowedPaths = process.env.ALLOWED_PATHS
  ? process.env.ALLOWED_PATHS.split(",").map((p) => p.trim())
  : [];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isTestMode) {
    return intlMiddleware(request);
  }

  if (isTestMode && allowedPaths.length === 0) {
    console.warn("TEST_MODE enabled but no ALLOWED_PATHS set");
  }

  if (pathname === "/") {
    const firstAllowed = allowedPaths[0] || "/";
    const url = request.nextUrl.clone();
    url.pathname = firstAllowed;
    return NextResponse.redirect(url);
  }

  const isAllowed = allowedPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (!isAllowed) {
    const url = request.nextUrl.clone();
    url.pathname = allowedPaths[0] || "/";
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
