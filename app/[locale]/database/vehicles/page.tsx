"use client";

import { DataTable } from "@/components/tables/data-table";
import { VehicleName } from "@/lib/game/vehicleNames";
import { vehicles } from "@/lib/game/vehicles";
import { VehiclesColumnData, vehiclesColumns } from "./table-columns";

const data: VehiclesColumnData[] = (Object.keys(vehicles) as VehicleName[]).map(
  (vehicleName) => ({
    ...vehicles[vehicleName],
    itemName: vehicleName,
  }),
);

export default function VehiclesPage() {
  return (
    <div className="mx-auto py-10">
      <DataTable columns={vehiclesColumns} data={data} />
    </div>
  );
}
