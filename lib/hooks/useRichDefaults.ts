import { getRichDefaults } from "@/i18n/defaults";
import { RichTranslationValues, useTranslations } from "next-intl";

export const useRichDefaults = (namespace?: string) => {
  const t = useTranslations(namespace);
  const tGeneral = useTranslations("general");

  const richDefaults = getRichDefaults(tGeneral);

  return {
    t,
    rich: (key: string, values?: RichTranslationValues) =>
      t.rich(key, {
        ...richDefaults,
        ...values,
      }),
  };
};
