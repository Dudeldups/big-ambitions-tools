"use client";

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
import { sLink } from "@/i18n/defaults";
import { getGameData } from "@/lib/game/registry";
import { DataTableSkeleton } from "@/components/cemetery/data-table-skeleton";

export default function ProductsPage() {
  const { t, rich } = useRichDefaults();
  const difficulty = useAppState((state) => state.difficulty);
  const gameVersion = useAppState((state) => state.gameVersion);
  const displayPrices = useAppState((state) => state.displayPrices);
  const tablePriceIndex = useAppState((state) => state.tablePriceIndex);
  const isStateLoaded = !!difficulty && !!displayPrices && !!tablePriceIndex;
  const gameData = gameVersion ? getGameData(gameVersion) : undefined;
  const products = gameData?.products;

  const data = useMemo(
    () =>
      !products
        ? []
        : (Object.keys(products) as ProductName[]).flatMap((itemName) => {
            const product = products[itemName];

            if (!product) return [];

            const marginData = isStateLoaded
              ? getProfitMarginForProduct(
                  product,
                  difficulty,
                  gameData,
                  tablePriceIndex,
                  displayPrices,
                )
              : null;
            const profitPerHourData = isStateLoaded
              ? getProfitPerHourForProduct(
                  product,
                  difficulty,
                  gameData,
                  tablePriceIndex,
                  displayPrices,
                )
              : null;

            return [
              {
                ...product,
                itemName,
                profitPerHour: profitPerHourData,
                margin: marginData?.margin,
                marginPercent: marginData?.marginPercent,
              },
            ];
          }),
    [
      products,
      gameData,
      isStateLoaded,
      difficulty,
      tablePriceIndex,
      displayPrices,
    ],
  );

  const columns = useMemo(
    () =>
      productsColumns(t, difficulty, displayPrices, tablePriceIndex, gameData),
    [difficulty, displayPrices, gameData, t, tablePriceIndex],
  );

  return (
    <>
      <DefaultHgroup
        title={t("general.products")}
        caption={rich("database.products.caption", {
          link: sLink("/tools"),
        })}
      />

      {gameVersion ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <DataTableSkeleton columnCount={7} rowCount={10} />
      )}
    </>
  );
}
