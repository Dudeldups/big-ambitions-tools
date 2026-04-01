"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Shelf } from "@/lib/game/inventory";
import {
  createCurrencyColumn,
  createNumericColumn,
  createTranslatedColumn,
} from "@/components/tables/shared-table-columns";
import { Translator } from "@/lib/types";

type InventoryColumnData = Shelf & {
  itemName: string;
};

export const inventoryColumns = (
  t: Translator,
): ColumnDef<InventoryColumnData>[] => [
  createTranslatedColumn(t, "itemName", "inventory"),
  createCurrencyColumn("purchasePrice"),
  createNumericColumn("storageCapacity"),
];
