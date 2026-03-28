import { workstations } from "../game/machines";
import { vehicles } from "../game/vehicles";
import { getWorkstationPrice } from "./math";

export const deriveWorkstationCost = (wsName: string | undefined): number => {
  if (!wsName) return 0;
  const workstation = workstations[wsName as keyof typeof workstations];
  if (!workstation) return 0;
  return getWorkstationPrice(workstation);
};

export const deriveVehicleCost = (vehicleName: string | undefined): number => {
  if (!vehicleName) return 0;
  const vehicle = vehicles[vehicleName as keyof typeof vehicles];
  if (!vehicle) return 0;
  return vehicle.purchasePrice;
};
