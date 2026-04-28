"use client";

import DefaultHgroup from "@/components/deco/default-hgroup";
import SectionSeparator from "@/components/deco/section-separator";
import SectionWrapper from "@/components/deco/section-wrapper";
import NoDataFound from "@/components/no-data-found";
import FactoryCardOverview from "@/components/tools/factory-card-overview";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

const FactoriesPage = () => {
  const t = useTranslations("tools");
  const { activePlaythrough } = useActivePlaythrough();

  const hasFactories = activePlaythrough?.factoryIds.length !== 0;

  // TODO add skeletons
  if (!activePlaythrough) {
    return null;
  }

  const mainDescription = (
    <>
      <p>{t("factories.desc")}</p>
      <p className="mt-3">{t("factories.desc1")}</p>
    </>
  );

  return (
    <SectionWrapper size="noTopPadding" className="gap-10 md:gap-14">
      <DefaultHgroup
        title={t("factories.title")}
        caption={mainDescription}
        captionAs="div"
      />

      <SectionSeparator />

      {!hasFactories ? (
        <div className="grid place-items-center">
          <NoDataFound text={t("factories.noFactories")} />
          <Button className="gap-1.5" asChild>
            <Link href={`/tools/${activePlaythrough.id}/factories/create`}>
              <Plus className="size-5" />
              {t("factoryPlanner.buttonDesc")}
            </Link>
          </Button>
        </div>
      ) : (
        <FactoryCardOverview playthrough={activePlaythrough} />
      )}
    </SectionWrapper>
  );
};

export default FactoriesPage;
