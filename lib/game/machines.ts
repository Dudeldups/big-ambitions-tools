import { MachineName, WorkstationName } from "./machineNames";

export type Machine = {
  purchasePrice: number;
};

export const machines: Record<MachineName, Machine> = {
  automatedBakingMachine: {
    purchasePrice: 75000,
  },
  bottlingMachine: {
    purchasePrice: 27500,
  },
  consumerGoodsAssemblyMachine: {
    purchasePrice: 240000,
  },
  foodAssemblyMachine: {
    purchasePrice: 60000,
  },
  hydroponicPlanter: {
    purchasePrice: 35000,
  },
  industrialBlendingMachine: {
    purchasePrice: 45000,
  },
  industrialSewingMachine: {
    purchasePrice: 95000,
  },
  kilnMachine: {
    purchasePrice: 115000,
  },
  laserCuttingMachine: {
    purchasePrice: 145000,
  },
  polishingMachine: {
    purchasePrice: 125000,
  },
};

export type Workstation = {
  neededMachines: MachineName[];
};

export const workstations: Record<WorkstationName, Workstation> = {
  clothingWorkstation: {
    neededMachines: [
      "consumerGoodsAssemblyMachine",
      "industrialSewingMachine",
      "laserCuttingMachine",
    ],
  },
  electronicsWorkstation: {
    neededMachines: [
      "consumerGoodsAssemblyMachine",
      "laserCuttingMachine",
      "kilnMachine",
    ],
  },
  jewelryWorkstation: {
    neededMachines: [
      "consumerGoodsAssemblyMachine",
      "polishingMachine",
      "laserCuttingMachine",
    ],
  },
  consumerGoodsWorkstation: {
    neededMachines: ["consumerGoodsAssemblyMachine", "laserCuttingMachine"],
  },
  bottledGoodsWorkstation: {
    neededMachines: [
      "foodAssemblyMachine",
      "bottlingMachine",
      "industrialBlendingMachine",
    ],
  },
  foodWorkstation: {
    neededMachines: [
      "foodAssemblyMachine",
      "automatedBakingMachine",
      "industrialBlendingMachine",
    ],
  },
  gardenWorkstation: {
    neededMachines: ["foodAssemblyMachine", "hydroponicPlanter"],
  },
};
