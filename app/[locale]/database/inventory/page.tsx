"use client";

import { DataTable } from "../../../../components/tables/data-table";
import { shelves } from "@/lib/game/inventory";
import { inventoryColumns } from "./table-columns";
import { useTranslations } from "next-intl";

const data = Object.entries(shelves).map(([itemName, shelf]) => ({
  itemName,
  ...shelf,
}));

export default function InventoryPage() {
  const t = useTranslations();

  return (
    <>
      <hgroup>
        <h2>{t("general.inventory")}</h2>
        <p>{t("database.inventory.caption")}</p>
      </hgroup>

      <DataTable
        columns={inventoryColumns(t)}
        data={data}
        className="max-w-4xl"
      />
    </>
  );
}
