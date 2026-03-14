import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...base };

  for (const key in override) {
    if (
      override[key] !== null &&
      typeof override[key] === "object" &&
      !Array.isArray(override[key]) &&
      typeof base[key] === "object" &&
      base[key] !== null &&
      !Array.isArray(base[key])
    ) {
      result[key] = deepMerge(
        base[key] as Record<string, unknown>,
        override[key] as Record<string, unknown>,
      );
    } else {
      result[key] = override[key];
    }
  }

  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const isDev = process.env.NODE_ENV === "development";
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const [localeMessages, fallbackMessages] = await Promise.all([
    import(`../messages/${locale}.json`).then((m) => m.default),
    import(`../messages/en.json`).then((m) => m.default),
  ]);

  return {
    locale,
    messages:
      !isDev && locale !== "en"
        ? deepMerge(fallbackMessages, localeMessages)
        : localeMessages,
  };
});
