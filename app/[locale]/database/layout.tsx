import { GLOSSARY } from "@/i18n/glossary";
import {
  generateTranslatedMetadata,
  TranslatedMetadataProps,
} from "@/lib/generateTranslatedMetadata";
import { Metadata } from "next";
import DatabaseLayoutClient from "./layout-client";
import DatabaseModalFocusProvider from "@/components/database/database-modal-focus-provider";

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

const DatabaseLayout = ({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) => {
  return (
    <>
      <DatabaseLayoutClient>{children}</DatabaseLayoutClient>
      <DatabaseModalFocusProvider>{modal}</DatabaseModalFocusProvider>
    </>
  );
};

export default DatabaseLayout;
