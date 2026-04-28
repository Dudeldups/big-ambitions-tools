import NotFound from "@/components/not-found";
import { useTranslations } from "next-intl";

const PageNotFound = () => {
  const t = useTranslations("home.notFound");

  return (
    <NotFound
      title={t("title")}
      desc={t("desc")}
      link={{ href: "/", label: t("link") }}
    />
  );
};

export default PageNotFound;
