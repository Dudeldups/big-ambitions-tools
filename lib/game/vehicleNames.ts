export const VEHICLE_ITEM_NAMES = [
  "AnselmoAF90",
  "VordPony",
  "ElectricScooter",
  "Bima320",
  "PetrollsFanton",
  "VordTiaraVic",
  "MersaidiS500",
  "MersaidiMGAGT",
  "HonzaMimic",
  "Ferdinand112",
  "UMCNunavut",
  "VordV150",
  "DeliveryTruck",
  "FreightTruckT1",
  "MersaidiDash",
] as const;

export type VehicleItemName = (typeof VEHICLE_ITEM_NAMES)[number];
