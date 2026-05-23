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

  const factoryRatio = availableShelves / requiredShelves;

  const factoryList: ImporterShoppingList[] = [];
  const externalList: ImporterShoppingList[] = [];

  for (const entry of list) {
    const factoryItems = [];
    const externalItems = [];

    for (const item of entry.items) {
      const ingredientName = item.name as IngredientName;
      const { amountPerBox } = requireIngredient(gameData, ingredientName);

      const rawFactoryAmount = item.amount * factoryRatio;

      // factory rounded to full boxes (fit as much in the factory as possible)
      const factoryBoxes = Math.ceil(rawFactoryAmount / amountPerBox);
      const factoryAmount = factoryBoxes * amountPerBox;

      // remainder goes to external
      const remainingAmount = item.amount - factoryAmount;

      factoryItems.push({
        name: item.name,
        amount: factoryAmount,
        value: item.value * factoryRatio,
      });

      if (remainingAmount > 0) {
        externalItems.push({
          name: item.name,
          amount: remainingAmount,
          value: item.value * (1 - factoryRatio),
        });
      }
    }

    factoryList.push({ importer: entry.importer, items: factoryItems });

    if (externalItems.length > 0) {
      externalList.push({
        importer: entry.importer,
        items: externalItems,
      });
    }
  }

  return { factoryList, externalList };
};
