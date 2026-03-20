export const IMPORTER_NAMES = [
  "jetcargo",
  "seaside",
  "unitedocean",
  "bluestone",
  "lunartide",
  "maritimefreight",
  "aquaticbay",
  "globalharvest",
] as const;

export type Importer = (typeof IMPORTER_NAMES)[number];
