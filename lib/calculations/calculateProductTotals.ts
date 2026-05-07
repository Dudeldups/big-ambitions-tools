import { ProductName } from "../game/productNames";
import { products } from "../game/products";
import { FormWorkstations } from "../schemas/factory";
import { getEffectiveProductionByProduct } from "./getEffectiveProductionByProduct";

function calculateProductTotalsInternal(
  workstations: FormWorkstations,
  productData?: ReturnType<typeof getEffectiveProductionByProduct>,
): Record<ProductName, number> {
  if (productData) {
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

export function calculateProductTotals(
  workstations: FormWorkstations,
): Record<ProductName, number> {
  return calculateProductTotalsInternal(workstations);
}

export function calculateLimitedProductTotals(
  workstations: FormWorkstations,
  openingHours: number,
): Record<ProductName, number> {
  return calculateProductTotalsInternal(
    workstations,
    getEffectiveProductionByProduct(workstations, openingHours),
  );
}
