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
    <div className="mx-auto py-10">
      <DataTable columns={inventoryColumns(t)} data={data} />
    </div>
  );
}
