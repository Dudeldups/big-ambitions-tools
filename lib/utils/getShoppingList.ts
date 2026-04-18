import { ingredients } from "../game/ingredients";
import { Difficulty } from "../game/types";
import { FactoryFormValues } from "../schemas/factory";
import { getTimeMultiplier } from "./getTimeMultiplier";
import { getImportPrice } from "../calculations/math";
import { calculateIngredientTotals } from "../calculations/calculateIngredientTotals";

export type ImporterShoppingList = {
  importer: string;
  items: {
    name: string;
    amount: number;
    value: number;
  }[];
};

export const getShoppingList = (
  values: FactoryFormValues,
  difficulty: Difficulty,
): ImporterShoppingList[] => {
  const { workstations, openingHours } = values;
  const timeMult = getTimeMultiplier("weekly", openingHours);

  const totalAmounts = calculateIngredientTotals(workstations);

  const ingredientEntries = Object.entries(totalAmounts).map(
    ([name, amount]) => {
      const ingredient = ingredients[name as keyof typeof ingredients];

      const totalAmount = amount * timeMult;
      const totalCost =
        getImportPrice(ingredient.wholesalePrice, difficulty) *
        amount *
        timeMult;

      return {
        key: name,
        name,
        amount: totalAmount,
        value: totalCost,
        importers: ingredient.importers,
      };
    },
  );

  const importerMap = new Map<string, ImporterShoppingList["items"]>();

  for (const ing of ingredientEntries) {
    if (ing.importers.length === 1) {
      const importer = ing.importers[0];

      if (!importerMap.has(importer)) {
        importerMap.set(importer, []);
      }

      importerMap.get(importer)!.push({
        name: ing.name,
        amount: ing.amount,
        value: ing.value,
      });
    }
  }

  for (const ing of ingredientEntries) {
    if (ing.importers.length <= 1) continue;

    const existingImporter = ing.importers.find((imp) => importerMap.has(imp));

    const chosenImporter =
      existingImporter ??
      ing.importers.reduce((best, current) => {
        const bestCount = importerMap.get(best)?.length ?? 0;
        const currentCount = importerMap.get(current)?.length ?? 0;
        return currentCount > bestCount ? current : best;
      });

    if (!importerMap.has(chosenImporter)) {
      importerMap.set(chosenImporter, []);
    }

    importerMap.get(chosenImporter)!.push({
      name: ing.name,
      amount: ing.amount,
      value: ing.value,
    });
  }

  return Array.from(importerMap.entries()).map(([importer, items]) => ({
    importer,
    items,
  }));
};

type SplitShoppingList = {
  factoryList: ImporterShoppingList[];
  externalList: ImporterShoppingList[];
};

export function splitShoppingListByShelves(
  list: ImporterShoppingList[],
  requiredShelves: number,
  availableShelves: number,
): SplitShoppingList {
  if (requiredShelves <= 0 || availableShelves >= requiredShelves) {
    return { factoryList: list, externalList: [] };
  }

  const factoryRatio = Math.min(availableShelves / requiredShelves, 1);
  const externalRatio = 1 - factoryRatio;

  const split = (ratio: number): ImporterShoppingList[] =>
    list.map((entry) => ({
      importer: entry.importer,
      items: entry.items.map((item) => ({
        name: item.name,
        amount: Math.round(item.amount * ratio),
        value: item.value * ratio,
      })),
    }));

  return {
    factoryList: split(factoryRatio),
    externalList: split(externalRatio),
  };
}
