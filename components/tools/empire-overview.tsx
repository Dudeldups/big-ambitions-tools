"use client";

import {
  DerivedDataFromFormValues,
  deriveProductData,
} from "@/lib/calculations/derivedFactoryData";
import { getPlaythroughGameData } from "@/lib/game/registry";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { usePriceIndices } from "@/lib/hooks/usePriceIndices";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { useShallow } from "zustand/shallow";
import {
  createColumnWithImage,
  createNumericColumn,
} from "../tables/shared-table-columns";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { Translator } from "@/lib/types";
import { DataTable } from "../tables/data-table";
import { cn } from "@/lib/utils";
import NoDataFound from "../no-data-found";
import ImporterTable from "../tables/importer-table";
import { getFactorySupplyPlan } from "@/lib/utils/getFactorySupplyPlan";
import { mergeShoppingLists } from "@/lib/utils/mergeShoppingLists";

type ProductRow = {
  itemName: string;
  amount: number;
  value: number;
  diff?: number;
  valueType?: string;
};

type EmpireOverviewProps = {
  className?: string;
};

const EmpireOverview = ({ className }: EmpireOverviewProps) => {
  const t = useTranslations();
  const { activePlaythrough } = useActivePlaythrough();
  const difficulty = activePlaythrough?.difficulty;
  const calculationPeriod = "weekly";
  const priceIndices = usePriceIndices();
  const factories = usePlaythroughStore(
    useShallow((s) => {
      if (!activePlaythrough) return [];
      return s.factories.filter((f) =>
        activePlaythrough.factoryIds.includes(f.id),
      );
    }),
  );

  // TODO add skeletons
  if (!difficulty || !priceIndices || !activePlaythrough) return null;
  const gameData = getPlaythroughGameData(activePlaythrough);

  const factoriesProductData = factories
    .flatMap((factory) =>
      deriveProductData(
        factory,
        difficulty,
        calculationPeriod,
        priceIndices,
        gameData,
      ),
    )
    .reduce<DerivedDataFromFormValues>((acc, item) => {
      const existing = acc.find((i) => i.name === item.name);
      if (existing) {
        existing.amount += item.amount;
        existing.value += item.value;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, []);

  const profitRowData: ProductRow[] = factoriesProductData.map((item) => ({
    ...item,
    itemName: item.name.replace(/^products\./, ""),
  }));

  const shoppingListData = mergeShoppingLists(
    factories.flatMap(
      (factory) =>
        getFactorySupplyPlan(factory, difficulty, gameData).weeklyList,
    ),
  );

  const tableColumns = (t: Translator): ColumnDef<ProductRow>[] => [
    createColumnWithImage<ProductRow>(t, "itemName", "products"),
    createNumericColumn("amount"),
  ];

  return (
    <div className={cn("px-4", className)}>
      <h3 className="mb-6 text-center">
        {t("tools.playthroughDetail.productionOverview")}
      </h3>

      {profitRowData.length > 0 ? (
        <DataTable
          className="max-w-lg"
          columns={tableColumns(t)}
          data={profitRowData}
        />
      ) : (
        <NoDataFound text={t("tools.playthroughDetail.noProductionData")} />
      )}

      {shoppingListData.length > 0 && (
        <div className="mt-14 min-w-0 overflow-x-auto">
          <hgroup className="max-w-2xl space-y-4">
            <h3 className="text-xl font-semibold">
              {t("tools.playthroughDetail.shoppingList.title")}
            </h3>
            <p>{t("tools.playthroughDetail.shoppingList.desc")}</p>
          </hgroup>

          <div className="mt-10 flex w-full min-w-0 flex-col gap-4 space-y-6">
            {shoppingListData.map((group) => (
              <ImporterTable key={group.importer} data={group} t={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpireOverview;
