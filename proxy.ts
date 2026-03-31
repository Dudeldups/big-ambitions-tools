import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

type Locale = (typeof routing.locales)[number];

const isTestMode = process.env.TEST_MODE === "1";
const isDefaultLocaleForced = process.env.FORCE_DEFAULT_LOCALE === "1";
const allowedPaths = process.env.ALLOWED_PATHS
  ? process.env.ALLOWED_PATHS.split(",").map((p) => p.trim())
  : [];

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  if (!isTestMode) {
    return intlMiddleware(request);
  }

  const { pathname } = request.nextUrl;
  let pathnameToCheck = pathname;

  if (isDefaultLocaleForced) {
    const segments = pathname.split("/");

    if (isLocale(segments[1]) && segments[1] !== "en") {
      const url = request.nextUrl.clone();
      url.pathname = "/" + segments.slice(2).join("/") || "/";
      return NextResponse.redirect(url);
    }

    pathnameToCheck = stripLocale(pathname);
  }

  if (pathnameToCheck === "/") {
    const firstAllowed = allowedPaths[0] || "/";
    const url = request.nextUrl.clone();
    url.pathname = firstAllowed;
    return NextResponse.redirect(url);
  }

  const isAllowed = allowedPaths.some(
    (p) => pathnameToCheck === p || pathnameToCheck.startsWith(`${p}/`),
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

function isLocale(value: string): value is Locale {
  return routing.locales.includes(value as Locale);
}

function stripLocale(pathname: string) {
  const segments = pathname.split("/");

  if (isLocale(segments[1])) {
    return "/" + segments.slice(2).join("/");
  }

  return pathname;
}
