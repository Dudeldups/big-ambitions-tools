"use client";

import { DataTable } from "../../../../components/tables/data-table";
import { ingredientsColumns } from "./table-columns";
import { useAppState } from "@/lib/hooks/useAppState";
import { useTranslations } from "next-intl";
import DefaultHgroup from "@/components/deco/default-hgroup";
import { getGameData } from "@/lib/game/registry";
import { DataTableSkeleton } from "@/components/cemetery/data-table-skeleton";

export default function IngredientsPage() {
  const difficulty = useAppState((state) => state.difficulty);
  const gameVersion = useAppState((state) => state.gameVersion);
  const t = useTranslations();
  const ingredients = gameVersion
    ? getGameData(gameVersion).ingredients
    : undefined;

  const data = !ingredients
    ? []
    : Object.entries(ingredients).flatMap(([itemName, ingredient]) =>
        ingredient ? [{ itemName, ...ingredient }] : [],
      );

  return (
    <>
      <DefaultHgroup
        title={t("general.ingredients")}
        caption={t("database.ingredients.caption")}
      />

      {gameVersion ? (
        <DataTable
          columns={ingredientsColumns(t, difficulty)}
          data={data}
          className="max-w-max"
        />
      ) : (
        <DataTableSkeleton className="max-w-max" columnCount={4} rowCount={8} />
      )}
    </>
  );
}
