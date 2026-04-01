"use client";

import { useAppState } from "@/lib/hooks/useAppState";
import { useAppStore } from "@/lib/stores/appStore";
import { useTranslations } from "next-intl";
import { DISPLAY_PRICE_OPTIONS } from "@/lib/constants";
import { RadioButtonGroup } from "../radio-button-group";
import { cn } from "@/lib/utils";

type SalesPriceSelectorProps = {
  className?: string;
};

const SalesPriceSelector = ({ className }: SalesPriceSelectorProps) => {
  const displayPrices = useAppState((state) => state.displayPrices);
  const setDisplayPrices = useAppStore((state) => state.setDisplayPrices);

  const tGeneral = useTranslations("general");

  return (
    <div className={cn("flex gap-6", className)}>
      <RadioButtonGroup
        name="displayPriceSource"
        value={displayPrices?.source}
        onChange={(value) => {
          if (!displayPrices) return;
          setDisplayPrices(value, displayPrices.target);
        }}
        options={[
          {
            value: DISPLAY_PRICE_OPTIONS.SOURCE.MANUFACTURE,
            label: tGeneral("displayPriceOptions.manufacture"),
          },
          {
            value: DISPLAY_PRICE_OPTIONS.SOURCE.IMPORT,
            label: tGeneral("displayPriceOptions.import"),
          },
        ]}
      />

      <RadioButtonGroup
        name="displayPriceTarget"
        value={displayPrices?.target}
        onChange={(value) => {
          if (!displayPrices) return;
          setDisplayPrices(displayPrices.source, value);
        }}
        options={[
          {
            value: DISPLAY_PRICE_OPTIONS.TARGET.EXPORT,
            label: tGeneral("displayPriceOptions.export"),
          },
          {
            value: DISPLAY_PRICE_OPTIONS.TARGET.RETAIL,
            label: tGeneral("displayPriceOptions.retail"),
          },
        ]}
      />
    </div>
  );
};

export default SalesPriceSelector;
