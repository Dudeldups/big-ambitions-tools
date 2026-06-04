"use client";

import { DataTable } from "../../../../components/tables/data-table";
import { inventoryColumns } from "./table-columns";
import { useTranslations } from "next-intl";
import DefaultHgroup from "@/components/deco/default-hgroup";
import { useAppState } from "@/lib/hooks/useAppState";
import { getGameData } from "@/lib/game/registry";
import { DataTableSkeleton } from "@/components/cemetery/data-table-skeleton";

export default function InventoryPage() {
  const t = useTranslations();
  const gameVersion = useAppState((state) => state.gameVersion);
  const shelves = gameVersion ? getGameData(gameVersion).shelves : undefined;

  const data = !shelves
    ? []
    : Object.entries(shelves).flatMap(([itemName, shelf]) =>
        shelf ? [{ itemName, ...shelf }] : [],
      );

  return (
    <>
      <DefaultHgroup
        title={t("general.inventory")}
        caption={t("database.inventory.caption")}
      />

      {gameVersion ? (
        <DataTable
          columns={inventoryColumns(t)}
          data={data}
          className="max-w-max"
        />
      ) : (
        <DataTableSkeleton className="max-w-max" columnCount={3} rowCount={6} />
      )}
    </>
  );
}
