import { GLOSSARY } from "@/i18n/glossary";
import {
  generateTranslatedMetadata,
  TranslatedMetadataProps,
} from "@/lib/generateTranslatedMetadata";
import { Metadata } from "next";
import DatabaseLayoutClient from "./layout-client";

export async function generateMetadata({
  params,
}: TranslatedMetadataProps): Promise<Metadata> {
  const { locale } = await params;

  return generateTranslatedMetadata({
    locale,
    titleNamespace: "general",
    titleKey: "database",
    descriptionNamespace: "metadata.database",
    descriptionValues: {
      gameName: GLOSSARY.gameName,
    },
    path: "/database",
  });
}

const DatabaseLayout = ({ children }: { children: React.ReactNode }) => {
  return <DatabaseLayoutClient>{children}</DatabaseLayoutClient>;
};

export default DatabaseLayout;
