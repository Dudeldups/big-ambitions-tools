"use client";

import NotFound from "@/components/not-found";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { useTranslations } from "next-intl";

const FactoryNotFound = () => {
  const { activePlaythrough } = useActivePlaythrough();
  const t = useTranslations("tools.factories.notFound");

  if (!activePlaythrough) return null;

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
