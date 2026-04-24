import SectionWrapper from "@/components/section-wrapper";
import TableSwitcher from "@/components/tables/table-switcher";
import { useTranslations } from "next-intl";

const DatabaseLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("database");
  const tGeneral = useTranslations("general");

  return (
    <div className="main-wrapper">
      <SectionWrapper variant="secondary" centerMobile>
        <hgroup>
          <h1>{tGeneral("database")}</h1>
          <p>{t("intro.desc")}</p>
        </hgroup>

        <TableSwitcher />
      </SectionWrapper>

      {children}
    </div>
  );
};

export default DatabaseLayout;
