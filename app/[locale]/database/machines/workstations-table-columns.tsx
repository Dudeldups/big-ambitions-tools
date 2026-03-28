"use client";

import { ColumnDef } from "@tanstack/react-table";
import { createTranslatedColumn } from "@/components/tables/shared-table-columns";
import { machines, Workstation } from "@/lib/game/machines";
import { getMeta } from "@/lib/utils/getMeta";
import TableHeadContent from "@/components/tables/table-head-content";

type WorkstationsColumnData = Workstation & {
  itemName: string;
};

export const workstationsColumns: ColumnDef<WorkstationsColumnData>[] = [
  createTranslatedColumn("itemName", "workstations"),
  {
    accessorKey: "neededMachines",
    header: ({ column, table }) => {
      const { t } = getMeta(table);
      return (
        <TableHeadContent column={column} align="start">
          {t(`tableColumns.neededMachines`)}
        </TableHeadContent>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "purchasePrice",
    header: ({ column, table }) => {
      const { t } = getMeta(table);
      return (
        <TableHeadContent column={column} align="end">
          {t(`tableColumns.purchasePrice`)}
        </TableHeadContent>
      );
    },
    sortingFn: (rowA, rowB) => {
      const totalA = rowA.original.neededMachines
        .map((m) => machines[m]?.purchasePrice)
        .reduce((acc, price) => acc + (price || 0), 0);
      const totalB = rowB.original.neededMachines
        .map((m) => machines[m]?.purchasePrice)
        .reduce((acc, price) => acc + (price || 0), 0);

      if (totalA > totalB) return 1;
      if (totalA < totalB) return -1;
      return 0;
    },
  },
];
