"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  createColumnWithImage,
  createCurrencyColumn,
} from "@/components/tables/shared-table-columns";
import { Machine } from "@/lib/game/types";
import { Translator } from "@/lib/types";

type MachinesColumnData = Machine & {
  itemName: string;
};

export const machinesColumns = (
  t: Translator,
): ColumnDef<MachinesColumnData>[] => [
  createColumnWithImage(t, "itemName", "machines"),
  createCurrencyColumn("purchasePrice"),
];
