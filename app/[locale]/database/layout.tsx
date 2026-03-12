import { useTranslations } from "next-intl";
import TableSwitcher from "./_components/TableSwitcher";

const Database = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("database");

  return (
    <div className="flex flex-col items-center px-4 py-8">
      <section className="max-w-page">
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

export default Database;
