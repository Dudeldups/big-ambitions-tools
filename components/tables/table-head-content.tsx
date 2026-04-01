"use client";

import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

type Props<TData, TValue> = {
  column: Column<TData, TValue>;
  align?: "start" | "center" | "end";
  children: React.ReactNode;
};

const TableHeadContent = <TData, TValue>({
  column,
  align = "start",
  children,
}: Props<TData, TValue>) => {
  const isSorted = column.getIsSorted();
  const canSort = column.getCanSort();
  const isDescFirstColumn = column.columnDef.sortDescFirst;

  const className = `flex justify-${align} w-full px-2 py-0`;

  if (!canSort) {
    return <span className={cn(className)}>{children}</span>;
  }

  return (
    <Button
      variant="ghost"
      className={cn(className)}
      onClick={() => {
        if (isSorted === false) {
          column.toggleSorting(isDescFirstColumn ?? false);
        } else {
          column.toggleSorting(isSorted === "asc");
        }
      }}
    >
      {children}
      {isSorted === "asc" ? (
        <ArrowUpNarrowWide />
      ) : isSorted === "desc" ? (
        <ArrowDownWideNarrow />
      ) : null}
    </Button>
  );
};

export default TableHeadContent;
