import { Factory } from "../stores/playthroughStore";
import { GameData } from "../game/types";
import { getOptimalPalletShelfAmount } from "./getOptimalPalletShelfAmount";

export function getMissingPalletShelvesTotal(
  factories: (Factory | undefined)[],
  gameData: GameData,
  useFactoryShelves: boolean = true,
): number {
  return factories.reduce((acc, f) => {
    if (!f) return acc;

    const required = getOptimalPalletShelfAmount(
      f.workstations,
      gameData,
    ).external;

    const missing = useFactoryShelves
      ? Math.max(required - f.shelfAmount, 0)
      : required;

    return acc + missing;
  }, 0);
}
