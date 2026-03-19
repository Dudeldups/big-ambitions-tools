import { useTranslations } from "next-intl";
import PlaythroughOverview from "./playthrough-overview";

const Tools = () => {
  const t = useTranslations("tools");

  return (
    <>
      <section className="max-w-page mx-auto w-full">
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
