"use client";

import {
  deriveEmployeeCost,
  derivePalletShelfData,
  deriveWorkstationData,
} from "@/lib/calculations/derivedFactoryData";
import { FactoryFormValues } from "@/lib/schemas/factory";
import InfoTable from "../tables/info-table";
import { useTranslations } from "next-intl";
import { Separator } from "../ui/separator";
import { EmployeeName } from "@/lib/game/employeeNames";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";

type FactoryOverviewProps = {
  values: FactoryFormValues;
};

const FactoryOverview = ({ values }: FactoryOverviewProps) => {
  const t = useTranslations();
  const { difficulty } = useActivePlaythrough().activePlaythrough;

  const oneTimeCostRowData = [
    ...derivePalletShelfData(values),
    ...deriveWorkstationData(values),
  ];

  const employeeRows = Object.entries(values.employees ?? {})
    .filter(([, data]) => (data?.amount ?? 0) > 0)
    .map(([key, { amount = 0 }]) => {
      const employeeName = key as EmployeeName;

      return {
        name: employeeName,
        amount,
        cost: amount * deriveEmployeeCost(employeeName, values),
      };
    });

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-center font-semibold">One-time costs</h2>

        <InfoTable label="itemName" rows={oneTimeCostRowData} />
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-center font-semibold">Recurring weekly costs</h2>
      </div>
    </div>
  );
};

export default FactoryOverview;
