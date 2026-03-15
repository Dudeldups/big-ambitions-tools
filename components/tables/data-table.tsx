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
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useAppStore } from "@/lib/store/app-store";
import { ButtonGroup } from "../ui/button-group";
import { Label } from "../ui/label";
import { usePathname } from "@/i18n/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "itemName", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const difficulty = useAppStore((state) => state.difficulty);
  const setDifficulty = useAppStore((state) => state.setDifficulty);

  const pathname = usePathname();
  const hasDifficultySelector =
    pathname === "/database/ingredients" || pathname === "/database/products";

  const t = useTranslations();
  const tGeneral = useTranslations("general");

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
    <>
      <div className="flex items-center py-4">
        <form className="mr-auto">
          <Label htmlFor="search" className="sr-only">
            {tGeneral("filterResults")}
          </Label>
          <Input
            placeholder={tGeneral("filterResults")}
            value={
              (table.getColumn("itemName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("itemName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </form>

        {hasDifficultySelector && (
          <ButtonGroup className="">
            <Button
              variant={difficulty === "easy" ? "secondary" : "outline"}
              onClick={() => setDifficulty("easy")}
            >
              Easy
            </Button>
            <Button
              variant={difficulty === "normal" ? "secondary" : "outline"}
              onClick={() => setDifficulty("normal")}
            >
              Normal
            </Button>
            <Button
              variant={difficulty === "hard" ? "secondary" : "outline"}
              onClick={() => setDifficulty("hard")}
            >
              Hard
            </Button>
          </ButtonGroup>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-6">
              {tGeneral("columnsDescription")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {tGeneral(`tableColumns.${column.id}`)}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border max-lg:overflow-x-hidden">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="p-0" scope="col" key={header.id}>
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
              table.getRowModel().rows.map((row) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {tGeneral("noResultsFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
