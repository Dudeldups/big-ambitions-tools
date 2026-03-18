import { useTranslations } from "next-intl";
import Dashboard from "./dashboard";

const Tools = () => {
  const t = useTranslations("tools.dashboard");

  return (
    <>
      <section className="max-w-page mx-auto w-full">
        <hgroup>
          <h2>{t("title")}</h2>
          <p>{t("desc")}</p>
        </hgroup>

        <Dashboard />
      </section>
    </>
  );
};

export default Tools;
