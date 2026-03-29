"use client";

import {
  deriveEmployeeData,
  deriveIngredientData,
  derivePalletShelfData,
  deriveVehicleData,
  deriveWorkstationData,
} from "@/lib/calculations/derivedFactoryData";
import { FactoryFormValues } from "@/lib/schemas/factory";
import InfoTable from "../tables/info-table";
import { useTranslations } from "next-intl";
import { Separator } from "../ui/separator";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";

type FactoryOverviewProps = {
  values: FactoryFormValues;
};

const FactoryOverview = ({ values }: FactoryOverviewProps) => {
  const t = useTranslations();
  const { difficulty } = useActivePlaythrough().activePlaythrough;

  const oneTimeCostRowData = [
    ...derivePalletShelfData(values),
    ...deriveVehicleData(values),
    ...deriveWorkstationData(values),
  ];

  const recurringCostRowData = [
    ...deriveEmployeeData(values),
    ...deriveIngredientData(values, difficulty),
  ];

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-center font-semibold">One-time costs</h2>

        <InfoTable label="itemName" rows={oneTimeCostRowData} />
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-center font-semibold">Recurring weekly costs</h2>

        <InfoTable label="description" rows={recurringCostRowData} />
      </div>
    </div>
  );
};

export default FactoryOverview;
