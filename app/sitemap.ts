import type { MetadataRoute } from "next";
import { LOCALE_NAMES } from "@/i18n/localeNames";
import { BASE_URL, DEFAULT_LOCALE, ROUTES } from "@/lib/siteConstants";

function localizedPath(locale: string, path: string) {
  return locale === DEFAULT_LOCALE ? path || "/" : `/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = Object.keys(LOCALE_NAMES);

  return ROUTES.flatMap((route) =>
    locales.map((locale) => ({
      url: `${BASE_URL}${localizedPath(locale, route)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: route === "" ? 1 : 0.7,
    })),
  );
}
