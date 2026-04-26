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
import DatabaseHgroup from "@/components/deco/database-hgroup";

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
      <DatabaseHgroup
        title={t("general.products")}
        caption={t("database.products.caption")}
      />

      <DataTable columns={columns} data={data} />
    </>
  );
}
