export const MACHINE_NAMES = [
  "automatedBakingMachine",
  "bottlingMachine",
  "consumerGoodsAssemblyMachine",
  "foodAssemblyMachine",
  "hydroponicPlanter",
  "industrialBlendingMachine",
  "industrialSewingMachine",
  "kilnMachine",
  "laserCuttingMachine",
  "polishingMachine",
] as const;

export const WORKSTATION_NAMES = [
  "clothingWorkstation",
  "electronicsWorkstation",
  "jewelryWorkstation",
  "consumerGoodsWorkstation",
  "bottledGoodsWorkstation",
  "foodWorkstation",
  "gardenWorkstation",
] as const;

export type MachineName = (typeof MACHINE_NAMES)[number];
export type WorkstationName = (typeof WORKSTATION_NAMES)[number];
