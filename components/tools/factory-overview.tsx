"use client";

import {
  deriveVehicleCost,
  deriveWorkstationCost,
} from "@/lib/calculations/derivedFactoryData";
import { DeepPartial } from "@/lib/game/types";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { formatToUSD } from "@/lib/utils/formatToUSD";
import InfoTable from "../tables/info-table";
import { useTranslations } from "next-intl";
import { Separator } from "../ui/separator";

type FactoryOverviewProps = {
  values: DeepPartial<FactoryFormValues>;
};

const FactoryOverview = ({ values }: FactoryOverviewProps) => {
  const t = useTranslations();

  const workstationRows =
    values.workstations
      ?.map((ws) => ({
        name: ws?.name ?? "",
        cost: deriveWorkstationCost(ws?.name),
      }))
      .filter((ws) => ws.name !== "") ?? [];

  const totalWorkstationCost = workstationRows.reduce(
    (sum, row) => sum + row.cost,
    0,
  );

  const vehicleRows = [values.vehicle1, values.vehicle2]
    .map((v) => ({
      name: v ?? "",
      cost: deriveVehicleCost(v),
    }))
    .filter((v) => v.name !== "");

  const totalVehicleCost = vehicleRows.reduce((sum, row) => sum + row.cost, 0);

  const totalOneTimeCost = totalWorkstationCost + totalVehicleCost;

  return (
    <div className="space-y-4">
      <InfoTable
        headers={["workstation", "purchasePrice"]}
        rows={workstationRows.map((ws) => ({
          label: t(`workstations.${ws.name}`),
          value: formatToUSD(ws.cost),
        }))}
        total={formatToUSD(totalWorkstationCost)}
      />

      <Separator />

      <InfoTable
        headers={["vehicleName", "purchasePrice"]}
        rows={vehicleRows.map((v) => ({
          label: t(`vehicles.${v.name}`),
          value: formatToUSD(v.cost),
        }))}
        total={formatToUSD(totalVehicleCost)}
      />

      <Separator />

      <div className="bg-card flex justify-between rounded-md border p-2">
        <p className="font-semibold">Total one-time costs</p>
        <p className="amount font-semibold underline">
          {formatToUSD(totalOneTimeCost)}
        </p>
      </div>
    </div>
  );
};

export default FactoryOverview;
