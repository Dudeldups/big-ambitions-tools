import { useTranslations } from "next-intl";
import PlaythroughOverview from "../playthrough-overview";

const Dashboard = () => {
  const t = useTranslations("tools.dashboard");

  return (
    <>
      <hgroup>
        <h2>{t("title")}</h2>

        <p>{t("desc")}</p>
      </hgroup>

      <PlaythroughOverview />
    </>
  );
};

export default Dashboard;
