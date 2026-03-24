"use client";

import { ingredients } from "@/lib/game/ingredients";
import { DataTable } from "../../../../components/tables/data-table";
import { ingredientsColumns } from "./table-columns";
import { useAppState } from "@/lib/hooks/useAppState";

const data = Object.entries(ingredients).map(([itemName, ingredient]) => ({
  itemName,
  ...ingredient,
}));

export default function IngredientsPage() {
  const difficulty = useAppState((state) => state.difficulty);

  return (
    <div className="mx-auto py-10">
      <DataTable columns={ingredientsColumns(difficulty)} data={data} />
    </div>
  );
}
