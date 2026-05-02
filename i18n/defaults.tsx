import { SmartLink } from "@/components/smart-link";
import { GLOSSARY } from "./glossary";
import { Translator } from "@/lib/types";
import messages from "@/messages/en.json";
import { RichTranslationValues } from "next-intl";

export const sLink = (href: string) => {
  return function LinkHandler(chunks: React.ReactNode) {
    return (
      <SmartLink href={href} className="font-semibold">
        {chunks}
      </SmartLink>
    );
  };
};

export const getRichDefaults = (
  tGeneral: Translator,
): RichTranslationValues => {
  const defaults: RichTranslationValues = {
    ...GLOSSARY,
    em: (chunks) => <em>{chunks}</em>,
    cite: (chunks) => <cite>{chunks}</cite>,
    strong: (chunks) => <strong>{chunks}</strong>,
    br: () => <br />,
  };

  Object.keys(messages.general).forEach((key) => {
    const value = messages.general[key as keyof typeof messages.general];

    if (typeof value === "string") {
      defaults[key] = tGeneral(key);
    }
  });

  return defaults;
};
