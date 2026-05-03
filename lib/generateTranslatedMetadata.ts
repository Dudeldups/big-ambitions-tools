import { GLOSSARY } from "@/i18n/glossary";
import { LOCALE_NAMES } from "@/i18n/localeNames";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BASE_URL, DEFAULT_LOCALE } from "./siteConstants";

export type TranslatedMetadataProps = {
  params: Promise<{ locale: string; playthroughId: string; factoryId: string }>;
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

function localizedPath(locale: string, path = "/") {
  const cleanPath =
    path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;

  return locale === DEFAULT_LOCALE
    ? cleanPath || "/"
    : `/${locale}${cleanPath}`;
}

function localizedUrl(locale: string, path = "/") {
  return `${BASE_URL}${localizedPath(locale, path)}`;
}

function buildAlternates(path: string, locale: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};

  for (const localeKey of Object.keys(LOCALE_NAMES)) {
    languages[localeKey] = localizedUrl(localeKey, path);
  }

  languages["x-default"] = localizedUrl(DEFAULT_LOCALE, path);

  return {
    canonical: localizedUrl(locale, path),
    languages,
  };
}

const OG_IMAGE = "/opengraph-image.png";

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

  if (path !== "/") title = title + ` | ${GLOSSARY.siteName}`;

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
      url: localizedUrl(locale, path),
      type: "website",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: GLOSSARY.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
