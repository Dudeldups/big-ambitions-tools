"use client";

import { ColumnDef } from "@tanstack/react-table";
import { createTranslatedColumn } from "@/components/tables/shared-table-columns";
import { Workstation } from "@/lib/game/machines";
import { getMeta } from "@/lib/utils/getMeta";
import TableHeaderContent from "@/components/tables/table-header-content";

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
        <TableHeaderContent column={column} align="start">
          {t(`general.tableColumns.neededMachines`)}
        </TableHeaderContent>
      );
    },
    cell: ({ getValue, table }) => {
      const machines = getValue() as string[];
      const { t } = getMeta(table);

      if (!machines?.length) {
        return "-";
      }

      if (machines.length === 1) {
        return t(`machines.${machines[0]}`);
      }

      return (
        <ul>
          {machines.map((machine, index) => (
            <li className="not-first:pt-1" key={index}>
              {t(`machines.${machine}`)}
            </li>
          ))}
        </ul>
      );
    },
  },
];
