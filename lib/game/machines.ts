import { MachineName, WorkstationName } from "./machineNames";

export type Machine = {
  purchasePrice: number;
};

export const machines: Record<MachineName, Machine> = {
  "Automated Baking Machine": {
    purchasePrice: 75000,
  },
  "Bottling Machine": {
    purchasePrice: 27500,
  },
  "Consumer Goods Assembly Machine": {
    purchasePrice: 240000,
  },
  "Food Assembly Machine": {
    purchasePrice: 60000,
  },
  "Hydroponic Planter": {
    purchasePrice: 35000,
  },
  "Industrial Blending Machine": {
    purchasePrice: 45000,
  },
  "Industrial Sewing Machine": {
    purchasePrice: 95000,
  },
  "Kiln Machine": {
    purchasePrice: 115000,
  },
  "Laser Cutting Machine": {
    purchasePrice: 145000,
  },
  "Polishing Machine": {
    purchasePrice: 125000,
  },
};

export type Workstation = {
  neededMachines: MachineName[];
};

export const workstations: Record<WorkstationName, Workstation> = {
  "Clothing Workstation": {
    neededMachines: [
      "Consumer Goods Assembly Machine",
      "Industrial Sewing Machine",
      "Laser Cutting Machine",
    ],
  },
  "Electronics Workstation": {
    neededMachines: [
      "Consumer Goods Assembly Machine",
      "Laser Cutting Machine",
      "Kiln Machine",
    ],
  },
  "Jewelry Workstation": {
    neededMachines: [
      "Consumer Goods Assembly Machine",
      "Polishing Machine",
      "Laser Cutting Machine",
    ],
  },
  "Consumer Goods Workstation": {
    neededMachines: [
      "Consumer Goods Assembly Machine",
      "Laser Cutting Machine",
    ],
  },
  "Bottled Goods Workstation": {
    neededMachines: [
      "Food Assembly Machine",
      "Bottling Machine",
      "Industrial Blending Machine",
    ],
  },
  "Food Workstation": {
    neededMachines: [
      "Food Assembly Machine",
      "Automated Baking Machine",
      "Industrial Blending Machine",
    ],
  },
  "Garden Workstation": {
    neededMachines: ["Food Assembly Machine", "Hydroponic Planter"],
  },
};
