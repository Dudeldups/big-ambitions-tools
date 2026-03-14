"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Shelf } from "@/lib/game/inventory";
import {
  createCurrencyColumn,
  createNumericColumn,
  createTranslatedColumn,
} from "@/components/tables/shared-table-columns";

type InventoryColumnData = Shelf & {
  itemName: string;
};

export const columns: ColumnDef<InventoryColumnData>[] = [
  createTranslatedColumn("itemName", "inventory"),
  createCurrencyColumn("purchasePrice"),
  createNumericColumn("storageCapacity"),
];
