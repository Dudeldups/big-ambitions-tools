import type { DetailKind } from "@/components/database/database-detail-config";
import { DATABASE_DETAIL_CONFIG } from "@/components/database/database-detail-config";
import { GLOSSARY } from "@/i18n/glossary";
import { getTranslations } from "next-intl/server";
import { generateTranslatedMetadata } from "./generateTranslatedMetadata";

export async function generateDatabaseDetailMetadata({
  locale,
  kind,
  name,
}: {
  locale: string;
  kind: DetailKind;
  name: string;
}) {
  const { namespace } = DATABASE_DETAIL_CONFIG[kind];
  const t = await getTranslations({ locale, namespace });

  return generateTranslatedMetadata({
    locale,
    titleNamespace: namespace,
    titleKey: name,
    descriptionNamespace: "metadata.database",
    descriptionKey: `${kind}Description`,
    descriptionValues: { name: t(name), gameName: GLOSSARY.gameName },
    path: `/database/${namespace}/${name}`,
  });
}
