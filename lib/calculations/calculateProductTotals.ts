import { ProductName } from "../game/productNames";
import { products } from "../game/products";
import { FormWorkstations } from "../schemas/factory";

export function calculateProductTotals(
  workstations: FormWorkstations,
): Record<ProductName, number> {
  return workstations.reduce(
    (acc, ws) => {
      const product = products[ws.product];

      const itemsPerHour = ws.amount * product.productionRate;

      acc[ws.product] = (acc[ws.product] ?? 0) + itemsPerHour;

      return acc;
    },
    {} as Record<ProductName, number>,
  );
}
