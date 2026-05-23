"use client";

import TableHeadContent from "@/components/tables/table-head-content";
import { getMeta } from "@/lib/utils/getMeta";
import { currencyCell } from "@/lib/utils/currencyCell";
import { Column, ColumnDef, Table } from "@tanstack/react-table";
import { Difficulty, GameData, StoreDifficulty } from "@/lib/game/types";
import { Importer } from "@/lib/game/importerNames";
import { Check, X } from "lucide-react";
import { ProductsColumnData } from "@/app/[locale]/database/products/table-columns";
import { DisplayPrices } from "@/lib/stores/appStore";
import { DISPLAY_PRICE_OPTIONS } from "@/lib/constants";
import {
  getAverageRetailPrice,
  getExportPrice,
  getImportPrice,
  getManufacturePrice,
} from "@/lib/calculations/math";
import { Translator } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";

export const createTranslatedColumn = <T, K extends keyof T>(
  t: Translator,
  accessorKey: K,
  translationKeyPrefix: string,
  { enableHiding = true, enableSorting = true } = {},
): ColumnDef<T> => ({
  id: String(accessorKey),
  accessorKey,
  accessorFn: (row) => t(`${translationKeyPrefix}.${String(row[accessorKey])}`),
  header: ({ column }) => {
    const translationString =
      translationKeyPrefix === "vehicles"
        ? "tableColumns.vehicleName"
        : `tableColumns.${String(accessorKey)}`;

    return (
      <TableHeadContent column={column} align="start">
        {t(translationString)}
      </TableHeadContent>
    );
  },
  enableHiding: !enableHiding
    ? false
    : accessorKey === "itemName"
      ? false
      : true,
  enableSorting,
});

export const createColumnWithImage = <T extends { itemName: string }>(
  t: Translator,
  accessorKey: keyof T,
  translationKeyPrefix: string,
  { enableHiding = true, enableSorting = true } = {},
): ColumnDef<T> => ({
  id: String(accessorKey),
  accessorKey,

  accessorFn: (row) => t(`${translationKeyPrefix}.${String(row[accessorKey])}`),

  header: ({ column }) => {
    const translationString =
      translationKeyPrefix === "vehicles"
        ? "tableColumns.vehicleName"
        : `tableColumns.${String(accessorKey)}`;

    return (
      <TableHeadContent column={column} align="start">
        {t(translationString)}
      </TableHeadContent>
    );
  },

  cell: ({ row, getValue }) => {
    const itemName = row.original.itemName;
    const translatedValue = getValue<string>();

    return (
      <div className="flex items-center gap-2">
        <Image
          src={`/assets/gameImages/${itemName}.png`}
          alt={itemName}
          width={24}
          height={24}
          className="object-contain"
        />
        <span>{translatedValue}</span>
      </div>
    );
  },

  enableHiding: !enableHiding
    ? false
    : accessorKey === "itemName"
      ? false
      : true,

  enableSorting,
});

export const createCurrencyColumn = <T, K extends keyof T | string>(
  accessorKey: K,
  difficulty?: StoreDifficulty,
  priceGetter?: (row: T, difficulty: StoreDifficulty) => number,
): ColumnDef<T> => ({
  id: String(accessorKey),
  accessorKey: accessorKey as keyof T,
  header: ({
    column,
    table,
  }: {
    column: Column<T, unknown>;
    table: Table<T>;
  }) => {
    const { t } = getMeta(table);
    return (
      <TableHeadContent column={column} align="end">
        {t(`tableColumns.${String(accessorKey)}`)}
      </TableHeadContent>
    );
  },
  cell: !priceGetter
    ? currencyCell((row) => row[accessorKey as keyof T] as number)
    : !difficulty
      ? () => <Skeleton className="ml-auto h-5 w-[6ch]" />
      : currencyCell(priceGetter),
  sortingFn:
    priceGetter && difficulty
      ? (rowA, rowB) => {
          const a = priceGetter(rowA.original, difficulty);
          const b = priceGetter(rowB.original, difficulty);
          return a - b;
        }
      : "auto",
  meta: {
    align: "right",
  },
});

export const createProductCurrencyColumn = (
  accessorKey: string,
  difficulty: StoreDifficulty | undefined,
  priceGetter?: (
    row: ProductsColumnData,
    difficulty: StoreDifficulty,
  ) => number,
) =>
  createCurrencyColumn<ProductsColumnData, string>(
    accessorKey,
    difficulty,
    priceGetter,
  );

export const createNumericColumn = <T, K extends keyof T>(
  accessorKey: K,
): ColumnDef<T> => ({
  id: String(accessorKey),
  accessorKey,
  header: ({
    column,
    table,
  }: {
    column: Column<T, unknown>;
    table: Table<T>;
  }) => {
    const { t } = getMeta(table);
    return (
      <TableHeadContent column={column} align="end">
        {t(`tableColumns.${String(accessorKey)}`)}
      </TableHeadContent>
    );
  },
  meta: {
    align: "right",
  },
});

export const createSourcePriceColumn = (
  difficulty: StoreDifficulty | undefined,
  displayPrices: DisplayPrices | null,
  tablePriceIndex: number | null,
  gameData?: GameData,
) => {
  const isImport =
    displayPrices?.source === DISPLAY_PRICE_OPTIONS.SOURCE.IMPORT;

  if (!isImport && !gameData) {
    return createProductCurrencyColumn("manufacturePrice", undefined);
  }

  const manufactureGameData = gameData;

  return isImport
    ? createProductCurrencyColumn("importPrice", difficulty, (row, diff) =>
        getImportPrice(
          row.wholesalePrice,
          diff as Difficulty,
          tablePriceIndex as number,
        ),
      )
    : createProductCurrencyColumn("manufacturePrice", difficulty, (row, diff) =>
        getManufacturePrice(row, diff as Difficulty, manufactureGameData!),
      );
};

export const createSalePriceColumn = (
  difficulty: StoreDifficulty | undefined,
  displayPrices: DisplayPrices | null,
  tablePriceIndex: number | null,
) => {
  const isExport =
    displayPrices?.target === DISPLAY_PRICE_OPTIONS.TARGET.EXPORT;

  return isExport
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
};

type WithImporters = {
  importers?: Importer[];
};

export const createImportersColumn = <
  T extends WithImporters,
>(): ColumnDef<T> => ({
  id: "importers",
  accessorKey: "importers",
  header: ({
    column,
    table,
  }: {
    column: Column<T, unknown>;
    table: Table<T>;
  }) => {
    const { t } = getMeta(table);
    return (
      <TableHeadContent column={column}>
        {t(`tableColumns.importers`)}
      </TableHeadContent>
    );
  },
  cell: ({ getValue, table }) => {
    const importers = getValue() as string[];
    const { t } = getMeta(table);

    if (!importers?.length) {
      return "-";
    }

    if (importers.length === 1) {
      return t(`importers.${importers[0]}`);
    }

    return (
      <ul>
        {importers.map((importer, index) => (
          <li className="not-first:pt-1" key={index}>
            {t(`importers.${importer}`)}
          </li>
        ))}
      </ul>
    );
  },
});

export const createBooleanColumn = <T, K extends keyof T>(
  accessorKey: K,
): ColumnDef<T> => ({
  id: String(accessorKey),
  accessorKey,
  header: ({
    column,
    table,
  }: {
    column: Column<T, unknown>;
    table: Table<T>;
  }) => {
    const { t } = getMeta(table);

    return (
      <TableHeadContent column={column} align="center">
        {t(`tableColumns.${String(accessorKey)}`)}
      </TableHeadContent>
    );
  },
  cell: ({ getValue }) => {
    const value = getValue() as boolean;

    return (
      <div className="flex justify-center">
        {value ? (
          <Check className="text-success" />
        ) : (
          <X className="text-destructive" />
        )}
      </div>
    );
  },
  meta: {
    align: "center",
  },
});
