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
import { Difficulty, StoreDifficulty } from "@/lib/game/types";
import { ProductName } from "@/lib/game/productNames";
import {
  getExportPrice,
  getImportPrice,
  getProfitMarginForProduct,
} from "@/lib/calculations/math";
import { formatToUSD } from "@/lib/utils/formatToUSD";
import { Spinner } from "@/components/ui/spinner";

export type ProductsColumnData = Product & {
  itemName: ProductName;
};

export const productsColumns = (
  difficulty: StoreDifficulty,
): ColumnDef<ProductsColumnData>[] => [
  createTranslatedColumn("itemName", "products"),
  createNumericColumn("amountPerBox"),
  createCurrencyColumn("importPrice", difficulty, (row, diff) =>
    getImportPrice(row.wholesalePrice, diff as Difficulty),
  ),
  createCurrencyColumn("exportPrice", difficulty, (row, diff) =>
    getExportPrice(row.wholesalePrice, diff as Difficulty),
  ),
  {
    id: "profitMargin",
    header: ({ column, table }) => {
      const { t } = getMeta(table);
      return (
        <TableHeadContent column={column}>
          {t(`tableColumns.profitMargin`)}
        </TableHeadContent>
      );
    },
    cell: ({ row, table }) => {
      const difficulty = table.options.meta?.difficulty;

      if (!difficulty) return <Spinner />;

      const { margin, marginPercent } = getProfitMarginForProduct(
        row.original,
        difficulty,
      );
      const isPositive = margin >= 0;
      return (
        <div className="flex flex-col">
          <span
            className={`amount ${isPositive ? "text-green-600" : "text-red-600"}`}
          >
            {formatToUSD(margin)}
          </span>
          <span className="amount text-muted-foreground text-sm">
            {marginPercent.toFixed(0)}%
          </span>
        </div>
      );
    },
  },
  createImportersColumn(),
  {
    accessorKey: "ingredients",
    enableSorting: false,
    header: ({ column, table }) => {
      const { t } = getMeta(table);
      return (
        <TableHeadContent column={column}>
          {t(`tableColumns.ingredients`)}
        </TableHeadContent>
      );
    },
    cell: ({ row, table }) => {
      const { t } = getMeta(table);
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
                {amount} x {t(`ingredients.${name}`)}
              </li>
            );
          })}
        </ul>
      );
    },
  },
];
