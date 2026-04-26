"use client";

import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const TableSwitcher = () => {
  const t = useTranslations("general");
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
    <div className="mx-auto flex flex-col gap-4 max-md:max-w-xs md:flex-row">
      {links.map((link) => (
        <Button
          key={link.path}
          asChild
          variant={pathname === link.path ? "foreground" : "secondary"}
        >
          <Link href={link.path} className={`flex items-center gap-2`}>
            {link.title}
          </Link>
        </Button>
      ))}
    </div>
  );
};

export default TableSwitcher;
