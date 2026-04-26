"use client";

import { ingredients } from "@/lib/game/ingredients";
import { DataTable } from "../../../../components/tables/data-table";
import { ingredientsColumns } from "./table-columns";
import { useAppState } from "@/lib/hooks/useAppState";
import { useTranslations } from "next-intl";

const data = Object.entries(ingredients).map(([itemName, ingredient]) => ({
  itemName,
  ...ingredient,
}));

export default function IngredientsPage() {
  const difficulty = useAppState((state) => state.difficulty);
  const t = useTranslations();

  return (
    <>
      <hgroup>
        <h2>{t("general.ingredients")}</h2>
        <p>{t("database.ingredients.caption")}</p>
      </hgroup>

      <DataTable
        columns={ingredientsColumns(t, difficulty)}
        data={data}
        className="max-w-4xl"
      />
    </>
  );
}
