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
import { cn } from "@/lib/utils";
import { usePriceIndices } from "@/lib/hooks/usePriceIndices";
import { TAX_RATE } from "@/lib/constants";

type FactoryOverviewProps = {
  values: FactoryFormValues;
};

const FactoryOverview = ({ values }: FactoryOverviewProps) => {
  const { activePlaythrough } = useActivePlaythrough();
  const difficulty = activePlaythrough?.difficulty;
  const calculationPeriod = useAppState((s) => s.calculationPeriod) ?? "weekly";
  const priceIndices = usePriceIndices();

  // TODO add skeletons
  if (!difficulty || !priceIndices || !activePlaythrough) return null;

  const oneTimeCostRowData = [
    ...derivePalletShelfData(values),
    ...deriveVehicleData(values),
    ...deriveWorkstationData(values),
  ];
  const totalOneTimeCost = oneTimeCostRowData.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  const recurringCostRowData = [
    ...deriveEmployeeData(values, calculationPeriod),
    ...deriveIngredientData(values, difficulty, calculationPeriod),
  ];
  const totalRecurringCost = recurringCostRowData.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  const sortedProductData = deriveProductData(
    values,
    difficulty,
    calculationPeriod,
    priceIndices,
  ).sort((a, b) => (a.valueType ?? "").localeCompare(b.valueType ?? ""));

  const profitRowData = [...sortedProductData];
  const totalIncome = profitRowData.reduce((sum, item) => sum + item.value, 0);

  const timeMult = getTimeMultiplier(calculationPeriod, values.openingHours);
  const taxMult = 1 - TAX_RATE[difficulty];
  const profitForPeriod = totalIncome * taxMult - totalRecurringCost;

  const profitPerDay = (profitForPeriod / timeMult) * values.openingHours;

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
            <h2 className="text-center font-semibold capitalize">
              {calculationPeriod} income
            </h2>

            <InfoTable label="itemName" rows={profitRowData} />
          </div>
        </>
      )}

      <Separator />
      <div className="space-y-3 rounded-lg border p-4">
        <h2 className="text-center">Summary</h2>

        <Separator />

        <div className="flex justify-between">
          <span className="text-muted-foreground">Income</span>
          <span className="amount text-green-600">
            {formatToUSD(totalIncome)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Expenses</span>
          <span className="amount text-red-600">
            {formatToUSD(totalRecurringCost)}
          </span>
        </div>

        <Separator />

        <div className="flex justify-between">
          <span className="font-semibold">Profit</span>
          <span
            className={cn(
              "amount",
              profitForPeriod >= 0 ? "text-green-600" : "text-red-600",
            )}
          >
            {formatToUSD(profitForPeriod)}
          </span>
        </div>

        <Separator />

        <div className="flex justify-between">
          <span className="text-muted-foreground">Amortization</span>
          {amortizationDays > 0 ? (
            <span>{amortizationDays} Days</span>
          ) : (
            <span className="text-red-600">Never</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FactoryOverview;
