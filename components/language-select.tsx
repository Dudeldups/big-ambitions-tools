"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { LOCALE_NAMES } from "@/i18n/localeNames";
import { useIsMounted } from "@/lib/hooks/useIsMounted";
import TextSkeleton from "./cemetery/text-skeleton";

const LanguageSelect = () => {
  const isMounted = useIsMounted();
  const lang = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Select defaultValue={lang} onValueChange={handleLanguageChange}>
      <SelectTrigger>
        {isMounted ? <SelectValue /> : <TextSkeleton className="w-14" />}
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectGroup>
          {Object.entries(LOCALE_NAMES).map(([locale, endonym]) => (
            <SelectItem key={locale} value={locale}>
              {endonym}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelect;
