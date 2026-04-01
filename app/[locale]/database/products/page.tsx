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
import { useTranslations } from "next-intl";

export default function ProductsPage() {
  const t = useTranslations();
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
        return {
          ...products[itemName],
          itemName,
          profitPerHour: isStateLoaded
            ? getProfitPerHourForProduct(
                products[itemName],
                difficulty,
                tablePriceIndex,
                displayPrices,
              )
            : null,
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
    <div className="mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
