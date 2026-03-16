import TableSwitcher from "@/components/tables/table-switcher";
import { useTranslations } from "next-intl";

const DatabaseLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("database");

  return (
    <div className="px-4 py-8">
      <section className="max-w-page mx-auto w-full">
        <hgroup>
          <h1>{t("intro.title")}</h1>
          <p>{t("intro.desc")}</p>
        </hgroup>

        <TableSwitcher />

        {children}
      </section>
    </div>
  );
};

export default DatabaseLayout;
