import { Factory } from "../stores/playthroughStore";
import { getOptimalPalletShelfAmount } from "./getOptimalPalletShelfAmount";

export function getMissingPalletShelvesTotal(
  factories: (Factory | undefined)[],
): number {
  return factories.reduce((acc, f) => {
    if (!f) return acc;

    const required = getOptimalPalletShelfAmount(f.workstations).external;

    const missing = Math.max(required - f.shelfAmount, 0);

    return acc + missing;
  }, 0);
}
