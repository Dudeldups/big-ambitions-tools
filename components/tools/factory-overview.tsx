"use client";

import {
  deriveEmployeeData,
  deriveIngredientData,
  derivePalletShelfData,
  deriveProductData,
  deriveVehicleData,
  deriveWorkstationData,
} from "@/lib/calculations/derivedFactoryData";
import { getPlaythroughGameData } from "@/lib/game/registry";
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
import { getIncomeTax, getTaxableIncome } from "@/lib/calculations/math";

type FactoryOverviewProps = {
  values: FactoryFormValues;
};

const FactoryOverview = ({ values }: FactoryOverviewProps) => {
  const tGeneral = useTranslations("general");
  const tCounts = useTranslations("counts");
  const tFactoryPlanner = useTranslations("tools.factoryPlanner");
  const { activePlaythrough } = useActivePlaythrough();
  const difficulty = activePlaythrough?.difficulty;
  const calculationPeriod = useAppState((s) => s.calculationPeriod) ?? "weekly";
  const priceIndices = usePriceIndices();

  const taxDeductibleExpensesLabel = tGeneral.has("taxDeductibleExpenses")
    ? tGeneral("taxDeductibleExpenses")
    : "Tax-deductible expenses";
  const taxableIncomeLabel = tGeneral.has("taxableIncome")
    ? tGeneral("taxableIncome")
    : "Taxable income";
  const taxDeductionNote = tFactoryPlanner.has("taxDeductionNote")
    ? tFactoryPlanner("taxDeductionNote")
    : "In version 1.0, ingredients and employee wages reduce taxable income. Factory equipment, pallet shelves, and qualifying delivery vehicles are deductible when purchased, but one-time deductions are not included in this recurring tax estimate.";

  // TODO add skeletons
  if (!difficulty || !priceIndices || !activePlaythrough) return null;
  const gameData = getPlaythroughGameData(activePlaythrough);

  const oneTimeCostRowData = [
    ...derivePalletShelfData(values, gameData),
    ...deriveVehicleData(values, gameData),
    ...deriveWorkstationData(values, gameData),
  ];
  const totalOneTimeCost = oneTimeCostRowData.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  const recurringCostRowData = [
    ...deriveEmployeeData(values, calculationPeriod, gameData),
    ...deriveIngredientData(values, difficulty, calculationPeriod, gameData),
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
    gameData,
  );

  const profitRowData = [...sortedProductData];
  const totalIncome = profitRowData.reduce((sum, item) => sum + item.value, 0);

  const timeMult = getTimeMultiplier(calculationPeriod, values.openingHours);
  const taxRate = TAX_RATE[difficulty];
  const taxDeductions = gameData.taxRules.recurringFactoryExpensesDeductible
    ? totalRecurringCost
    : 0;
  const taxableIncome = getTaxableIncome(totalIncome, taxDeductions);
  const totalTaxes = getIncomeTax(totalIncome, taxDeductions, difficulty);

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
        <h3 className="text-center text-xl md:text-2xl">
          {tGeneral("summary")}
        </h3>

        <Separator />

        <div className="flex justify-between">
          <span className="text-muted-foreground">{tGeneral("revenue")}</span>
          <span className="amount text-success">
            {formatToUSD(totalIncome)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {gameData.taxRules.recurringFactoryExpensesDeductible
              ? taxDeductibleExpensesLabel
              : tGeneral("expenses")}
          </span>
          <span className="amount text-destructive">
            {formatToUSD(totalRecurringCost)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{taxableIncomeLabel}</span>
          <span className="amount">{formatToUSD(taxableIncome)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {tGeneral("taxes")} ({taxRate * 100}%)
          </span>
          <span className="amount text-destructive">
            {formatToUSD(totalTaxes)}
          </span>
        </div>

        {gameData.taxRules.recurringFactoryExpensesDeductible && (
          <p className="text-muted-foreground text-sm">{taxDeductionNote}</p>
        )}

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
