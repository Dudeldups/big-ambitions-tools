"use client";

import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";

type Props<TData, TValue> = {
  column: Column<TData, TValue>;
  align?: "start" | "center" | "end";
  children: React.ReactNode;
};

const TableHeaderContent = <TData, TValue>({
  column,
  align,
  children,
}: Props<TData, TValue>) => {
  const isSorted = column.getIsSorted();
  const canSort = column.getCanSort();

  if (!canSort) {
    return (
      <span className={`flex justify-${align ?? "start"} w-full px-2 py-0`}>
        {children}
      </span>
    );
  }

  return (
    <Button
      variant="ghost"
      className={`flex w-full justify-${align ?? "start"} px-2 py-0`}
      onClick={() => column.toggleSorting(isSorted === "asc")}
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

export default TableHeaderContent;
