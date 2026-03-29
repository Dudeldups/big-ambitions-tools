"use client";

import {
  deriveEmployeeCost,
  deriveIngredientCostsOfProduct,
  derivePalletShelfData,
  deriveVehicleCost,
  deriveWorkstationCost,
} from "@/lib/calculations/derivedFactoryData";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { formatToUSD } from "@/lib/utils/formatToUSD";
import InfoTable from "../tables/info-table";
import { useTranslations } from "next-intl";
import { Separator } from "../ui/separator";
import { EmployeeName } from "@/lib/game/employeeNames";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";

type FactoryOverviewProps = {
  values: FactoryFormValues;
};

const FactoryOverview = ({ values }: FactoryOverviewProps) => {
  const t = useTranslations();
  const { difficulty } = useActivePlaythrough().activePlaythrough;

  const workstationRows = values.workstations?.map((ws) => ({
    name: ws?.name ?? "",
    cost: deriveWorkstationCost(ws?.name),
  }));

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

  const oneTimeCostRowData = [...derivePalletShelfData(values)];

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

        <InfoTable
          label="itemName"
          total={formatToUSD(totalOneTimeCost)}
          rows={oneTimeCostRowData}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-center font-semibold">Recurring weekly costs</h2>
      </div>
    </div>
  );
};

export default FactoryOverview;
