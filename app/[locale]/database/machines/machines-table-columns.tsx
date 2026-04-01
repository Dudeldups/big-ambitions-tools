"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  createCurrencyColumn,
  createTranslatedColumn,
} from "@/components/tables/shared-table-columns";
import { Machine } from "@/lib/game/machines";
import { Translator } from "@/lib/types";

type MachinesColumnData = Machine & {
  itemName: string;
};

export const machinesColumns = (
  t: Translator,
): ColumnDef<MachinesColumnData>[] => [
  createTranslatedColumn(t, "itemName", "machines"),
  createCurrencyColumn("purchasePrice"),
];
