import { IngredientName } from "../game/ingredientNames";
import { products } from "../game/products";
import { FormWorkstations } from "../schemas/factory";
import { getEffectiveProductionByProduct } from "./getEffectiveProductionByProduct";

type IngredientTotals = Record<IngredientName, number>;

export function calculateIngredientTotals(
  workstations: FormWorkstations,
  options?: { limited?: boolean; openingHours?: number },
): IngredientTotals {
  const productionRatioByProduct =
    options?.limited && options.openingHours
      ? getEffectiveProductionByProduct(workstations, options.openingHours)
      : undefined;

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
