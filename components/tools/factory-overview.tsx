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
import { useTranslations } from "next-intl";
import { Separator } from "../ui/separator";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { formatToUSD } from "@/lib/utils/formatToUSD";

type FactoryOverviewProps = {
  values: FactoryFormValues;
};

const FactoryOverview = ({ values }: FactoryOverviewProps) => {
  const t = useTranslations();
  const { activePlaythrough } = useActivePlaythrough();
  const { difficulty } = activePlaythrough;

  const oneTimeCostRowData = [
    ...derivePalletShelfData(values),
    ...deriveVehicleData(values),
    ...deriveWorkstationData(values),
  ];
  const totalOneTimeCost = oneTimeCostRowData.reduce(
    (sum, item) => sum + item.cost,
    0,
  );

  const recurringCostRowData = [
    ...deriveEmployeeData(values),
    ...deriveIngredientData(values, difficulty),
  ];
  const totalRecurringCost = recurringCostRowData.reduce(
    (sum, item) => sum + item.cost,
    0,
  );

  const profitRowData = [...deriveProductData(values, difficulty)];
  const totalIncome = profitRowData.reduce((sum, item) => sum + item.cost, 0);

  const profit = totalIncome - totalRecurringCost;
  const displayProfitPerDay = Math.round(profit / 7);

  const amortizationTime = totalOneTimeCost / profit;

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-center font-semibold">One-time costs</h2>

        <InfoTable label="itemName" rows={oneTimeCostRowData} />
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-center font-semibold">Recurring weekly costs</h2>

        <InfoTable label="description" rows={recurringCostRowData} />
      </div>

      {profitRowData.length > 0 && (
        <>
          <Separator />

          <div className="space-y-4">
            <h2 className="text-center font-semibold">Income per week</h2>

            <InfoTable label="itemName" rows={profitRowData} />
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-center font-semibold">Summary</h2>

            <p>
              You will make approx. {formatToUSD(displayProfitPerDay, true)} per
              day and {formatToUSD(displayProfitPerDay * 7, true)} per week!
            </p>
            <p>
              Factory will amortize after approx. {Math.ceil(amortizationTime)}{" "}
              days
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default FactoryOverview;
