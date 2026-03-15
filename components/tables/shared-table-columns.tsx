"use client";

import TableHeaderContent from "@/components/tables/table-header-content";
import { getMeta } from "@/lib/utils/getMeta";
import { translateCell } from "@/lib/utils/translateCell";
import { currencyCell } from "@/lib/utils/currencyCell";
import { Column, ColumnDef, Table } from "@tanstack/react-table";
import { Difficulty, Price } from "@/lib/game/types";

export const createTranslatedColumn = <T, K extends keyof T>(
  accessorKey: K,
  translationKeyPrefix: string,
  { enableHiding = true, enableSorting = true } = {},
): ColumnDef<T> => ({
  accessorKey,
  header: ({ column, table }) => {
    const { t } = getMeta(table);

    return (
      <TableHeaderContent column={column} align="start">
        {t(`general.tableColumns.${String(accessorKey)}`)}
      </TableHeaderContent>
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

export const createCurrencyColumn = <T, K extends keyof T>(
  accessorKey: K,
  difficulty?: Difficulty,
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
      <TableHeaderContent column={column} align="end">
        {t(`general.tableColumns.${String(accessorKey)}`)}
      </TableHeaderContent>
    );
  },
  cell: currencyCell(),
  sortingFn: (rowA, rowB, columnId) => {
    const valueA = rowA.getValue(columnId) as Price | number;
    const valueB = rowB.getValue(columnId) as Price | number;
    const numberA = typeof valueA === "number" ? valueA : valueA[difficulty!];
    const numberB = typeof valueB === "number" ? valueB : valueB[difficulty!];
    return numberA - numberB;
  },
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
      <TableHeaderContent column={column} align="end">
        {t(`general.tableColumns.${String(accessorKey)}`)}
      </TableHeaderContent>
    );
  },
  meta: {
    align: "right",
  },
});

export const createImportersColumn = <
  T,
  K extends keyof T,
>(): ColumnDef<T> => ({
  accessorKey: "importers" as K,
  header: ({
    column,
    table,
  }: {
    column: Column<T, unknown>;
    table: Table<T>;
  }) => {
    const { t } = getMeta(table);
    return (
      <TableHeaderContent column={column}>
        {t(`general.tableColumns.importers`)}
      </TableHeaderContent>
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
