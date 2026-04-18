import { IngredientName } from "../game/ingredientNames";
import { products } from "../game/products";
import { FormWorkstations } from "../schemas/factory";

type IngredientTotals = Record<IngredientName, number>;

export function calculateIngredientTotals(
  workstations: FormWorkstations,
): IngredientTotals {
  return workstations.reduce((acc, ws) => {
    const product = products[ws.product];

    product.ingredients.forEach((ingredientGroup) => {
      Object.entries(ingredientGroup).forEach(([name, amount]) => {
        if (amount === undefined) return;

        const key = name as IngredientName;
        acc[key] = (acc[key] ?? 0) + amount * ws.amount;
      });
    });

    return acc;
  }, {} as IngredientTotals);
}
