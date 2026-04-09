"use client";

import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import PlaythroughNotFound from "./not-found";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { useShallow } from "zustand/shallow";
import { Factory, Plus, SlidersHorizontal, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import TextSkeleton from "@/components/cemetery/text-skeleton";
import { deriveWeeklyIncome } from "@/lib/calculations/derivedFactoryData";
import CurrencyText from "@/components/currency-text";
import { Link, usePathname } from "@/i18n/navigation";

const PlaythroughIdLayout = ({ children }: { children: React.ReactNode }) => {
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

  if (isInvalid && !isLoading) return <PlaythroughNotFound />;

  const weeklyIncome = activePlaythrough
    ? deriveWeeklyIncome(factories, activePlaythrough)
    : null;

  return (
    <>
      <div className="bg-background border-border max-w-page mx-auto border-b">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3">
          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            {activePlaythrough ? (
              <h1 className="text-foreground min-w-0 truncate text-xl font-semibold tracking-tight">
                {activePlaythrough.characterName}
              </h1>
            ) : (
              <TextSkeleton />
            )}

            <div className="text-muted-foreground flex flex-1 flex-wrap items-center gap-x-5 gap-y-1 text-sm">
              <span className="flex items-center gap-1.5">
                <Factory className="size-5 shrink-0" />
                <span>
                  <span className="text-foreground font-medium">
                    {factories.length}
                  </span>{" "}
                  {factories.length === 1 ? "factory" : "factories"}
                </span>
              </span>

              <span className="flex items-center gap-1.5">
                <TrendingUp className="size-5 shrink-0" />
                <span>
                  <span className="text-foreground font-medium">
                    {weeklyIncome !== null ? (
                      <CurrencyText value={weeklyIncome} hideCents />
                    ) : (
                      <TextSkeleton />
                    )}
                  </span>{" "}
                  / week
                </span>
              </span>
            </div>
          </div>

          <div className="ml-auto flex flex-col items-center gap-4 self-start md:flex-row">
            {isNewFactoryDisabled ? (
              <Button size="sm" className="gap-1.5" disabled>
                <Plus className="size-5" />
                New factory
              </Button>
            ) : (
              <Button size="sm" className="gap-1.5" asChild>
                <Link href={`/tools/${activePlaythrough.id}/factories/create`}>
                  <Plus className="size-5" />
                  New factory
                </Link>
              </Button>
            )}

            <Button variant="outline" size="sm" className="gap-1.5">
              <SlidersHorizontal className="size-5" />
              Price indices
            </Button>
          </div>
        </div>
      </div>

      {children}
    </>
  );
};

export default PlaythroughIdLayout;
