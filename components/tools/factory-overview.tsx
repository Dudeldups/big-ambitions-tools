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
import { Separator } from "../ui/separator";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { formatToUSD } from "@/lib/utils/formatToUSD";
import { getTimeMultiplier } from "@/lib/utils/getTimeMultiplier";
import { useAppState } from "@/lib/hooks/useAppState";
import { cn } from "@/lib/utils";
import { usePriceIndices } from "@/lib/hooks/usePriceIndices";
import { TAX_RATE } from "@/lib/constants";
import OverviewTableWrapper from "./overview-table-wrapper";
import { useTranslations } from "next-intl";

type FactoryOverviewProps = {
  values: FactoryFormValues;
};

const FactoryOverview = ({ values }: FactoryOverviewProps) => {
  const tGeneral = useTranslations("general");
  const tCounts = useTranslations("counts");
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
  );

  const profitRowData = [...sortedProductData];
  const totalIncome = profitRowData.reduce((sum, item) => sum + item.value, 0);

  const timeMult = getTimeMultiplier(calculationPeriod, values.openingHours);
  const taxRate = TAX_RATE[difficulty];
  const totalTaxes = totalIncome * taxRate;

  const profitForPeriod = totalIncome - totalTaxes - totalRecurringCost;

  const profitPerDay = (profitForPeriod / timeMult) * values.openingHours;

  const amortizationDays = Math.ceil(totalOneTimeCost / profitPerDay);

  return (
    <div className="space-y-10 overflow-x-hidden px-4">
      <OverviewTableWrapper
        title={tGeneral("oneTimeCosts")}
        label="itemName"
        rowData={oneTimeCostRowData}
      />

      {recurringCostRowData.length > 0 && (
        <>
          <Separator />

          <OverviewTableWrapper
            title={`${tGeneral("recurringCosts")} (${tGeneral(`calculationPeriodOptions.${calculationPeriod}`)})`}
            label="description"
            rowData={recurringCostRowData}
          />
        </>
      )}

      {profitRowData.length > 0 && (
        <>
          <Separator />

          <OverviewTableWrapper
            title={`${tGeneral("revenue")} (${tGeneral(`calculationPeriodOptions.${calculationPeriod}`)})`}
            label="itemName"
            rowData={profitRowData}
          />
        </>
      )}

      <Separator />
      <div className="mx-auto max-w-3xl space-y-3 rounded-lg border p-4">
        <h2 className="text-center text-xl md:text-2xl">
          {tGeneral("summary")}
        </h2>

        <Separator />

        <div className="flex justify-between">
          <span className="text-muted-foreground">{tGeneral("revenue")}</span>
          <span className="amount text-success">
            {formatToUSD(totalIncome)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {tGeneral("taxes")} ({taxRate * 100}%)
          </span>
          <span className="amount text-destructive">
            {formatToUSD(totalTaxes)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{tGeneral("expenses")}</span>
          <span className="amount text-destructive">
            {formatToUSD(totalRecurringCost)}
          </span>
        </div>

        <Separator />

        <div className="flex justify-between">
          <span className="font-semibold">{tGeneral("netProfit")}</span>
          <span
            className={cn(
              "amount",
              profitForPeriod >= 0 ? "text-success" : "text-destructive",
            )}
          >
            {formatToUSD(profitForPeriod)}
          </span>
        </div>

        <Separator />

        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {tGeneral("amortization")}
          </span>
          {amortizationDays > 0 ? (
            <span>{tCounts("day", { count: amortizationDays })}</span>
          ) : (
            <span className="text-destructive">{tGeneral("never")}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FactoryOverview;
