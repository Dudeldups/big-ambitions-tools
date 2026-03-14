"use client";

import TableHeaderContent from "@/components/tables/table-header-content";
import { getMeta } from "@/lib/utils/getMeta";
import { translateCell } from "@/lib/utils/translateCell";
import { currencyCell } from "@/lib/utils/currencyCell";
import { Column, ColumnDef, Table } from "@tanstack/react-table";

export const createTranslatedColumn = <T, K extends keyof T>(
  accessorKey: K,
  translationKeyPrefix: string,
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
});

export const createCurrencyColumn = <T, K extends keyof T>(
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
  cell: currencyCell(),
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
