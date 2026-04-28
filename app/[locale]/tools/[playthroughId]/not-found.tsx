import NotFound from "@/components/not-found";
import { useTranslations } from "next-intl";

const PlaythroughNotFound = () => {
  const t = useTranslations("tools.playthroughs.notFound");

  return (
    <NotFound
      title={t("title")}
      desc={t("desc")}
      link={{ href: "/tools", label: t("link") }}
    />
  );
};

export default PlaythroughNotFound;
