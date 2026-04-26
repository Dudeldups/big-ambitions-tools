"use client";

import { DataTable } from "@/components/tables/data-table";
import { VehicleName } from "@/lib/game/vehicleNames";
import { vehicles } from "@/lib/game/vehicles";
import { VehiclesColumnData, vehiclesColumns } from "./table-columns";
import { useTranslations } from "next-intl";

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
      <hgroup>
        <h2>{t("general.vehicles")}</h2>
        <p>{t("database.vehicles.caption")}</p>
      </hgroup>

      <DataTable columns={vehiclesColumns(t)} data={data} />
    </>
  );
}
