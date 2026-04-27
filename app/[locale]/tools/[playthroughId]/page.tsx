"use client";

import DefaultHgroup from "@/components/deco/default-hgroup";
import SectionWrapper from "@/components/deco/section-wrapper";
import EmpireOverview from "@/components/tools/empire-overview";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { Factory } from "lucide-react";
import { useTranslations } from "next-intl";

const PlaythroughIdPage = () => {
  const t = useTranslations("tools");
  const tGeneral = useTranslations("general");
  const { activePlaythrough } = useActivePlaythrough();

  // TODO add skeletons
  if (!activePlaythrough) {
    return null;
  }

  return (
    <>
      <SectionWrapper
        size="noTopPadding"
        className="flex flex-col justify-center *:flex-1 max-lg:gap-14 lg:flex-row"
      >
        <div className="space-y-6">
          <DefaultHgroup
            title={`${tGeneral("playthrough")} ${activePlaythrough?.characterName}`}
            caption={t("playthroughDetail.desc")}
          />

          <Button asChild size="lg">
            <Link href={`/tools/${activePlaythrough.id}/factories`}>
              <Factory className="size-5" />
              {tGeneral("factories")}
            </Link>
          </Button>
        </div>

        <EmpireOverview />
      </SectionWrapper>
    </>
  );
};

export default PlaythroughIdPage;
