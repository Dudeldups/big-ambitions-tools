"use client";

import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const TableSwitcher = () => {
  const t = useTranslations("database");
  const pathname = usePathname();

  return (
    <div>
      <ul className="flex flex-col gap-4 md:flex-row">
        <li>
          <Button
            asChild
            variant={`${pathname === "/database/products" ? "default" : "secondary"}`}
          >
            <Link href="/database/products" className={``}>
              {t("table.products.title")}
            </Link>
          </Button>
        </li>
        <li>
          <Button
            asChild
            variant={`${pathname === "/database/ingredients" ? "default" : "secondary"}`}
          >
            <Link href="/database/ingredients" className={``}>
              {t("table.ingredients.title")}
            </Link>
          </Button>
        </li>
        <li>
          <Button
            asChild
            variant={`${pathname === "/database/machines" ? "default" : "secondary"}`}
          >
            <Link href="/database/machines" className={``}>
              {t("table.machines.title")}
            </Link>
          </Button>
        </li>
        <li>
          <Button
            asChild
            variant={`${pathname === "/database/inventory" ? "default" : "secondary"}`}
          >
            <Link href="/database/inventory" className={``}>
              {t("table.inventory.title")}
            </Link>
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default TableSwitcher;
