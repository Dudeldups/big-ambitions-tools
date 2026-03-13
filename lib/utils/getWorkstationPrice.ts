import { machines, Workstation } from "../game/machines";

export function getWorkstationPrice(ws: Workstation) {
  return ws.neededMachines.reduce(
    (sum, machineName) => sum + machines[machineName].purchasePrice,
    0,
  );
}
