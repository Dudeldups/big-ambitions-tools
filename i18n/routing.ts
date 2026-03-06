import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: [
    "en",
    "de",
    "fr",
    "es",
    "it",
    "pt",
    "ru",
    "zh",
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
  ],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
