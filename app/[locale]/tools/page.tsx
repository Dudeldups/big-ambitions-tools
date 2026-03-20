"use client";

import { useTranslations } from "next-intl";
import PlaythroughOverview from "./playthrough-overview";
import FactoryOverview from "./factory-overview";
import { usePlaythroughState } from "@/lib/hooks/usePlaythroughState";
import PlaythroughDashboard from "./playthrough-dashboard";
import { Spinner } from "@/components/ui/spinner";

const Tools = () => {
  const t = useTranslations("tools");
  const activePlaythroughId = usePlaythroughState(
    (state) => state.activePlaythroughId,
  );

  return (
    <>
      <section className="max-w-page mx-auto w-full">
        <hgroup>
          <h1>{t("intro.title")}</h1>
          <p>{t("intro.desc")}</p>
        </hgroup>

        {activePlaythroughId === undefined ? (
          <Spinner />
        ) : activePlaythroughId ? (
          <PlaythroughDashboard />
        ) : (
          <>
            <PlaythroughOverview />
            <FactoryOverview />
          </>
        )}
      </section>
    </>
  );
};

export default Tools;
