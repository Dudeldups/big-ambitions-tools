"use client";

import { products } from "@/lib/game/products";
import { DataTable } from "../../../../components/tables/data-table";
import { productsColumns } from "./table-columns";
import { useAppState } from "@/lib/hooks/useAppState";
import { ProductName } from "@/lib/game/productNames";
import { useMemo } from "react";
import {
  getProfitMarginForProduct,
  getProfitPerHourForProduct,
} from "@/lib/calculations/math";
import DefaultHgroup from "@/components/deco/default-hgroup";
import { useRichDefaults } from "@/lib/hooks/useRichDefaults";
import { SmartLink } from "@/components/smart-link";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const { t, rich } = useRichDefaults();
  const difficulty = useAppState((state) => state.difficulty);
  const displayPrices = useAppState((state) => state.displayPrices);
  const tablePriceIndex = useAppState((state) => state.tablePriceIndex);
  const isStateLoaded = !!difficulty && !!displayPrices && !!tablePriceIndex;

  const data = useMemo(
    () =>
      (Object.keys(products) as ProductName[]).map((itemName) => {
        const marginData = isStateLoaded
          ? getProfitMarginForProduct(
              products[itemName],
              difficulty,
              tablePriceIndex,
              displayPrices,
            )
          : null;
        const profitPerHourData = isStateLoaded
          ? getProfitPerHourForProduct(
              products[itemName],
              difficulty,
              tablePriceIndex,
              displayPrices,
            )
          : null;

        return {
          ...products[itemName],
          itemName,
          profitPerHour: profitPerHourData,
          margin: marginData?.margin,
          marginPercent: marginData?.marginPercent,
        };
      }),
    [isStateLoaded, difficulty, tablePriceIndex, displayPrices],
  );

  const columns = useMemo(
    () => productsColumns(t, difficulty, displayPrices, tablePriceIndex),
    [difficulty, displayPrices, t, tablePriceIndex],
  );

  return (
    <>
      <DefaultHgroup
        title={t("general.products")}
        caption={rich("database.products.caption", {
          link: (chunks) => (
            <Button asChild>
              <SmartLink href="/tools">{chunks}</SmartLink>
            </Button>
          ),
        })}
      />

      <DataTable columns={columns} data={data} />
    </>
  );
}
