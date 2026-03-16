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
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useAppStore } from "@/lib/stores/appStore";
import { Label } from "../ui/label";
import { usePathname } from "@/i18n/navigation";
import ColumnSelector from "./column-selector";
import DifficultyButtonGroup from "./difficulty-button-group";

interface DataTableProps<TData, TValue> {
  className?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  renderRow?: (
    row: Row<TData>,
    t: ReturnType<typeof useTranslations>,
  ) => React.ReactNode;
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
  const difficulty = useAppStore((state) => state.difficulty);

  const pathname = usePathname();
  const hasDifficultySelector =
    pathname === "/database/ingredients" || pathname === "/database/products";

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

  return (
    <div className={`mx-auto w-full ${className}`}>
      <div className="flex items-center py-4">
        <form className="mr-auto">
          <Label htmlFor="search" className="sr-only">
            {t("general.filterResults")}
          </Label>
          <Input
            placeholder={t("general.filterResults")}
            value={
              (table.getColumn("itemName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("itemName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </form>

        {hasDifficultySelector && <DifficultyButtonGroup className="mr-6" />}

        <ColumnSelector table={table} />
      </div>

      <div className="rounded-md border max-lg:overflow-x-hidden">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className={`p-0 ${header.column.columnDef.meta?.align === "right" ? "justify-end" : ""}`}
                      scope="col"
                      key={header.id}
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
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`${
                          cell.column.columnDef.meta?.align === "right"
                            ? "text-right"
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
