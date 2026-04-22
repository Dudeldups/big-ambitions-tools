"use client";

import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const TableSwitcher = () => {
  const t = useTranslations("database");
  const pathname = usePathname();

  const links = [
    {
      title: t("table.products.title"),
      path: "/database/products",
    },
    {
      title: t("table.ingredients.title"),
      path: "/database/ingredients",
    },
    {
      title: t("table.machines.title"),
      path: "/database/machines",
    },
    {
      title: t("table.inventory.title"),
      path: "/database/inventory",
    },
    {
      title: t("table.vehicles.title"),
      path: "/database/vehicles",
    },
  ];

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {links.map((link) => (
        <Button
          key={link.path}
          asChild
          variant={`${pathname === link.path ? "foreground" : "secondary"}`}
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
