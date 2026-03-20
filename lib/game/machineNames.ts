export const MACHINE_NAMES = [
  "Automated Baking Machine",
  "Bottling Machine",
  "Consumer Goods Assembly Machine",
  "Food Assembly Machine",
  "Hydroponic Planter",
  "Industrial Blending Machine",
  "Industrial Sewing Machine",
  "Kiln Machine",
  "Laser Cutting Machine",
  "Polishing Machine",
] as const;

export const WORKSTATION_NAMES = [
  "Clothing Workstation",
  "Electronics Workstation",
  "Jewelry Workstation",
  "Consumer Goods Workstation",
  "Bottled Goods Workstation",
  "Food Workstation",
  "Garden Workstation",
] as const;

export type MachineName = (typeof MACHINE_NAMES)[number];
export type WorkstationName = (typeof WORKSTATION_NAMES)[number];
