"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  createCurrencyColumn,
  createNumericColumn,
  createTranslatedColumn,
} from "@/components/tables/shared-table-columns";
import { Product } from "@/lib/game/products";
import TableHeaderContent from "@/components/tables/table-header-content";
import { getMeta } from "@/lib/utils/getMeta";

type ProductsColumnData = Product & {
  itemName: string;
};

export const productsColumns: ColumnDef<ProductsColumnData>[] = [
  createTranslatedColumn("itemName", "products"),
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
        return "-";
      }

      if (importers.length === 1) {
        return importers[0];
      }

      return (
        <ul>
          {importers.map((importer, index) => {
            return <li key={index}>{importer}</li>;
          })}
        </ul>
      );
    },
  },
  {
    accessorKey: "ingredients",
    enableSorting: false,
    header: ({ column, table }) => {
      const { t } = getMeta(table);
      return (
        <TableHeaderContent column={column}>
          {t(`general.tableColumns.ingredients`)}
        </TableHeaderContent>
      );
    },
    cell: ({ row }) => {
      const ingredients = row.original.ingredients;

      if (!ingredients || ingredients.length === 0) {
        return "-";
      }

      return (
        <ul>
          {ingredients.map((ingredient, index) => {
            const [name, amount] = Object.entries(ingredient)[0];

            return (
              <li key={index}>
                {amount} x {name}
              </li>
            );
          })}
        </ul>
      );
    },
  },
];
