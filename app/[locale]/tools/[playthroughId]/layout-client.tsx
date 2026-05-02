"use client";

import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import PlaythroughNotFound from "./not-found";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { useShallow } from "zustand/shallow";
import { Factory, HandCoins, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import TextSkeleton from "@/components/cemetery/text-skeleton";
import {
  deriveWeeklyIncome,
  deriveWeeklyIngredientCosts,
} from "@/lib/calculations/derivedFactoryData";
import CurrencyText from "@/components/currency-text";
import { Link, usePathname } from "@/i18n/navigation";
import PriceIndicesDialog from "@/components/tools/price-indices-dialog";
import { useTranslations } from "next-intl";
import SectionWrapper from "@/components/deco/section-wrapper";
import { StatBadge } from "@/components/deco/stat-badge";
import { useEffect } from "react";
import { GLOSSARY } from "@/i18n/glossary";

const PlaythroughIdLayoutClient = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const t = useTranslations("tools");
  const tGeneral = useTranslations("general");
  const { isLoading, isInvalid, activePlaythrough } = useActivePlaythrough();
  const pathname = usePathname();
  const isNewFactoryDisabled =
    !activePlaythrough ||
    pathname.includes("/edit") ||
    pathname.includes("/create");

  const factories = usePlaythroughStore(
    useShallow((s) => {
      if (!activePlaythrough) return [];
      return s.factories.filter((f) =>
        activePlaythrough.factoryIds.includes(f.id),
      );
    }),
  );

  useEffect(() => {
    if (activePlaythrough?.characterName) {
      document.title = `${activePlaythrough.characterName} | ${GLOSSARY.siteName}`;
    }
  }, [activePlaythrough?.characterName, pathname]);

  if (isInvalid && !isLoading) return <PlaythroughNotFound />;

  const weeklyIncome = activePlaythrough
    ? deriveWeeklyIncome(factories, activePlaythrough)
    : null;

  const weeklyIngredientCosts = activePlaythrough
    ? deriveWeeklyIngredientCosts(factories, activePlaythrough)
    : null;

  return (
    <>
      <SectionWrapper variant="primary" size="compact" />

      <div className="px-clamp-x mt-10 mb-14">
        <section className="bg-background shadow-foreground/30 border-foreground/20 max-w-page mx-auto rounded-lg border px-4 py-3 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-6">
              {/* Playthrough name */}
              <div className="bg-background text-foreground self-start rounded-md max-md:mx-auto max-md:w-full">
                {activePlaythrough ? (
                  <Button variant="ghost" asChild>
                    <Link href={`/tools/${activePlaythrough.id}`}>
                      <h1 className="truncate text-xl font-bold">
                        {activePlaythrough.characterName}
                      </h1>
                    </Link>
                  </Button>
                ) : (
                  <TextSkeleton className="w-24" />
                )}
              </div>

              {/* Stat-containers */}
              <div className="text-secondary-foreground flex flex-wrap items-center gap-2 text-sm max-md:justify-center max-md:*:w-full lg:gap-4">
                <StatBadge
                  icon={<Factory className="size-5" />}
                  value={factories.length}
                  label={
                    factories.length === 1
                      ? tGeneral("factory")
                      : tGeneral("factories")
                  }
                  href={`/tools/${activePlaythrough?.id}/factories`}
                />
                <StatBadge
                  icon={<TrendingUp className="size-5" />}
                  value={
                    weeklyIncome !== null ? (
                      <CurrencyText value={weeklyIncome} hideCents />
                    ) : (
                      <TextSkeleton className="w-16" />
                    )
                  }
                  label={t("stats.netProfitPerWeek")}
                />
                <StatBadge
                  icon={<HandCoins className="size-5" />}
                  value={
                    weeklyIngredientCosts !== null ? (
                      <CurrencyText
                        value={
                          weeklyIngredientCosts === 0
                            ? 0
                            : weeklyIngredientCosts * -1
                        }
                        hideCents
                      />
                    ) : (
                      <TextSkeleton className="w-16" />
                    )
                  }
                  label={t("stats.ordersPerWeek")}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 xl:flex-row">
              {isNewFactoryDisabled ? (
                <Button className="gap-1.5" disabled>
                  <Plus className="size-5" />
                  {t("factoryPlanner.buttonDesc")}
                </Button>
              ) : (
                <Button className="gap-1.5" asChild>
                  <Link
                    href={`/tools/${activePlaythrough.id}/factories/create`}
                  >
                    <Plus className="size-5" />
                    {t("factoryPlanner.buttonDesc")}
                  </Link>
                </Button>
              )}

              <PriceIndicesDialog />
            </div>
          </div>
        </section>
      </div>

      {children}
    </>
  );
};

export default PlaythroughIdLayoutClient;
