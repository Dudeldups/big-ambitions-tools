"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  MAX_PRODUCT_PRICE_INDEX,
  MIN_PRODUCT_PRICE_INDEX,
  TAX_RATE,
} from "@/lib/constants";
import { ProductName } from "@/lib/game/productNames";
import { requireProduct } from "@/lib/game/requireGameData";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  getExportPrice,
  getIncomeTax,
  getManufacturePrice,
  getProfitAfterIncomeTax,
  getTaxableIncome,
} from "@/lib/calculations/math";
import { formatToUSD } from "@/lib/utils/formatToUSD";
import { usePriceIndex } from "@/lib/hooks/usePriceIndex";
import { getPlaythroughGameData } from "@/lib/game/registry";

type PriceIndexPopoverProps = {
  className?: string;
  selectedProduct: ProductName;
  factoryWorkerSalary: number;
};

const PriceIndexPopover = ({
  selectedProduct,
  className,
  factoryWorkerSalary,
}: PriceIndexPopoverProps) => {
  const t = useTranslations();
  const { activePlaythrough } = useActivePlaythrough();
  const setPriceIndex = usePlaythroughStore((state) => state.setPriceIndex);
  const currentPriceIndex = usePriceIndex(selectedProduct);

  const assertIndex = (index: number) =>
    index >= MIN_PRODUCT_PRICE_INDEX && index <= MAX_PRODUCT_PRICE_INDEX;

  const onIndexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activePlaythrough) return;
    const value = parseFloat(e.target.value);
    if (isNaN(value) || !assertIndex(value)) return;

    setPriceIndex(activePlaythrough.id, selectedProduct, value);
  };

  if (!activePlaythrough) return null;
  const gameData = getPlaythroughGameData(activePlaythrough);
  const selectedProductObj = requireProduct(gameData, selectedProduct);
  const { wholesalePrice } = selectedProductObj;

  const exportPrice = parseFloat(
    getExportPrice(
      wholesalePrice,
      activePlaythrough.difficulty,
      currentPriceIndex,
    ).toFixed(2),
  );

  const manufacturePrice = parseFloat(
    getManufacturePrice(
      selectedProductObj,
      activePlaythrough.difficulty,
      gameData,
      factoryWorkerSalary,
    ).toFixed(2),
  );

  const manufacturingCostsAreDeductible =
    gameData.taxRules.recurringFactoryExpensesDeductible;
  const deductibleExpenses = manufacturingCostsAreDeductible
    ? manufacturePrice
    : 0;
  const taxableIncome = getTaxableIncome(exportPrice, deductibleExpenses);
  const taxRate = TAX_RATE[activePlaythrough.difficulty];
  const taxAmount = getIncomeTax(
    exportPrice,
    deductibleExpenses,
    activePlaythrough.difficulty,
  );
  const profit = getProfitAfterIncomeTax(
    exportPrice,
    manufacturePrice,
    deductibleExpenses,
    activePlaythrough.difficulty,
  );
  const formattedExportPrice = formatToUSD(exportPrice);
  const formattedManufacturePrice = formatToUSD(manufacturePrice);
  const formattedTaxAmount = formatToUSD(taxAmount);
  const formattedProfit = formatToUSD(profit);

  const exportRevenueLabel = t.has(
    "tools.factoryPlanner.priceIndexExportRevenue",
  )
    ? t("tools.factoryPlanner.priceIndexExportRevenue")
    : "Export revenue / item";
  const manufacturingCostsLabel = manufacturingCostsAreDeductible
    ? t.has("tools.factoryPlanner.priceIndexDeductibleManufacturingCosts")
      ? t("tools.factoryPlanner.priceIndexDeductibleManufacturingCosts")
      : "Deductible manufacturing costs"
    : t("general.manufacturingCosts");
  const taxableIncomeLabel = t.has("general.taxableIncome")
    ? t("general.taxableIncome")
    : "Taxable income";
  const incomeTaxLabel = t.has("tools.factoryPlanner.priceIndexIncomeTax")
    ? t("tools.factoryPlanner.priceIndexIncomeTax", {
        rate: taxRate * 100,
      })
    : `Income tax (${taxRate * 100}%)`;
  const resultHeading = t.has("tools.factoryPlanner.priceIndexResultHeading")
    ? t("tools.factoryPlanner.priceIndexResultHeading")
    : "Per-item result";
  const calculationHeading = t.has(
    "tools.factoryPlanner.priceIndexCalculationHeading",
  )
    ? t("tools.factoryPlanner.priceIndexCalculationHeading")
    : "How it's calculated";
  const taxHeading = t.has("tools.factoryPlanner.priceIndexTaxHeading")
    ? t("tools.factoryPlanner.priceIndexTaxHeading")
    : "Income tax";
  const taxFormula = manufacturingCostsAreDeductible
    ? `(${formattedExportPrice} − ${formattedManufacturePrice}) × ${taxRate * 100}% = ${formattedTaxAmount}`
    : `${formattedExportPrice} × ${taxRate * 100}% = ${formattedTaxAmount}`;
  const profitFormula = `${formattedExportPrice} − ${formattedManufacturePrice} − ${formattedTaxAmount} = ${formattedProfit}`;
  const manufacturingCostNote = t.has(
    "tools.factoryPlanner.priceIndexManufacturingCostNote",
  )
    ? t("tools.factoryPlanner.priceIndexManufacturingCostNote")
    : "Manufacturing costs include raw materials and factory worker wages per item.";

  return (
    <Popover>
      <PopoverTrigger asChild className={cn("", className)}>
        <Button variant="secondary">
          {t("tools.factoryPlanner.priceIndexButton")}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="border-muted-foreground w-96 max-w-[calc(100vw-2rem)] border">
        <PopoverHeader>
          <PopoverTitle>
            {t("tools.factoryPlanner.priceIndexButton")}
          </PopoverTitle>
          <PopoverDescription>
            {t("tools.factoryPlanner.priceIndexDesc")}
          </PopoverDescription>
        </PopoverHeader>

        <FieldGroup className="gap-2">
          <Field>
            <FieldLabel htmlFor="price-index-popover">
              {t("general.priceIndex")}:
              <span className="font-bold">{currentPriceIndex}</span>
            </FieldLabel>
            <input
              id="price-index"
              type="range"
              min={MIN_PRODUCT_PRICE_INDEX}
              max={MAX_PRODUCT_PRICE_INDEX}
              step={0.01}
              value={currentPriceIndex}
              onChange={onIndexChange}
              className={cn("accent-foreground w-full transition-opacity")}
            />
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>{MIN_PRODUCT_PRICE_INDEX}</span>
              <span>{MAX_PRODUCT_PRICE_INDEX}</span>
            </div>
          </Field>

          <section className="space-y-1.5">
            <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {resultHeading}
            </h3>
            <dl className="overflow-hidden rounded-md border">
              {[
                [exportRevenueLabel, formattedExportPrice],
                [manufacturingCostsLabel, `-${formattedManufacturePrice}`],
                [taxableIncomeLabel, formatToUSD(taxableIncome)],
                [incomeTaxLabel, `-${formattedTaxAmount}`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b px-3 py-2 last:border-b-0"
                >
                  <dt>{label}</dt>
                  <dd className="amount">{value}</dd>
                </div>
              ))}
              <div className="bg-muted/40 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-3 py-2 font-semibold">
                <dt>{t("general.netProfit")}</dt>
                <dd
                  className={cn(
                    "amount",
                    profit > 0 ? "text-success" : "text-destructive",
                  )}
                >
                  {formattedProfit}
                </dd>
              </div>
            </dl>
          </section>

          <section className="space-y-1.5 border-t pt-3">
            <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {calculationHeading}
            </h3>
            <div className="bg-muted/40 divide-y overflow-hidden rounded-md border text-xs tabular-nums">
              <div className="space-y-1 p-3">
                <p className="text-muted-foreground font-medium">
                  {taxHeading}
                </p>
                <p className="font-mono">{taxFormula}</p>
              </div>
              <div className="space-y-1 p-3">
                <p className="text-muted-foreground font-medium">
                  {t("general.netProfit")}
                </p>
                <p className="font-mono">{profitFormula}</p>
              </div>
            </div>
            <p className="text-muted-foreground px-1 text-xs">
              {manufacturingCostNote}
            </p>
          </section>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  );
};

export default PriceIndexPopover;
