import { Factory } from "../stores/playthroughStore";
import { GameData } from "../game/types";
import { getOptimalPalletShelfAmount } from "./getOptimalPalletShelfAmount";

export function getMissingPalletShelvesTotal(
  factories: (Factory | undefined)[],
  gameData: GameData,
): number {
  return factories.reduce((acc, f) => {
    if (!f) return acc;

    const required = getOptimalPalletShelfAmount(
      f.workstations,
      gameData,
    ).external;

    const missing = Math.max(required - f.shelfAmount, 0);

    return acc + missing;
  }, 0);
}
