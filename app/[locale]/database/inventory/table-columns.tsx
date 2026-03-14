"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Shelf } from "@/lib/game/inventory";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMeta } from "@/lib/utils/getMeta";

export const columns: ColumnDef<Shelf>[] = [
  {
    accessorKey: "itemName",
    header: ({ column, table }) => {
      const { t } = getMeta(table);
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="flex w-full flex-row justify-start px-2 py-0 text-left"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          {t("database.table.inventory.headers.itemName")}
          {isSorted && (
            <ArrowUp className={isSorted === "asc" ? "" : "rotate-180"} />
          )}
        </Button>
      );
    },
    cell: ({ row, table }) => {
      const { t } = getMeta(table);

      const value = row.getValue("itemName") as string;
      return t(`inventory.${value}`);
    },
  },
  {
    accessorKey: "purchasePrice",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="flex w-full flex-row justify-start px-2 py-0 text-left"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Price
          {isSorted && (
            <ArrowUp className={isSorted === "asc" ? "" : "rotate-180"} />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "storageCapacity",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="flex w-full flex-row justify-start px-2 py-0 text-left"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Storage Capacity
          {isSorted && (
            <ArrowUp className={isSorted === "asc" ? "" : "rotate-180"} />
          )}
        </Button>
      );
    },
  },
];
