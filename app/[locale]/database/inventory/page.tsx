"use client";

import { DataTable } from "../../../../components/tables/data-table";
import { shelves } from "@/lib/game/inventory";
import { getColumns } from "./table-columns";
import { useTranslations } from "next-intl";

export default function DemoPage() {
  const tInventory = useTranslations();
  const columns = getColumns(tInventory);
  const data = Object.entries(shelves).map(([itemName, shelf]) => ({
    itemName,
    ...shelf,
  }));

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
