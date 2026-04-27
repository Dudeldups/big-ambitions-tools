"use client";

import { ingredients } from "@/lib/game/ingredients";
import { DataTable } from "../../../../components/tables/data-table";
import { ingredientsColumns } from "./table-columns";
import { useAppState } from "@/lib/hooks/useAppState";
import { useTranslations } from "next-intl";
import DefaultHgroup from "@/components/deco/default-hgroup";

const data = Object.entries(ingredients).map(([itemName, ingredient]) => ({
  itemName,
  ...ingredient,
}));

export default function IngredientsPage() {
  const difficulty = useAppState((state) => state.difficulty);
  const t = useTranslations();

  return (
    <>
      <DefaultHgroup
        title={t("general.ingredients")}
        caption={t("database.ingredients.caption")}
      />

      <DataTable
        columns={ingredientsColumns(t, difficulty)}
        data={data}
        className="max-w-max"
      />
    </>
  );
}
