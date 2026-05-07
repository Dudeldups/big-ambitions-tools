import { IngredientName } from "../game/ingredientNames";
import { products } from "../game/products";
import { FormWorkstations } from "../schemas/factory";
import { getEffectiveProductionByProduct } from "./getEffectiveProductionByProduct";

type IngredientTotals = Record<IngredientName, number>;

function calculateIngredientTotalsInternal(
  workstations: FormWorkstations,
  productionRatioByProduct?: ReturnType<typeof getEffectiveProductionByProduct>,
): IngredientTotals {
  return workstations.reduce((acc, ws) => {
    const product = products[ws.product];
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
): IngredientTotals {
  return calculateIngredientTotalsInternal(workstations);
}

export function calculateLimitedIngredientTotals(
  workstations: FormWorkstations,
  openingHours: number,
): IngredientTotals {
  return calculateIngredientTotalsInternal(
    workstations,
    getEffectiveProductionByProduct(workstations, openingHours),
  );
}
