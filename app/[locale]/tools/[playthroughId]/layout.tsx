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

const PlaythroughIdLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isInvalid, activePlaythrough } = useActivePlaythrough();

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
      {/* Header bar */}
      <div className="bg-background border-border sticky top-0 z-10 border-b">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
          {/* Playthrough name */}
          {activePlaythrough ? (
            <h1 className="text-foreground min-w-0 truncate text-xl font-semibold tracking-tight">
              {activePlaythrough.characterName}
            </h1>
          ) : (
            <TextSkeleton />
          )}

          {/* Stats */}
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

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <SlidersHorizontal className="size-5" />
              Price indices
            </Button>

            <Button size="sm" className="gap-1.5">
              <Plus className="size-5" />
              New factory
            </Button>
          </div>
        </div>
      </div>

      {children}
    </>
  );
};

export default PlaythroughIdLayout;
