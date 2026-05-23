"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  createColumnWithImage,
  createCurrencyColumn,
  createImportersColumn,
  createNumericColumn,
} from "@/components/tables/shared-table-columns";
import { Difficulty, Ingredient } from "@/lib/game/types";
import { getImportPrice } from "@/lib/calculations/math";
import { Translator } from "@/lib/types";

type IngredientsColumnData = Ingredient & {
  itemName: string;
};

export const ingredientsColumns = (
  t: Translator,
  difficulty: Difficulty | null,
): ColumnDef<IngredientsColumnData>[] => [
  createColumnWithImage(t, "itemName", "ingredients"),
  createNumericColumn("amountPerBox"),
  createCurrencyColumn("importPrice", difficulty, (row, diff) =>
    getImportPrice(row.wholesalePrice, diff as Difficulty),
  ),
  createImportersColumn(),
];
