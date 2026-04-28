"use client";

import {
  DerivedDataFromFormValues,
  deriveProductData,
} from "@/lib/calculations/derivedFactoryData";
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

  const factoriesProductData = factories
    .flatMap((factory) =>
      deriveProductData(factory, difficulty, calculationPeriod, priceIndices),
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
    </div>
  );
};

export default EmpireOverview;
