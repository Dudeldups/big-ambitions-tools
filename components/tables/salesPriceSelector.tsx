"use client";

import { useAppState } from "@/lib/hooks/useAppState";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { useAppStore } from "@/lib/stores/appStore";
import { useTranslations } from "next-intl";
import { DISPLAY_PRICE_OPTIONS } from "@/lib/constants";

type SalesPriceSelectorProps = {
  className?: string;
};

const SalesPriceSelector = ({ className }: SalesPriceSelectorProps) => {
  const displayPrices = useAppState((state) => state.displayPrices);
  const setDisplayPrices = useAppStore((state) => state.setDisplayPrices);

  const tGeneral = useTranslations("general");

  return (
    <>
      <ButtonGroup className={`mx-6 ${className}`}>
        <Button
          variant={
            displayPrices?.source === DISPLAY_PRICE_OPTIONS.SOURCE.MANUFACTURE
              ? "secondary"
              : "outline"
          }
          onClick={() => {
            if (!displayPrices) return;
            setDisplayPrices(
              DISPLAY_PRICE_OPTIONS.SOURCE.MANUFACTURE,
              displayPrices?.target,
            );
          }}
        >
          {tGeneral("displayPriceOptions.manufacture")}
        </Button>
        <Button
          variant={
            displayPrices?.source === DISPLAY_PRICE_OPTIONS.SOURCE.IMPORT
              ? "secondary"
              : "outline"
          }
          onClick={() => {
            if (!displayPrices) return;
            setDisplayPrices(
              DISPLAY_PRICE_OPTIONS.SOURCE.IMPORT,
              displayPrices?.target,
            );
          }}
        >
          {tGeneral("displayPriceOptions.import")}
        </Button>
      </ButtonGroup>
      <ButtonGroup className={className}>
        <Button
          variant={
            displayPrices?.target === DISPLAY_PRICE_OPTIONS.TARGET.EXPORT
              ? "secondary"
              : "outline"
          }
          onClick={() => {
            if (!displayPrices) return;
            setDisplayPrices(
              displayPrices?.source,
              DISPLAY_PRICE_OPTIONS.TARGET.EXPORT,
            );
          }}
        >
          {tGeneral("displayPriceOptions.export")}
        </Button>
        <Button
          variant={
            displayPrices?.target === DISPLAY_PRICE_OPTIONS.TARGET.RETAIL
              ? "secondary"
              : "outline"
          }
          onClick={() => {
            if (!displayPrices) return;
            setDisplayPrices(
              displayPrices?.source,
              DISPLAY_PRICE_OPTIONS.TARGET.RETAIL,
            );
          }}
        >
          {tGeneral("displayPriceOptions.retail")}
        </Button>
      </ButtonGroup>
    </>
  );
};

export default SalesPriceSelector;
