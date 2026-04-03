"use client";

import {
  BASE_PRODUCT_PRICE_INDEX,
  MAX_PRODUCT_PRICE_INDEX,
  MIN_PRODUCT_PRICE_INDEX,
} from "@/lib/constants";
import { useAppState } from "@/lib/hooks/useAppState";
import { useAppStore } from "@/lib/stores/appStore";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type PriceIndexSliderProps = {
  className?: string;
};

const PriceIndexSlider = ({ className }: PriceIndexSliderProps) => {
  const t = useTranslations("general");
  const index = useAppState((state) => state.tablePriceIndex);
  const isLoading = index === null;

  const setIndex = useAppStore((state) => state.setTablePriceIndex);

  return (
    <div className={cn("w-full max-w-md px-4", className)}>
      <div className="flex items-end justify-between">
        <span className="text-muted-foreground mb-1 text-xs">
          {MIN_PRODUCT_PRICE_INDEX}
        </span>
        <label htmlFor="price-index-slider" className="mb-2 block text-sm">
          {t("priceIndex")}:{" "}
          <span className="ml-1 font-bold">{isLoading ? "..." : index}</span>
        </label>
        <span className="text-muted-foreground mb-1 text-xs">
          {MAX_PRODUCT_PRICE_INDEX}
        </span>
      </div>

      <input
        id="price-index-slider"
        type="range"
        min={MIN_PRODUCT_PRICE_INDEX}
        max={MAX_PRODUCT_PRICE_INDEX}
        step={0.02}
        value={index ?? BASE_PRODUCT_PRICE_INDEX}
        disabled={isLoading}
        onChange={(e) => setIndex(Number(e.target.value))}
        className={cn(
          "accent-foreground w-full transition-opacity",
          isLoading && "slider-loading animate-pulse opacity-50",
        )}
      />
    </div>
  );
};

export default PriceIndexSlider;
