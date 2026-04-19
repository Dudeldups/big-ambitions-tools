import { defineRouting } from "next-intl/routing";

const isDefaultLocaleForced = process.env.FORCE_DEFAULT_LOCALE === "1";

export const routing = defineRouting({
  locales: [
    "en",
    "de",
    "fr",
    "es",
    "it",
    "pt",
    "ru",
    "ja",
    "ko",
    "tr",
    "nl",
    "el",
    "hu",
    "fi",
    "da",
    "uk",
    "pl",
    "cs",
    "ro",
    "lt",
    "zh-CN", // Simplified Chinese
    "zh-TW", // Traditional Chinese
  ],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeCookie: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  localeDetection: !isDefaultLocaleForced,
});
