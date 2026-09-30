import { getOptimalPalletShelfAmounts } from "../calculations/getOptimalPalletShelfAmount";
import { Difficulty, GameData } from "../game/types";
import { FactoryFormValues } from "../schemas/factory";
import { getShoppingList } from "./getShoppingList";
import { splitShoppingListByShelves } from "./splitShoppingListByShelves";
import { usesSeparatePurchasingAgent } from "./usesSeparatePurchasingAgent";

export const getFactorySupplyPlan = (
  factory: FactoryFormValues,
  difficulty: Difficulty,
  gameData: GameData,
) => {
  const weeklyList = getShoppingList(factory, difficulty, gameData)
    .map((entry) => ({
      ...entry,
      items: entry.items.filter((item) => item.amount > 0),
    }))
    .filter((entry) => entry.items.length > 0);
  const shelves = getOptimalPalletShelfAmounts(
    factory.workstations,
    factory.openingHours,
    gameData,
  );
  const requiredFactoryShelves = (shelves.limited ?? shelves.full).weekly;

  if (!usesSeparatePurchasingAgent(factory)) {
    return {
      weeklyList,
      factoryList: [],
      warehouseList: weeklyList,
      requiredFactoryShelves,
    };
  }

  const { factoryList, externalList } = splitShoppingListByShelves(
    weeklyList,
    requiredFactoryShelves,
    factory.shelfAmount,
    gameData,
  );

  return {
    weeklyList,
    factoryList,
    warehouseList: externalList,
    requiredFactoryShelves,
  };
};
