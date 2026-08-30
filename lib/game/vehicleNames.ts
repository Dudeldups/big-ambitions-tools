export const VEHICLE_NAMES = [
  "AnselmoAF90",
  "VordPony",
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
  "LytteL6",
  "Limo",
] as const;

export type VehicleName = (typeof VEHICLE_NAMES)[number];
