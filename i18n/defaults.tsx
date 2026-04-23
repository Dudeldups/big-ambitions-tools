import { SmartLink } from "@/components/smart-link";
import { GLOSSARY } from "./glossary";
import { Translator } from "@/lib/types";

export const sLink = (href: string) => {
  return function LinkHandler(chunks: React.ReactNode) {
    return <SmartLink href={href}>{chunks}</SmartLink>;
  };
};

export const getRichDefaults = (t: Translator) => ({
  ...GLOSSARY,

  em: (chunks: React.ReactNode) => <em>{chunks}</em>,
  cite: (chunks: React.ReactNode) => <cite>{chunks}</cite>,

  database: t("database"),
  tools: t("tools"),
});
