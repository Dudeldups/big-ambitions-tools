import {
  generateTranslatedMetadata,
  TranslatedMetadataProps,
} from "@/lib/generateTranslatedMetadata";
import { Metadata } from "next";
import PlaythroughIdLayoutClient from "./layout-client";

export async function generateMetadata({
  params,
}: TranslatedMetadataProps): Promise<Metadata> {
  const { locale } = await params;

  return generateTranslatedMetadata({
    locale,
    titleNamespace: "general",
    titleKey: "playthroughs",
    descriptionNamespace: "metadata.playthroughs",
    path: "/tools/???",
    noIndex: true,
  });
}

const PlaythroughIdLayout = ({ children }: { children: React.ReactNode }) => {
  return <PlaythroughIdLayoutClient>{children}</PlaythroughIdLayoutClient>;
};

export default PlaythroughIdLayout;
