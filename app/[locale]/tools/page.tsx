"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const Tools = () => {
  const t = useTranslations("tools");

  return (
    <>
      <section className="max-w-page mx-auto w-full">
        <hgroup>
          <h1>{t("intro.title")}</h1>
          <p>{t("intro.desc")}</p>
        </hgroup>

        <Button asChild>
          <Link href="/tools/dashboard">Dashboard</Link>
        </Button>
      </section>
    </>
  );
};

export default Tools;
