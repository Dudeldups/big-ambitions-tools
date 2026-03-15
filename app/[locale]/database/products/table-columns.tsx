"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  createCurrencyColumn,
  createImportersColumn,
  createNumericColumn,
  createTranslatedColumn,
} from "@/components/tables/shared-table-columns";
import { Product } from "@/lib/game/products";
import TableHeadContent from "@/components/tables/table-head-content";
import { getMeta } from "@/lib/utils/getMeta";

type ProductsColumnData = Product & {
  itemName: string;
};

export const productsColumns: ColumnDef<ProductsColumnData>[] = [
  createTranslatedColumn("itemName", "products"),
  createNumericColumn("amountPerBox"),
  createCurrencyColumn("importPrice", "hard"),
  createImportersColumn(),
  {
    accessorKey: "ingredients",
    enableSorting: false,
    header: ({ column, table }) => {
      const { t } = getMeta(table);
      return (
        <TableHeadContent column={column}>
          {t(`general.tableColumns.ingredients`)}
        </TableHeadContent>
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
              <li className="not-first:pt-1" key={index}>
                {amount} x {name}
              </li>
            );
          })}
        </ul>
      );
    },
  },
];
