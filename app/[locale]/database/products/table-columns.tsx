"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  createColumnWithImage,
  createImportersColumn,
  createNumericColumn,
  createSalePriceColumn,
  createSourcePriceColumn,
} from "@/components/tables/shared-table-columns";
import { Product } from "@/lib/game/products";
import TableHeadContent from "@/components/tables/table-head-content";
import { getMeta } from "@/lib/utils/getMeta";
import { GameData, StoreDifficulty } from "@/lib/game/types";
import { DisplayPrices } from "@/lib/stores/appStore";
import IngredientsCell from "@/components/tables/ingredients-cell";
import { Skeleton } from "@/components/ui/skeleton";
import CurrencyText from "@/components/currency-text";
import { Translator } from "@/lib/types";
import { ProductName } from "@/lib/game/productNames";

export type ProductsColumnData = Product & {
  itemName: ProductName;
  profitPerHour: number | null;
  margin: number | undefined;
  marginPercent: number | undefined;
};

export const productsColumns = (
  t: Translator,
  difficulty: StoreDifficulty,
  displayPrices: DisplayPrices | null,
  tablePriceIndex: number | null,
  gameData?: GameData,
): ColumnDef<ProductsColumnData>[] => {
  const isManufactureMode = displayPrices?.source === "MANUFACTURE";

  const profitPerHourCol: ColumnDef<ProductsColumnData> = {
    id: "profitPerHour",
    accessorKey: "profitPerHour",
    sortDescFirst: true,
    header: ({ column, table }) => (
      <TableHeadContent column={column} align="end">
        {getMeta(table).t("tableColumns.profitPerHour")}
      </TableHeadContent>
    ),
    cell: ({ row }) => {
      const value = row.original.profitPerHour;
      if (value === null) return <Skeleton className="ml-auto h-5 w-[8ch]" />;
      return <CurrencyText value={value} />;
    },
    meta: { align: "right" },
  };

  return [
    createColumnWithImage(t, "itemName", "products"),
    createSourcePriceColumn(
      difficulty,
      displayPrices,
      tablePriceIndex,
      gameData,
    ),
    createSalePriceColumn(difficulty, displayPrices, tablePriceIndex),
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
          accessorKey: "margin",
          sortDescFirst: true,
          header: ({ column }) => (
            <TableHeadContent column={column} align="end">
              $
            </TableHeadContent>
          ),
          cell: ({ row }) => {
            const value = row.original.margin;
            if (value === null || value === undefined)
              return <Skeleton className="ml-auto h-5 w-[6ch]" />;
            return <CurrencyText value={value} />;
          },
          meta: {
            align: "right",
          },
        },
        {
          id: "marginPercent",
          accessorKey: "marginPercent",
          sortDescFirst: true,
          header: ({ column }) => (
            <TableHeadContent column={column} align="end">
              %
            </TableHeadContent>
          ),
          cell: ({ row }) => {
            const value = row.original.marginPercent;
            if (value == null)
              return <Skeleton className="ml-auto h-5 w-[5ch]" />;
            return (
              <span className="amount text-muted-foreground">
                {value.toFixed(0)}%
              </span>
            );
          },
          meta: {
            align: "right",
          },
        },
      ],
    },
    ...(isManufactureMode ? [profitPerHourCol] : []),
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
