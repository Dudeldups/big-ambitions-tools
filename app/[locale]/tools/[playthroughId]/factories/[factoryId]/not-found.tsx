"use client";

import CenteredSpinner from "@/components/cemetery/centered-spinner";
import NotFound from "@/components/not-found";
import { usePathname } from "@/i18n/navigation";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { useTranslations } from "next-intl";

const FactoryNotFound = () => {
  const pathname = usePathname();
  const { activePlaythrough } = useActivePlaythrough();
  const t = useTranslations("tools.factories.notFound");

  if (!activePlaythrough) return null;
  if (pathname.includes(activePlaythrough.id)) return <CenteredSpinner />;

  return (
    <NotFound
      title={t("title")}
      desc={t("desc")}
      link={{
        href: `/tools/${activePlaythrough.id}/factories`,
        label: t("link"),
      }}
    />
  );
};

export default FactoryNotFound;
