"use client";

import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const TableSwitcher = () => {
  const t = useTranslations("general");
  const tDatabase = useTranslations("database");
  const pathname = usePathname();

  const links = [
    {
      title: t("products"),
      path: "/database/products",
    },
    {
      title: t("ingredients"),
      path: "/database/ingredients",
    },
    {
      title: t("machines"),
      path: "/database/machines",
    },
    {
      title: t("inventory"),
      path: "/database/inventory",
    },
    {
      title: t("vehicles"),
      path: "/database/vehicles",
    },
  ];

  return (
    <div className="border-muted-foreground/50 max-w-max rounded-lg border max-md:mx-auto">
      <div className="bg-card dark:bg-card/80 rounded-t-lg p-3">
        <p className="text-foreground/90 font-semibold">
          {tDatabase("intro.buttonDesc")}
        </p>
      </div>

      <div className="bg-background mx-auto flex flex-col gap-4 rounded-b-lg p-3 max-md:max-w-xs md:flex-row md:flex-wrap">
        {links.map((link) => (
          <Button
            key={link.path}
            asChild
            variant={pathname === link.path ? "foreground" : "ghost"}
          >
            <Link href={link.path}>{link.title}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TableSwitcher;
