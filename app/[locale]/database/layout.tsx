import SectionWrapper from "@/components/deco/section-wrapper";
import TableSwitcher from "@/components/tables/table-switcher";
import { useTranslations } from "next-intl";

const DatabaseLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("database");
  const tGeneral = useTranslations("general");

  return (
    <div className="main-wrapper">
      <SectionWrapper variant="secondary" centerMobile>
        <hgroup className="grid items-end gap-14 md:grid-cols-[2fr_3fr] lg:gap-24">
          <h1>{tGeneral("database")}</h1>

          <div className="max-w-lg">
            <p className="text-h5">{t("intro.desc")}</p>
          </div>
        </hgroup>
      </SectionWrapper>

      <SectionWrapper>
        <TableSwitcher />

        {children}
      </SectionWrapper>
    </div>
  );
};

export default DatabaseLayout;
