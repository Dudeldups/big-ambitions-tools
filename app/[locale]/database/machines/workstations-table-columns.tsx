"use client";

import { ColumnDef } from "@tanstack/react-table";
import { createTranslatedColumn } from "@/components/tables/shared-table-columns";
import { Machine, Workstation } from "@/lib/game/types";
import { MachineName } from "@/lib/game/machineNames";
import { getMeta } from "@/lib/utils/getMeta";
import TableHeadContent from "@/components/tables/table-head-content";
import { Translator } from "@/lib/types";

type WorkstationsColumnData = Workstation & {
  itemName: string;
};

export const workstationsColumns = (
  t: Translator,
  machines: Partial<Record<MachineName, Machine>>,
): ColumnDef<WorkstationsColumnData>[] => [
  createTranslatedColumn(t, "itemName", "workstations"),
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
        .map((machineName) => machines[machineName]?.purchasePrice ?? 0)
        .reduce<number>((acc, price) => acc + price, 0);
      const totalB = rowB.original.neededMachines
        .map((machineName) => machines[machineName]?.purchasePrice ?? 0)
        .reduce<number>((acc, price) => acc + price, 0);

      if (totalA > totalB) return 1;
      if (totalA < totalB) return -1;
      return 0;
    },
  },
];
