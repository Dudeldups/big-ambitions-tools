import { useTranslations } from "next-intl";

const About = () => {
  const t = useTranslations("about");

  return <div>{t("title")}</div>;
};

export default About;
