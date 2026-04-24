import TableSwitcher from "@/components/tables/table-switcher";
import { useTranslations } from "next-intl";

const DatabaseLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("database");
  const tGeneral = useTranslations("general");

  return (
    <div className="main-wrapper">
      <div className="section-wrapper hero--secondary">
        <section>
          <hgroup>
            <h1>{tGeneral("database")}</h1>
            <p>{t("intro.desc")}</p>
          </hgroup>

          <TableSwitcher />
        </section>
      </div>

      {children}
    </div>
  );
};

export default DatabaseLayout;
