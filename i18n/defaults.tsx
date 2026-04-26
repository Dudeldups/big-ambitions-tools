import { SmartLink } from "@/components/smart-link";
import { GLOSSARY } from "./glossary";
import { Translator } from "@/lib/types";
import messages from "@/messages/en.json";
import { RichTranslationValues } from "next-intl";

type JsonMessages = { [key: string]: string | JsonMessages };

const fillDefaults = (
  obj: JsonMessages,
  tGeneral: Translator,
  defaults: RichTranslationValues,
  prefix = "",
) => {
  Object.keys(obj).forEach((key) => {
    const currentPath = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === "object" && obj[key] !== null) {
      fillDefaults(obj[key], tGeneral, defaults, currentPath);
    } else {
      defaults[key] = tGeneral(currentPath);
    }
  });
};

export const sLink = (href: string) => {
  return function LinkHandler(chunks: React.ReactNode) {
    return <SmartLink href={href}>{chunks}</SmartLink>;
  };
};

export const getRichDefaults = (
  tGeneral: Translator,
): RichTranslationValues => {
  const defaults: RichTranslationValues = {
    ...GLOSSARY,
    em: (chunks) => <em>{chunks}</em>,
    cite: (chunks) => <cite>{chunks}</cite>,
    br: () => <br />,
  };

  fillDefaults(messages.general, tGeneral, defaults);

  return defaults;
};
