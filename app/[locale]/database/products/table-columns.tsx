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
    header: ({ table }) => {
      const { t } = getMeta(table);
      return t("tableColumns.profitMargin");
    },
    meta: {
      align: "center",
    },
    columns: [
      {
        id: "margin",
        accessorFn: (row) => {
          if (!difficulty) return -Infinity;
          return getProfitMarginForProduct(row, difficulty).margin;
        },
        header: ({ column }) => (
          <TableHeadContent column={column} align="end">
            $
          </TableHeadContent>
        ),
        cell: ({ row }) => {
          if (!difficulty) return <Spinner />;
          const { margin } = getProfitMarginForProduct(
            row.original,
            difficulty,
          );
          return (
            <span
              className={`amount ${margin >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatToUSD(margin)}
            </span>
          );
        },
        meta: {
          align: "right",
        },
      },
      {
        id: "marginPercent",
        accessorFn: (row) => {
          if (!difficulty) return -Infinity;
          return getProfitMarginForProduct(row, difficulty).marginPercent;
        },
        header: ({ column }) => (
          <TableHeadContent column={column} align="end">
            %
          </TableHeadContent>
        ),
        cell: ({ row }) => {
          if (!difficulty) return <Spinner />;
          const { marginPercent } = getProfitMarginForProduct(
            row.original,
            difficulty,
          );
          return (
            <span className="amount text-muted-foreground text-sm">
              {marginPercent.toFixed(0)}%
            </span>
          );
        },
        meta: {
          align: "right",
        },
      },
    ],
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
    meta: {
      align: "center",
    },
  },
];
