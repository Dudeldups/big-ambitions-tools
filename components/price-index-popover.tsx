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
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { getExportPrice, getManufacturePrice } from "@/lib/calculations/math";
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
  const selectedProductObj = gameData.products[selectedProduct]!;
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

  const taxRate = TAX_RATE[activePlaythrough.difficulty];
  const taxAmount = exportPrice * taxRate;

  const profit =
    Math.round((exportPrice - taxAmount - manufacturePrice) * 100) / 100;

  return (
    <Popover>
      <PopoverTrigger asChild className={cn("", className)}>
        <Button variant="secondary">
          {t("tools.factoryPlanner.priceIndexButton")}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="border-muted-foreground border">
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

          <dl className="grid grid-cols-2 justify-between gap-2">
            <dt>{t("general.exportPrice")}</dt>
            <dd className="amount">{formatToUSD(exportPrice)}</dd>

            <dt>{t("general.taxes")}</dt>
            <dd className="amount">-{formatToUSD(taxAmount)}</dd>

            <dt>{t("general.manufacturingCostsShort")}</dt>
            <dd className="amount">-{formatToUSD(manufacturePrice)}</dd>

            <dt>{t("general.netProfit")}</dt>
            <dd
              className={cn(
                "amount",
                profit > 0 ? "text-success" : "text-destructive",
              )}
            >
              {formatToUSD(profit)}
            </dd>
          </dl>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  );
};

export default PriceIndexPopover;
