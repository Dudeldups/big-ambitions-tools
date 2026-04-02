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
import { Input } from "@/components/ui/input";
import {
  MAX_PRODUCT_PRICE_INDEX,
  MIN_PRODUCT_PRICE_INDEX,
} from "@/lib/constants";
import { ProductName } from "@/lib/game/productNames";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { usePriceIndices } from "@/lib/hooks/usePriceIndices";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  getExportPrice,
  getPriceIndexFromExportPrice,
} from "@/lib/calculations/math";
import { products } from "@/lib/game/products";

type PriceIndexPopoverProps = {
  className?: string;
  selectedProduct: ProductName;
};

const PriceIndexPopover = ({
  selectedProduct,
  className,
}: PriceIndexPopoverProps) => {
  const { activePlaythrough } = useActivePlaythrough();
  const priceIndices = usePriceIndices();
  const setPriceIndex = usePlaythroughStore((state) => state.setPriceIndex);
  const { wholesalePrice } = products[selectedProduct];

  const [exportPrice, setExportPrice] = useState<number>(
    parseFloat(
      getExportPrice(
        wholesalePrice,
        activePlaythrough.difficulty,
        priceIndices[selectedProduct],
      ).toFixed(2),
    ),
  );

  const t = useTranslations();

  const assertIndex = (index: number) =>
    index >= MIN_PRODUCT_PRICE_INDEX && index <= MAX_PRODUCT_PRICE_INDEX;

  const onIndexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || !assertIndex(value)) return;

    const newExportPrice = getExportPrice(
      wholesalePrice,
      activePlaythrough.difficulty,
      value,
    );
    setExportPrice(parseFloat(newExportPrice.toFixed(2)));
    setPriceIndex(activePlaythrough.id, selectedProduct, value);
  };

  const onExportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/^0+(?=\d)/, "");
    const value = Number(raw) || 0;

    const newIndex = parseFloat(
      getPriceIndexFromExportPrice(
        value,
        wholesalePrice,
        activePlaythrough.difficulty,
      ).toFixed(3),
    );
    setExportPrice(value);

    if (!assertIndex(newIndex)) return;
    setPriceIndex(activePlaythrough.id, selectedProduct, newIndex);
  };

  // TODO: Make this one slider like in the form and then only display the export price as reference

  return (
    <Popover>
      <PopoverTrigger asChild className={cn("", className)}>
        <Button variant="secondary">
          {t("tools.factoryPlanner.priceIndexButton")}
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>
            {t("tools.factoryPlanner.priceIndexButton")}
          </PopoverTitle>
          <PopoverDescription>
            {t("tools.factoryPlanner.priceIndexDesc")}
          </PopoverDescription>
        </PopoverHeader>

        <FieldGroup>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="price-index">
              {t("general.priceIndex")}
            </FieldLabel>
            <Input
              className="max-w-24"
              id="price-index"
              type="number"
              value={priceIndices[selectedProduct] ?? ""}
              onChange={onIndexChange}
              min={MIN_PRODUCT_PRICE_INDEX}
              max={MAX_PRODUCT_PRICE_INDEX}
              step={0.01}
            />
          </Field>

          <Field orientation="horizontal">
            <FieldLabel htmlFor="export-price">
              {t("general.exportPrice")}
            </FieldLabel>
            <Input
              className="max-w-24"
              id="export-price"
              type="number"
              value={exportPrice}
              onChange={onExportChange}
              step={0.01}
            />
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  );
};

export default PriceIndexPopover;
