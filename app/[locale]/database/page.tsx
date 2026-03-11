import { useTranslations } from "next-intl";
import Table from "./_components/Table";

const Database = () => {
  const t = useTranslations("database");

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-8">
      <section className="max-w-page">
        <hgroup>
          <h1>{t("intro.title")}</h1>
          <p>{t("intro.desc")}</p>
        </hgroup>

        <Table />
      </section>
    </div>
  );
};

export default Database;
