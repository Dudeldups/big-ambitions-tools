import { useTranslations } from "next-intl";
import Dashboard from "./dashboard";

const Tools = () => {
  const t = useTranslations("tools");

  return (
    <>
      <section className="max-w-page mx-auto w-full">
        <hgroup>
          <h1>{t("intro.title")}</h1>
          <p>{t("intro.desc")}</p>
        </hgroup>

        <Dashboard />
      </section>
    </>
  );
};

export default Tools;
