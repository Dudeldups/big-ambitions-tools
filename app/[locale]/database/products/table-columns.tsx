"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  createImportersColumn,
  createNumericColumn,
  createProductCurrencyColumn,
  createTranslatedColumn,
} from "@/components/tables/shared-table-columns";
import { Product } from "@/lib/game/products";
import TableHeadContent from "@/components/tables/table-head-content";
import { getMeta } from "@/lib/utils/getMeta";
import { Difficulty, StoreDifficulty } from "@/lib/game/types";
import { ProductName } from "@/lib/game/productNames";
import {
  getAverageRetailPrice,
  getExportPrice,
  getImportPrice,
  getManufacturePrice,
  getProfitMarginForProduct,
} from "@/lib/calculations/math";
import { formatToUSD } from "@/lib/utils/formatToUSD";
import { Spinner } from "@/components/ui/spinner";
import { DisplayPrices } from "@/lib/stores/appStore";
import { DISPLAY_PRICE_OPTIONS } from "@/lib/constants";

export type ProductsColumnData = Product & {
  itemName: ProductName;
};

export const productsColumns = (
  difficulty: StoreDifficulty,
  displayPrices: DisplayPrices | null,
): ColumnDef<ProductsColumnData>[] => {
  const testIndex = 1;

  const isExport =
    displayPrices?.target === DISPLAY_PRICE_OPTIONS.TARGET.EXPORT;
  const isImport =
    displayPrices?.source === DISPLAY_PRICE_OPTIONS.SOURCE.IMPORT;

  const sourcePriceColumn = isImport
    ? createProductCurrencyColumn("importPrice", difficulty, (row, diff) =>
        getImportPrice(row.wholesalePrice, diff as Difficulty, testIndex),
      )
    : createProductCurrencyColumn("manufacturePrice", difficulty, (row, diff) =>
        getManufacturePrice(row, diff as Difficulty),
      );

  const salePriceColumn = isExport
    ? createProductCurrencyColumn("exportPrice", difficulty, (row, diff) =>
        getExportPrice(row.wholesalePrice, diff as Difficulty, testIndex),
      )
    : createProductCurrencyColumn("retailPrice", difficulty, (row) =>
        getAverageRetailPrice(row),
      );

  return [
    createTranslatedColumn("itemName", "products"),
    createNumericColumn("amountPerBox"),
    sourcePriceColumn,
    salePriceColumn,
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
            if (!difficulty || !displayPrices) return -Infinity;
            return getProfitMarginForProduct(row, difficulty, 1, displayPrices)
              .margin;
          },
          sortingFn: (rowA, rowB) => {
            if (!difficulty || !displayPrices) return 0;

            const a = getProfitMarginForProduct(
              rowA.original,
              difficulty,
              1,
              displayPrices,
            ).margin;

            const b = getProfitMarginForProduct(
              rowB.original,
              difficulty,
              1,
              displayPrices,
            ).margin;

            return a - b;
          },
          header: ({ column }) => (
            <TableHeadContent column={column} align="end">
              $
            </TableHeadContent>
          ),
          cell: ({ row }) => {
            if (!difficulty || !displayPrices) return <Spinner />;
            const { margin } = getProfitMarginForProduct(
              row.original,
              difficulty,
              1,
              displayPrices,
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
            if (!difficulty || !displayPrices) return -Infinity;
            return getProfitMarginForProduct(row, difficulty, 1, displayPrices)
              .marginPercent;
          },
          sortingFn: (rowA, rowB) => {
            if (!difficulty || !displayPrices) return 0;

            const a = getProfitMarginForProduct(
              rowA.original,
              difficulty,
              1,
              displayPrices,
            ).marginPercent;

            const b = getProfitMarginForProduct(
              rowB.original,
              difficulty,
              1,
              displayPrices,
            ).marginPercent;

            return a - b;
          },
          header: ({ column }) => (
            <TableHeadContent column={column} align="end">
              %
            </TableHeadContent>
          ),
          cell: ({ row }) => {
            if (!difficulty || !displayPrices) return <Spinner />;
            const { marginPercent } = getProfitMarginForProduct(
              row.original,
              difficulty,
              1,
              displayPrices,
            );
            return (
              <span className="amount text-muted-foreground">
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
    },
  ];
};
