import { Difficulty, GameData } from "../game/types";
import { IngredientName } from "../game/ingredientNames";
import { requireIngredient } from "../game/requireGameData";
import { FactoryFormValues } from "../schemas/factory";
import { getTimeMultiplier } from "./getTimeMultiplier";
import { ceilWithTolerance, getImportPrice } from "../calculations/math";
import { calculateLimitedIngredientTotals } from "../calculations/calculateIngredientTotals";

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
  gameData: GameData,
): ImporterShoppingList[] => {
  const { workstations, openingHours } = values;
  const timeMult = getTimeMultiplier("weekly", openingHours);

  const totalAmounts = calculateLimitedIngredientTotals(
    workstations,
    openingHours,
    gameData,
  );

  const ingredientEntries = Object.entries(totalAmounts).map(
    ([name, amount]) => {
      const ingredient = requireIngredient(gameData, name as IngredientName);

      const totalAmount = ceilWithTolerance(amount * timeMult);
      const totalCost =
        getImportPrice(ingredient.wholesalePrice, difficulty) * totalAmount;

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
