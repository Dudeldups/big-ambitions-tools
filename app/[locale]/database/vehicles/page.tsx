"use client";

import { DataTable } from "@/components/tables/data-table";
import { VehicleName } from "@/lib/game/vehicleNames";
import { VehiclesColumnData, vehiclesColumns } from "./table-columns";
import DefaultHgroup from "@/components/deco/default-hgroup";
import { useRichDefaults } from "@/lib/hooks/useRichDefaults";
import { useAppState } from "@/lib/hooks/useAppState";
import { getGameData } from "@/lib/game/registry";
import { DataTableSkeleton } from "@/components/cemetery/data-table-skeleton";

export default function VehiclesPage() {
  const { t, rich } = useRichDefaults();
  const gameVersion = useAppState((state) => state.gameVersion);
  const vehicles = gameVersion ? getGameData(gameVersion).vehicles : undefined;

  const data: VehiclesColumnData[] = !vehicles
    ? []
    : (Object.keys(vehicles) as VehicleName[]).flatMap((vehicleName) => {
        const vehicle = vehicles[vehicleName];
        return vehicle ? [{ ...vehicle, itemName: vehicleName }] : [];
      });

  return (
    <>
      <DefaultHgroup
        title={t("general.vehicles")}
        caption={rich("database.vehicles.caption")}
      />

      {gameVersion ? (
        <DataTable
          columns={vehiclesColumns(t)}
          data={data}
          className="max-w-max"
        />
      ) : (
        <DataTableSkeleton
          className="max-w-max"
          columnCount={10}
          rowCount={8}
        />
      )}
    </>
  );
}
