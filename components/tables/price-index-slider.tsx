"use client";

import {
  BASE_PRODUCT_PRICE_INDEX,
  MAX_PRODUCT_PRICE_INDEX,
  MIN_PRODUCT_PRICE_INDEX,
} from "@/lib/constants";
import { useAppState } from "@/lib/hooks/useAppState";
import { useAppStore } from "@/lib/stores/appStore";

const PriceIndexSlider = () => {
  const index =
    useAppState((state) => state.tablePriceIndex) ?? BASE_PRODUCT_PRICE_INDEX;
  const isLoading = index === null;

  const setIndex = useAppStore((state) => state.setTablePriceIndex);

  return (
    <div className="mx-auto w-full max-w-md p-4">
      <label className="mb-2 block text-sm font-medium">
        Price Index:{" "}
        <span className="font-bold">{isLoading ? "..." : index}</span>
      </label>

      <input
        type="range"
        min={MIN_PRODUCT_PRICE_INDEX}
        max={MAX_PRODUCT_PRICE_INDEX}
        step={0.1}
        value={index ?? 0}
        disabled={isLoading}
        onChange={(e) => setIndex(Number(e.target.value))}
        className={`accent-foreground w-full transition-opacity ${
          isLoading ? "cursor-not-allowed opacity-50" : "opacity-100"
        }`}
      />

      <div className="text-muted-foreground mt-2 flex justify-between text-xs">
        <span>{MIN_PRODUCT_PRICE_INDEX}</span>
        <span>{MAX_PRODUCT_PRICE_INDEX}</span>
      </div>
    </div>
  );
};

export default PriceIndexSlider;
