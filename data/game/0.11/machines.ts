import { MachineName, WorkstationName } from "@/lib/game/machineNames";
import { Machine, Workstation } from "@/lib/game/types";

export const machines = {
  automatedBakingMachine: {
    purchasePrice: 75000,
  },
  bottlingMachine: {
    purchasePrice: 95000,
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
} as const satisfies Partial<Record<MachineName, Machine>>;

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
} as const satisfies Partial<Record<WorkstationName, Workstation>>;
