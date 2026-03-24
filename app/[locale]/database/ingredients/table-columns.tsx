"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  createCurrencyColumn,
  createImportersColumn,
  createNumericColumn,
  createTranslatedColumn,
} from "@/components/tables/shared-table-columns";
import { Ingredient } from "@/lib/game/ingredients";
import { Difficulty } from "@/lib/game/types";

type IngredientsColumnData = Ingredient & {
  itemName: string;
};

export const ingredientsColumns = (
  difficulty: Difficulty | null,
): ColumnDef<IngredientsColumnData>[] => [
  createTranslatedColumn("itemName", "ingredients"),
  createNumericColumn("amountPerBox"),
  createCurrencyColumn("importPrice", difficulty),
  createImportersColumn(),
];
