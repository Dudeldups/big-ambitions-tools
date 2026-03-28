"use client";

import { machines, workstations } from "@/lib/game/machines";
import { DeepPartial } from "@/lib/game/types";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { formatToUSD } from "@/lib/utils/formatToUSD";

interface FactoryOverviewProps {
  values: DeepPartial<FactoryFormValues>;
}

const workstationsData = Object.entries(workstations).map(([key, value]) => ({
  name: key,
  ...value,
}));
const machinesData = Object.entries(machines).map(([key, value]) => ({
  name: key,
  ...value,
}));

const calculateWorkstationCost = (wsName: string | undefined): number => {
  if (!wsName) return 0;

  const workstation = workstationsData.find((w) => w.name === wsName);
  if (!workstation?.neededMachines?.length) return 0;

  return workstation.neededMachines.reduce((total, machineName) => {
    const machine = machinesData.find((m) => m.name === machineName);
    return total + (machine?.purchasePrice ?? 0);
  }, 0);
};

const FactoryOverview = ({ values }: FactoryOverviewProps) => {
  const workstationCosts =
    values.workstations?.map((ws) => calculateWorkstationCost(ws?.name)) ?? [];

  const totalWorkstationCost = formatToUSD(
    workstationCosts.reduce((sum, cost) => sum + cost, 0),
  );

  return (
    <div>
      <h2>Factory Overview</h2>
      <p>Workstation Costs: {totalWorkstationCost}</p>

      {/* <p>Total Setup Cost: {totalSetupCost}</p> */}
    </div>
  );
};

export default FactoryOverview;
