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
  getProfitPerHourForProduct,
} from "@/lib/calculations/math";
import { formatToUSD } from "@/lib/utils/formatToUSD";
import { Spinner } from "@/components/ui/spinner";
import { DisplayPrices } from "@/lib/stores/appStore";
import { DISPLAY_PRICE_OPTIONS } from "@/lib/constants";
import IngredientsCell from "@/components/tables/ingredients-cell";

export type ProductsColumnData = Product & {
  itemName: ProductName;
};

export const productsColumns = (
  difficulty: StoreDifficulty,
  displayPrices: DisplayPrices | null,
  tablePriceIndex: number | null,
): ColumnDef<ProductsColumnData>[] => {
  const isExport =
    displayPrices?.target === DISPLAY_PRICE_OPTIONS.TARGET.EXPORT;
  const isImport =
    displayPrices?.source === DISPLAY_PRICE_OPTIONS.SOURCE.IMPORT;

  const sourcePriceColumn = isImport
    ? createProductCurrencyColumn("importPrice", difficulty, (row, diff) =>
        getImportPrice(
          row.wholesalePrice,
          diff as Difficulty,
          tablePriceIndex as number,
        ),
      )
    : createProductCurrencyColumn("manufacturePrice", difficulty, (row, diff) =>
        getManufacturePrice(row, diff as Difficulty),
      );

  const salePriceColumn = isExport
    ? createProductCurrencyColumn("exportPrice", difficulty, (row, diff) =>
        getExportPrice(
          row.wholesalePrice,
          diff as Difficulty,
          tablePriceIndex as number,
        ),
      )
    : createProductCurrencyColumn("retailPrice", difficulty, (row) =>
        getAverageRetailPrice(row),
      );

  return [
    createTranslatedColumn("itemName", "products"),
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
            if (!difficulty || !displayPrices || !tablePriceIndex)
              return -Infinity;
            return getProfitMarginForProduct(
              row,
              difficulty,
              tablePriceIndex,
              displayPrices,
            ).margin;
          },
          sortingFn: (rowA, rowB) => {
            if (!difficulty || !displayPrices || !tablePriceIndex) return 0;

            const a = getProfitMarginForProduct(
              rowA.original,
              difficulty,
              tablePriceIndex,
              displayPrices,
            ).margin;

            const b = getProfitMarginForProduct(
              rowB.original,
              difficulty,
              tablePriceIndex,
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
            if (!difficulty || !displayPrices || !tablePriceIndex) {
              return <Spinner />;
            }
            const { margin } = getProfitMarginForProduct(
              row.original,
              difficulty,
              tablePriceIndex,
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
            if (!difficulty || !displayPrices || !tablePriceIndex)
              return -Infinity;
            return getProfitMarginForProduct(
              row,
              difficulty,
              tablePriceIndex,
              displayPrices,
            ).marginPercent;
          },
          sortingFn: (rowA, rowB) => {
            if (!difficulty || !displayPrices || !tablePriceIndex) return 0;

            const a = getProfitMarginForProduct(
              rowA.original,
              difficulty,
              tablePriceIndex,
              displayPrices,
            ).marginPercent;

            const b = getProfitMarginForProduct(
              rowB.original,
              difficulty,
              tablePriceIndex,
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
            if (!difficulty || !displayPrices || !tablePriceIndex)
              return <Spinner />;
            const { marginPercent } = getProfitMarginForProduct(
              row.original,
              difficulty,
              tablePriceIndex,
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
    {
      id: "profitPerHour",
      accessorFn: (row) => {
        if (!difficulty || !displayPrices || !tablePriceIndex) return -Infinity;
        return getProfitPerHourForProduct(
          row,
          difficulty,
          tablePriceIndex,
          displayPrices,
        );
      },
      sortingFn: (rowA, rowB) => {
        if (!difficulty || !displayPrices || !tablePriceIndex) return 0;

        const a = getProfitPerHourForProduct(
          rowA.original,
          difficulty,
          tablePriceIndex,
          displayPrices,
        );

        const b = getProfitPerHourForProduct(
          rowB.original,
          difficulty,
          tablePriceIndex,
          displayPrices,
        );

        return a - b;
      },
      header: ({ column, table }) => {
        const { t } = getMeta(table);

        return (
          <TableHeadContent column={column} align="end">
            {t("tableColumns.profitPerHour")}
          </TableHeadContent>
        );
      },
      cell: ({ row }) => {
        if (!difficulty || !displayPrices || !tablePriceIndex)
          return <Spinner />;
        const profitPerHour = getProfitPerHourForProduct(
          row.original,
          difficulty,
          tablePriceIndex,
          displayPrices,
        );
        return (
          <span
            className={`amount ${profitPerHour >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {formatToUSD(profitPerHour)}
          </span>
        );
      },
      meta: {
        align: "right",
      },
    },
    createImportersColumn(),
    createNumericColumn("amountPerBox"),
    createNumericColumn("productionRate"),
    {
      accessorKey: "ingredients",
      enableSorting: false,
      header: ({ column, table }) => {
        const { t } = getMeta(table);
        return (
          <TableHeadContent column={column}>
            {t("tableColumns.ingredients")}
          </TableHeadContent>
        );
      },
      cell: ({ row, table }) => {
        const { t } = getMeta(table);
        return <IngredientsCell ingredients={row.original.ingredients} t={t} />;
      },
    },
  ];
};
