import {
  generateTranslatedMetadata,
  TranslatedMetadataProps,
} from "@/lib/generateTranslatedMetadata";
import { Metadata } from "next";
import PlaythroughIdLayoutClient from "./layout-client";
import { GLOSSARY } from "@/i18n/glossary";

export async function generateMetadata({
  params,
}: TranslatedMetadataProps): Promise<Metadata> {
  const { locale, playthroughId } = await params;

  return generateTranslatedMetadata({
    locale,
    titleNamespace: "general",
    titleKey: "playthroughs",
    descriptionNamespace: "metadata.playthroughs",
    descriptionValues: {
      gameName: GLOSSARY.gameName,
    },
    path: `/tools/${playthroughId}`,
    noIndex: true,
  });
}

const PlaythroughIdLayout = ({ children }: { children: React.ReactNode }) => {
  return <PlaythroughIdLayoutClient>{children}</PlaythroughIdLayoutClient>;
};

export default PlaythroughIdLayout;
