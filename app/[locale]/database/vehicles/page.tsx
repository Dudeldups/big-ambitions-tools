"use client";

import { DataTable } from "@/components/tables/data-table";
import { VehicleName } from "@/lib/game/vehicleNames";
import { vehicles } from "@/lib/game/vehicles";
import { VehiclesColumnData, vehiclesColumns } from "./table-columns";
import { useTranslations } from "next-intl";
import DatabaseHgroup from "@/components/deco/database-hgroup";

const data: VehiclesColumnData[] = (Object.keys(vehicles) as VehicleName[]).map(
  (vehicleName) => ({
    ...vehicles[vehicleName],
    itemName: vehicleName,
  }),
);

export default function VehiclesPage() {
  const t = useTranslations();

  return (
    <>
      <DatabaseHgroup
        title={t("general.vehicles")}
        caption={t("database.vehicles.caption")}
      />

      <DataTable
        columns={vehiclesColumns(t)}
        data={data}
        className="max-w-max"
      />
    </>
  );
}
