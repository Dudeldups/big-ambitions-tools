"use client";

import { DataTable } from "@/components/tables/data-table";
import { VehicleName } from "@/lib/game/vehicleNames";
import { vehicles } from "@/lib/game/vehicles";
import { VehiclesColumnData, vehiclesColumns } from "./table-columns";
import DefaultHgroup from "@/components/deco/default-hgroup";
import { useRichDefaults } from "@/lib/hooks/useRichDefaults";

const data: VehiclesColumnData[] = (Object.keys(vehicles) as VehicleName[]).map(
  (vehicleName) => ({
    ...vehicles[vehicleName],
    itemName: vehicleName,
  }),
);

export default function VehiclesPage() {
  const { t, rich } = useRichDefaults();

  return (
    <>
      <DefaultHgroup
        title={t("general.vehicles")}
        caption={rich("database.vehicles.caption")}
      />

      <DataTable
        columns={vehiclesColumns(t)}
        data={data}
        className="max-w-max"
      />
    </>
  );
}
