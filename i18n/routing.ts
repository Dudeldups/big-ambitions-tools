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
  localeDetection: !isDefaultLocaleForced,
});
