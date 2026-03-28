"use client";

import TableHeadContent from "@/components/tables/table-head-content";
import { getMeta } from "@/lib/utils/getMeta";
import { translateCell } from "@/lib/utils/translateCell";
import { currencyCell } from "@/lib/utils/currencyCell";
import { Column, ColumnDef, Table } from "@tanstack/react-table";
import { StoreDifficulty } from "@/lib/game/types";
import { Importer } from "@/lib/game/importerNames";
import { Check, X } from "lucide-react";

export const createTranslatedColumn = <T, K extends keyof T>(
  accessorKey: K,
  translationKeyPrefix: string,
  { enableHiding = true, enableSorting = true } = {},
): ColumnDef<T> => ({
  accessorKey,
  header: ({ column, table }) => {
    const { t } = getMeta(table);
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
  cell: translateCell(translationKeyPrefix),
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
  cell: priceGetter
    ? currencyCell(priceGetter)
    : currencyCell((row) => row[accessorKey as keyof T] as number),
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

export const createNumericColumn = <T, K extends keyof T>(
  accessorKey: K,
): ColumnDef<T> => ({
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

type WithImporters = {
  importers?: Importer[];
};

export const createImportersColumn = <
  T extends WithImporters,
>(): ColumnDef<T> => ({
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
          <Check className="text-green-600" />
        ) : (
          <X className="text-red-600" />
        )}
      </div>
    );
  },
  meta: {
    align: "center",
  },
});
