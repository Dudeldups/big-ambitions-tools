import type { MetadataRoute } from "next";
import { LOCALE_NAMES } from "@/i18n/localeNames";
import { BASE_URL, DEFAULT_LOCALE, ROUTES } from "@/lib/siteConstants";
import { getGameData } from "@/lib/game/registry";
import { DEFAULT_GAME_VERSION } from "@/lib/game/versions";

function localizedPath(locale: string, path: string) {
  return locale === DEFAULT_LOCALE ? path || "/" : `/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = Object.keys(LOCALE_NAMES);
  const { products, ingredients, workstations } =
    getGameData(DEFAULT_GAME_VERSION);
  const detailRoutes = [
    ...Object.keys(products).map((name) => `/database/products/${name}`),
    ...Object.keys(ingredients).map((name) => `/database/ingredients/${name}`),
    ...Object.keys(workstations).map(
      (name) => `/database/workstations/${name}`,
    ),
  ];

  return [...ROUTES, ...detailRoutes].flatMap((route) =>
    locales.map((locale) => ({
      url: `${BASE_URL}${localizedPath(locale, route)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: route === "" ? 1 : 0.7,
    })),
  );
}
