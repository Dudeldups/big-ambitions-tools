import { MachineName, WorkstationName } from "./machineNames";

export type Machine = {
  id: number;
  purchasePrice: number;
};

export const machines = {
  industrialBlendingMachine: {
    id: 371,
    purchasePrice: 45000,
  },
  automatedBakingMachine: {
    id: 372,
    purchasePrice: 75000,
  },
  foodAssemblyMachine: {
    id: 376,
    purchasePrice: 60000,
  },
  industrialSewingMachine: {
    id: 421,
    purchasePrice: 95000,
  },
  consumerGoodsAssemblyMachine: {
    id: 425,
    purchasePrice: 240000,
  },
  laserCuttingMachine: {
    id: 441,
    purchasePrice: 145000,
  },
  polishingMachine: {
    id: 442,
    purchasePrice: 125000,
  },
  kilnMachine: {
    id: 444,
    purchasePrice: 115000,
  },
  bottlingMachine: {
    id: 468,
    purchasePrice: 27500,
  },
  hydroponicPlanter: {
    id: 698,
    purchasePrice: 35000,
  },
} as const satisfies Record<MachineName, Machine>;

export type Workstation = {
  neededMachines: MachineName[];
};

export const workstations = {
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
} as const satisfies Record<WorkstationName, Workstation>;
