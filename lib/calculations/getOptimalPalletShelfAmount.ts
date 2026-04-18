import { IngredientName } from "../game/ingredientNames";
import { ingredients } from "../game/ingredients";
import { shelves } from "../game/inventory";
import { FormWorkstations } from "../schemas/factory";
import { calculateIngredientTotals } from "./calculateIngredientTotals";

export const getOptimalPalletShelfAmount = (
  workstations: FormWorkstations,
): { daily: number; weekly: number } => {
  if (workstations.length === 0) return { daily: 0, weekly: 0 };

  const ingredientTotals = calculateIngredientTotals(workstations);

  const totalBoxAmountPerHour = (
    Object.entries(ingredientTotals) as [IngredientName, number][]
  )
    .map(([iName, amount]) => amount / ingredients[iName].amountPerBox)
    .reduce((sum, amount) => sum + amount, 0);

  const shelfAmountPerHour =
    totalBoxAmountPerHour / shelves.palletShelf.storageCapacity;

  const dailyPalletShelfAmount = Math.ceil(shelfAmountPerHour * 24);
  const weeklyPalletShelfAmount = Math.ceil(shelfAmountPerHour * 168);

  return {
    daily: dailyPalletShelfAmount,
    weekly: weeklyPalletShelfAmount,
  };
};
