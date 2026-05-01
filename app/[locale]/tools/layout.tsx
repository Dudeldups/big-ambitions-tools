import ScrollToTop from "@/components/providers/scroll-to-top";
import { GLOSSARY } from "@/i18n/glossary";
import {
  generateTranslatedMetadata,
  TranslatedMetadataProps,
} from "@/lib/generateTranslatedMetadata";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: TranslatedMetadataProps): Promise<Metadata> {
  const { locale } = await params;

  return generateTranslatedMetadata({
    locale,
    fallbackTitle: GLOSSARY.toolsSection,
    descriptionNamespace: "metadata.tools",
    descriptionValues: {
      gameName: GLOSSARY.gameName,
    },
    path: "/tools",
  });
}

const ToolsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ScrollToTop />
      {children}
    </>
  );
};

export default ToolsLayout;
