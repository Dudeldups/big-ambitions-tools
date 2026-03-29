"use client";

import {
  deriveEmployeeCost,
  deriveIngredientCostsOfProduct,
  deriveVehicleCost,
  deriveWorkstationCost,
} from "@/lib/calculations/derivedFactoryData";
import { DeepPartial } from "@/lib/game/types";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { formatToUSD } from "@/lib/utils/formatToUSD";
import InfoTable from "../tables/info-table";
import { useTranslations } from "next-intl";
import { Separator } from "../ui/separator";
import { EmployeeName } from "@/lib/game/employeeNames";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";

type FactoryOverviewProps = {
  values: DeepPartial<FactoryFormValues>;
};

const FactoryOverview = ({ values }: FactoryOverviewProps) => {
  const t = useTranslations();
  const { difficulty } = useActivePlaythrough().activePlaythrough;

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

  const employeeRows = Object.entries(values.employees ?? {})
    .filter(([, data]) => (data?.amount ?? 0) > 0)
    .map(([key, { amount = 0 }]) => {
      const employeeName = key as EmployeeName;

      return {
        name: employeeName,
        amount,
        cost: amount * deriveEmployeeCost(employeeName, values),
      };
    });

  const totalEmployeeCost = employeeRows.reduce(
    (sum, row) => sum + row.cost,
    0,
  );

  const ingredientRows = (values.workstations ?? []).flatMap((machine) =>
    machine?.product
      ? deriveIngredientCostsOfProduct(
          machine.product,
          values.openingHours,
          difficulty,
        )
      : [],
  );

  const totalIngredientCost = ingredientRows.reduce(
    (sum, row) => sum + row.cost,
    0,
  );

  const totalRecurringCost = totalEmployeeCost + totalIngredientCost;

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-center font-semibold">One-time costs</h2>

        {workstationRows.length > 0 && (
          <>
            <InfoTable
              headers={["workstation", "purchasePrice"]}
              rows={workstationRows.map((ws) => ({
                label: t(`workstations.${ws.name}`),
                value: formatToUSD(ws.cost),
              }))}
              total={formatToUSD(totalWorkstationCost)}
            />

            <Separator />
          </>
        )}

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

      <div className="space-y-4">
        <h2 className="text-center font-semibold">Recurring weekly costs</h2>
        <InfoTable
          headers={["employees", "purchasePrice"]}
          rows={employeeRows.map((e) => ({
            label: `${e.amount}x ${t(`employees.${e.name}`)}`,
            value: formatToUSD(e.cost),
          }))}
          total={formatToUSD(totalEmployeeCost)}
        />

        <Separator />

        <InfoTable
          headers={["ingredients", "purchasePrice"]}
          rows={ingredientRows.map((i) => ({
            label: `${i.amount}x ${t(`ingredients.${i.name}`)}`,
            value: formatToUSD(i.cost),
          }))}
          total={formatToUSD(totalIngredientCost)}
        />

        <Separator />

        <div className="bg-card flex justify-between rounded-md border p-2">
          <p className="font-semibold">Total recurring costs / week</p>
          <p className="amount font-semibold underline">
            {formatToUSD(totalRecurringCost)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FactoryOverview;
