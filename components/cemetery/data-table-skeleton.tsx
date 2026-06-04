"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type DataTableSkeletonProps = {
  className?: string;
  columnCount?: number;
  rowCount?: number;
};

export function DataTableSkeleton({
  className,
  columnCount = 5,
  rowCount = 8,
}: DataTableSkeletonProps) {
  return (
    <div className={cn("mx-auto", className)}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-8 w-28" />
      </div>

      <div className="rounded-md border">
        <Table className="border-separate border-spacing-0">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {Array.from({ length: columnCount }).map((_, index) => (
                <TableHead key={index} className="p-3">
                  <Skeleton className="h-5 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="odd:bg-card even:bg-background hover:bg-transparent"
              >
                {Array.from({ length: columnCount }).map((_, columnIndex) => (
                  <TableCell key={columnIndex} className="align-top">
                    <Skeleton
                      className={cn(
                        "h-5",
                        columnIndex === 0 ? "w-36" : "ml-auto w-16",
                      )}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
