import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div>
      <hgroup>
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
      </hgroup>

      <Link locale="en" href="/" className="underline">
        English
      </Link>
      <br />
      <Link locale="de" href="/" className="underline">
        Deutsch
      </Link>
    </div>
  );
}
