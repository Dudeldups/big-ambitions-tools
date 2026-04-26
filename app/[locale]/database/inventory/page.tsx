"use client";

import { DataTable } from "../../../../components/tables/data-table";
import { shelves } from "@/lib/game/inventory";
import { inventoryColumns } from "./table-columns";
import { useTranslations } from "next-intl";
import DatabaseHgroup from "@/components/deco/database-hgroup";

const data = Object.entries(shelves).map(([itemName, shelf]) => ({
  itemName,
  ...shelf,
}));

export default function InventoryPage() {
  const t = useTranslations();

  return (
    <>
      <DatabaseHgroup
        title={t("general.inventory")}
        caption={t("database.inventory.caption")}
      />

      <DataTable
        columns={inventoryColumns(t)}
        data={data}
        className="max-w-max"
      />
    </>
  );
}
