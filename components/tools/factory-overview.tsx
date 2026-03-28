"use client";

import { deriveWorkstationCost } from "@/lib/calculations/derivedFactoryData";
import { DeepPartial } from "@/lib/game/types";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { formatToUSD } from "@/lib/utils/formatToUSD";
import InfoTable from "../tables/info-table";
import { useTranslations } from "next-intl";

type FactoryOverviewProps = {
  values: DeepPartial<FactoryFormValues>;
};

const FactoryOverview = ({ values }: FactoryOverviewProps) => {
  const t = useTranslations();

  const workstationRows =
    values.workstations?.map((ws) => ({
      name: ws?.name ?? "",
      cost: deriveWorkstationCost(ws?.name),
    })) ?? [];

  const totalWorkstationCost = workstationRows.reduce(
    (sum, row) => sum + row.cost,
    0,
  );

  return (
    <div>
      <InfoTable
        headers={["workstation", "purchasePrice"]}
        rows={workstationRows.map((ws) => ({
          label: t(`workstations.${ws.name}`),
          value: formatToUSD(ws.cost),
        }))}
        total={formatToUSD(totalWorkstationCost)}
      />
    </div>
  );
};

export default FactoryOverview;
