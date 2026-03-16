import { useTranslations } from "next-intl";

const ToolsLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("tools");

  return (
    <div className="px-4 py-8">
      <section className="max-w-page mx-auto w-full">
        <hgroup>
          <h1>{t("intro.title")}</h1>
          <p>{t("intro.desc")}</p>
        </hgroup>

        {children}
      </section>
    </div>
  );
};

export default ToolsLayout;
