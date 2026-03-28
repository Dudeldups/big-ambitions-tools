import { workstations } from "../game/machines";
import { getWorkstationPrice } from "./math";

export const deriveWorkstationCost = (wsName: string | undefined): number => {
  if (!wsName) return 0;
  const workstation = workstations[wsName as keyof typeof workstations];
  if (!workstation) return 0;
  return getWorkstationPrice(workstation);
};
