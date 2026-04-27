import DefaultHgroup from "@/components/deco/default-hgroup";
import SectionSeparator from "@/components/deco/section-separator";
import SectionWrapper from "@/components/deco/section-wrapper";
import CreatePlaythroughForm from "@/components/tools/create-playthrough-form";
import PlaythroughOverview from "@/components/tools/playthrough-overview";
import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

const Tools = () => {
  const t = useTranslations("tools");
  const tGeneral = useTranslations("general");

  return (
    <div className="main-wrapper">
      <SectionWrapper variant="primary" centerMobile>
        <hgroup className="grid items-end gap-14 md:grid-cols-[2fr_3fr] lg:gap-24">
          <h1>{tGeneral("tools")}</h1>

          <div className="max-w-lg">
            <p className="text-h5">{t("intro.desc")}</p>
          </div>
        </hgroup>
      </SectionWrapper>

      <SectionWrapper className="gap-10 md:gap-14">
        <DefaultHgroup
          title={tGeneral("playthroughs")}
          caption={t("playthroughs.desc")}
        />

        <div className="bg-card shadow-accent border-destructive/50 mx-auto flex max-w-md flex-col items-center gap-4 rounded-lg border p-4 shadow-sm md:max-w-xl md:flex-row">
          <div className="bg-destructive/10 text-foreground border-destructive/50 pointer-events-none rounded-md border p-1.5">
            <TriangleAlert className="size-6" />
          </div>
          <p className="text-card-foreground">{t("playthroughs.warning")}</p>
        </div>

        <SectionSeparator />

        <div>
          <CreatePlaythroughForm />
        </div>

        <PlaythroughOverview />
      </SectionWrapper>
    </div>
  );
};

export default Tools;
