import { Factory } from "../stores/playthroughStore";
import { Difficulty, GameData } from "../game/types";
import { IngredientName } from "../game/ingredientNames";
import { requireIngredient, requireShelf } from "../game/requireGameData";
import { getFactorySupplyPlan } from "../utils/getFactorySupplyPlan";
import { ceilWithTolerance } from "./math";

// Size the warehouse for its actual weekly orders, including mixed strategies.
export function getMissingPalletShelvesTotal(
  factories: (Factory | undefined)[],
  gameData: GameData,
  difficulty: Difficulty = "normal",
): number {
  const amounts = new Map<string, number>();

  for (const factory of factories) {
    if (!factory) continue;
    const { warehouseList } = getFactorySupplyPlan(
      factory,
      difficulty,
      gameData,
    );
    for (const entry of warehouseList) {
      for (const item of entry.items) {
        amounts.set(item.name, (amounts.get(item.name) ?? 0) + item.amount);
      }
    }
  }

  const boxes = Array.from(amounts.entries()).reduce(
    (total, [name, amount]) => {
      const ingredient = requireIngredient(gameData, name as IngredientName);
      return total + ceilWithTolerance(amount / ingredient.amountPerBox);
    },
    0,
  );
  return ceilWithTolerance(
    boxes / requireShelf(gameData, "palletShelf").storageCapacity,
  );
}
