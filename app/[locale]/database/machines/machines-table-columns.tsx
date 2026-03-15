"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  createCurrencyColumn,
  createTranslatedColumn,
} from "@/components/tables/shared-table-columns";
import { Machine } from "@/lib/game/machines";

type MachinesColumnData = Machine & {
  itemName: string;
};

export const machinesColumns: ColumnDef<MachinesColumnData>[] = [
  createTranslatedColumn("itemName", "machines"),
  createCurrencyColumn("purchasePrice"),
];
