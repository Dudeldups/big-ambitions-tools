"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAppState } from "@/lib/hooks/useAppState";
import { Translator } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useOverflowDetection } from "@/lib/hooks/useOverflowDetection";
import { useIsSticky } from "@/lib/hooks/useIsSticky";
import DataTableOptionsBar from "./data-table-options-bar";

interface DataTableProps<TData, TValue> {
  className?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  renderRow?: (row: Row<TData>, t: Translator) => React.ReactNode;
}

export function DataTable<TData, TValue>({
  className,
  columns,
  data,
  renderRow,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "itemName", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const difficulty = useAppState((state) => state.difficulty);

  const t = useTranslations();

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    meta: {
      t,
      difficulty,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const { overflowRef, isOverflowing } = useOverflowDetection();
  const { sentinelRef, isSticky } = useIsSticky();

  return (
    <div className={cn("mx-auto", className)}>
      <DataTableOptionsBar<TData> table={table} t={t} />

      <div ref={sentinelRef} />
      <div
        ref={overflowRef}
        className={cn("rounded-md border", isOverflowing && "overflow-x-auto")}
      >
        <Table
          className={cn(
            "border-separate border-spacing-0",
            !isOverflowing && "overflow-x-auto",
          )}
        >
          <TableHeader
            className={cn(
              "bg-transparent transition-colors duration-300",
              !isOverflowing && "sticky top-0 z-10",
              !isOverflowing && isSticky && "bg-accent-foreground",
            )}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className={cn(
                        "p-0",
                        !isOverflowing && isSticky && "text-muted",
                        header.column.columnDef.meta?.align === "right"
                          ? "justify-end"
                          : header.column.columnDef.meta?.align === "center"
                            ? "justify-center text-center"
                            : "",
                      )}
                      scope="col"
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) =>
                renderRow ? (
                  renderRow(row, t)
                ) : (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="odd:bg-card even:bg-background hover:bg-muted"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`${
                          cell.column.columnDef.meta?.align === "right"
                            ? "amount"
                            : ""
                        } align-top`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ),
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("general.noResultsFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
