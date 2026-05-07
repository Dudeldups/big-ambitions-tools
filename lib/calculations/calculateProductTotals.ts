import { ProductName } from "../game/productNames";
import { products } from "../game/products";
import { FormWorkstations } from "../schemas/factory";
import { getEffectiveProductionByProduct } from "./getEffectiveProductionByProduct";

export function calculateProductTotals(
  workstations: FormWorkstations,
  options?: { limited?: boolean; openingHours?: number },
): Record<ProductName, number> {
  if (options?.limited && options.openingHours) {
    const productData = getEffectiveProductionByProduct(
      workstations,
      options.openingHours,
    );

    return Object.fromEntries(
      Object.entries(productData).map(([productName, data]) => [
        productName,
        data.effectiveRatePerHour,
      ]),
    ) as Record<ProductName, number>;
  }

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
