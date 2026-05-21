import { IngredientName } from "../game/ingredientNames";
import { GameData } from "../game/types";
import { FormWorkstations } from "../schemas/factory";
import { getEffectiveProductionByProduct } from "./getEffectiveProductionByProduct";

type IngredientTotals = Record<IngredientName, number>;

function calculateIngredientTotalsInternal(
  workstations: FormWorkstations,
  gameData: GameData,
  productionRatioByProduct?: ReturnType<typeof getEffectiveProductionByProduct>,
): IngredientTotals {
  return workstations.reduce((acc, ws) => {
    const product = gameData.products[ws.product]!;
    const productionData = productionRatioByProduct?.[ws.product];
    const factor =
      productionData && productionData.fullRatePerHour > 0
        ? productionData.effectiveRatePerHour / productionData.fullRatePerHour
        : 1;

    product.ingredients.forEach((ingredientGroup) => {
      Object.entries(ingredientGroup).forEach(([name, amount]) => {
        if (amount === undefined) return;

        const key = name as IngredientName;
        acc[key] = (acc[key] ?? 0) + amount * ws.amount * factor;
      });
    });

    return acc;
  }, {} as IngredientTotals);
}

export function calculateIngredientTotals(
  workstations: FormWorkstations,
  gameData: GameData,
): IngredientTotals {
  return calculateIngredientTotalsInternal(workstations, gameData);
}

export function calculateLimitedIngredientTotals(
  workstations: FormWorkstations,
  openingHours: number,
  gameData: GameData,
): IngredientTotals {
  return calculateIngredientTotalsInternal(
    workstations,
    gameData,
    getEffectiveProductionByProduct(workstations, openingHours, gameData),
  );
}
