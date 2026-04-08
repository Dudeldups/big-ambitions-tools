"use client";

import CreatePlaythroughForm from "@/components/tools/create-playthrough-form";
import PlaythroughOverview from "@/components/tools/playthrough-overview";
import { useTranslations } from "next-intl";

const Tools = () => {
  const t = useTranslations("tools");

  return (
    <>
      <section className="max-w-page mx-auto w-full">
        <div className="bg-background border-border border-b">
          <div className="mx-auto flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
            <CreatePlaythroughForm />
          </div>
        </div>

        <hgroup>
          <h1>{t("intro.title")}</h1>
          <p>{t("intro.desc")}</p>
        </hgroup>

        <PlaythroughOverview />
      </section>
    </>
  );
};

export default Tools;
