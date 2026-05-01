import { GLOSSARY } from "@/i18n/glossary";
import { LOCALE_NAMES } from "@/i18n/localeNames";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export type TranslatedMetadataProps = {
  params: Promise<{ locale: string }>;
};

type GenerateTranslatedMetadataOptions = {
  locale: string;
  titleNamespace?: string;
  titleKey?: string;
  fallbackTitle?: string;
  descriptionNamespace?: string;
  descriptionKey?: string;
  descriptionValues?: Record<string, string | number | Date>;
  path?: string;
  noIndex?: boolean;
};

const BASE_URL = "https://big-ambitions-tools.com";
const DEFAULT_LOCALE = "en";

function localizedPath(locale: string, path = "/") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return locale === DEFAULT_LOCALE ? cleanPath : `/${locale}${cleanPath}`;
}

function absoluteUrl(locale: string, path = "/") {
  return `${BASE_URL}${localizedPath(locale, path)}`;
}

function buildAlternates(path: string, locale: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};

  for (const localeKey of Object.keys(LOCALE_NAMES)) {
    languages[localeKey] = localizedPath(localeKey, path);
  }

  languages["x-default"] = localizedPath(DEFAULT_LOCALE, path);

  return {
    canonical: localizedPath(locale, path),
    languages,
  };
}

export async function generateTranslatedMetadata({
  locale,
  titleNamespace,
  titleKey = "title",
  fallbackTitle = GLOSSARY.siteName,
  descriptionNamespace,
  descriptionKey = "description",
  descriptionValues,
  noIndex = false,
  path = "/",
}: GenerateTranslatedMetadataOptions): Promise<Metadata> {
  let title = fallbackTitle;
  let description: string | undefined;

  if (titleNamespace) {
    const t = await getTranslations({
      locale,
      namespace: titleNamespace,
    });

    title = t(titleKey);
  }

  if (descriptionNamespace) {
    const t = await getTranslations({
      locale,
      namespace: descriptionNamespace,
    });

    description = t(descriptionKey, descriptionValues);
  }

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    alternates: buildAlternates(path, locale),
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
    openGraph: {
      title,
      description,
      siteName: GLOSSARY.siteName,
      url: absoluteUrl(locale, path),
      type: "website",
    },
  };
}
