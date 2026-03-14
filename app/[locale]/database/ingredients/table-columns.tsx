"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  createCurrencyColumn,
  createNumericColumn,
  createTranslatedColumn,
} from "@/components/tables/shared-table-columns";
import { Ingredient } from "@/lib/game/ingredients";
import TableHeaderContent from "@/components/tables/table-header-content";
import { getMeta } from "@/lib/utils/getMeta";

type IngredientsColumnData = Ingredient & {
  itemName: string;
};

export const ingredientsColumns: ColumnDef<IngredientsColumnData>[] = [
  createTranslatedColumn("itemName", "ingredients"),
  createNumericColumn("amountPerBox"),
  createCurrencyColumn("importPrice", "hard"),
  {
    accessorKey: "importers",
    header: ({ column, table }) => {
      const { t } = getMeta(table);
      return (
        <TableHeaderContent column={column}>
          {t(`general.tableColumns.importers`)}
        </TableHeaderContent>
      );
    },
    cell: ({ row }) => {
      const importers = row.original.importers;
      if (!importers || importers.length === 0) {
        return "None";
      }
      return importers.join(", ");
    },
  },
];
