import { ceilWithTolerance } from "../calculations/math";
import { IngredientName } from "../game/ingredientNames";
import { requireIngredient } from "../game/requireGameData";
import { GameData } from "../game/types";
import { ImporterShoppingList } from "./getShoppingList";

type SplitShoppingList = {
  factoryList: ImporterShoppingList[];
  externalList: ImporterShoppingList[];
};

export const splitShoppingListByShelves = (
  list: ImporterShoppingList[],
  requiredShelves: number,
  availableShelves: number,
  gameData: GameData,
): SplitShoppingList => {
  if (requiredShelves <= 0 || availableShelves >= requiredShelves) {
    return { factoryList: list, externalList: [] };
  }
  if (availableShelves <= 0) {
    return { factoryList: [], externalList: list };
  }

  const factoryRatio = availableShelves / requiredShelves;
  const factoryList: ImporterShoppingList[] = [];
  const externalList: ImporterShoppingList[] = [];

  for (const entry of list) {
    const factoryItems: ImporterShoppingList["items"] = [];
    const externalItems: ImporterShoppingList["items"] = [];

    for (const item of entry.items) {
      if (item.amount <= 0) continue;
      const { amountPerBox } = requireIngredient(
        gameData,
        item.name as IngredientName,
      );
      // Round the direct share to boxes without buying more than the weekly need.
      const factoryAmount = Math.min(
        item.amount,
        ceilWithTolerance((item.amount * factoryRatio) / amountPerBox) *
          amountPerBox,
      );
      const remainingAmount = item.amount - factoryAmount;
      const factoryValue = item.value * (factoryAmount / item.amount);

      factoryItems.push({
        name: item.name,
        amount: factoryAmount,
        value: factoryValue,
      });
      if (remainingAmount > 0) {
        externalItems.push({
          name: item.name,
          amount: remainingAmount,
          value: item.value - factoryValue,
        });
      }
    }
    if (factoryItems.length > 0) {
      factoryList.push({ importer: entry.importer, items: factoryItems });
    }
    if (externalItems.length > 0) {
      externalList.push({ importer: entry.importer, items: externalItems });
    }
  }

  return { factoryList, externalList };
};
