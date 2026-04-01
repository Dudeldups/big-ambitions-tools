"use client";

import {
  deriveEmployeeData,
  deriveIngredientData,
  derivePalletShelfData,
  deriveProductData,
  deriveVehicleData,
  deriveWorkstationData,
} from "@/lib/calculations/derivedFactoryData";
import { FactoryFormValues } from "@/lib/schemas/factory";
import InfoTable from "../tables/info-table";
import { Separator } from "../ui/separator";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { formatToUSD } from "@/lib/utils/formatToUSD";
import { getTimeMultiplier } from "@/lib/utils/getTimeMultiplier";
import { useAppState } from "@/lib/hooks/useAppState";

type FactoryOverviewProps = {
  values: FactoryFormValues;
};

const FactoryOverview = ({ values }: FactoryOverviewProps) => {
  const { activePlaythrough } = useActivePlaythrough();
  const { difficulty } = activePlaythrough;
  const calculationPeriod = useAppState((s) => s.calculationPeriod) ?? "weekly";

  const oneTimeCostRowData = [
    ...derivePalletShelfData(values, calculationPeriod),
    ...deriveVehicleData(values),
    ...deriveWorkstationData(values),
  ];
  const totalOneTimeCost = oneTimeCostRowData.reduce(
    (sum, item) => sum + item.cost,
    0,
  );

  const recurringCostRowData = [
    ...deriveEmployeeData(values, calculationPeriod),
    ...deriveIngredientData(values, difficulty, calculationPeriod),
  ];
  const totalRecurringCost = recurringCostRowData.reduce(
    (sum, item) => sum + item.cost,
    0,
  );

  const profitRowData = [
    ...deriveProductData(values, difficulty, calculationPeriod),
  ];
  const totalIncome = profitRowData.reduce((sum, item) => sum + item.cost, 0);
  const profitForPeriod = totalIncome - totalRecurringCost;

  const timeMult = getTimeMultiplier(calculationPeriod, values.openingHours);

  const profitPerHour = profitForPeriod / timeMult;
  const profitPerDay = profitPerHour * values.openingHours;
  const profitPerWeek = profitPerHour * values.openingHours * 7;

  const amortizationDays = Math.ceil(totalOneTimeCost / profitPerDay);

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-center font-semibold">One-time costs</h2>

        <InfoTable label="itemName" rows={oneTimeCostRowData} />
      </div>

      {recurringCostRowData.length > 0 && (
        <>
          <Separator />
          <div className="space-y-4">
            <h2 className="text-center font-semibold">
              Recurring {calculationPeriod} costs
            </h2>

            <InfoTable label="description" rows={recurringCostRowData} />
          </div>
        </>
      )}

      {profitRowData.length > 0 && (
        <>
          <Separator />
          <div className="space-y-4">
            <h2 className="text-center font-semibold">
              Income per {calculationPeriod}
            </h2>

            <InfoTable label="itemName" rows={profitRowData} />
          </div>
          <Separator />
          <div className="space-y-4">
            <h2 className="text-center font-semibold">Summary</h2>

            <p>
              You will make approx. {formatToUSD(profitPerHour, true)} per hour,{" "}
              {formatToUSD(profitPerDay, true)} per day and{" "}
              {formatToUSD(profitPerWeek * 7, true)} per week!
            </p>
            {amortizationDays > 0 ? (
              <p>
                Factory will amortize after approx.{" "}
                {Math.ceil(amortizationDays)} days
              </p>
            ) : (
              <p>Factory is never going to amortize :(</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FactoryOverview;
