"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const TableSwitcher = () => {
  const t = useTranslations("database");
  const pathname = usePathname();

  return (
    <div>
      <ul className="flex gap-4">
        <li>
          <Link
            href="/database/products"
            className={`${pathname === "/database/products" ? "text-red-300" : ""}`}
          >
            {t("table.products.title")}
          </Link>
        </li>
        <li>
          <Link
            href="/database/ingredients"
            className={`${pathname === "/database/ingredients" ? "text-red-300" : ""}`}
          >
            {t("table.ingredients.title")}
          </Link>
        </li>
        <li>
          <Link
            href="/database/machines"
            className={`${pathname === "/database/machines" ? "text-red-300" : ""}`}
          >
            {t("table.machines.title")}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default TableSwitcher;
