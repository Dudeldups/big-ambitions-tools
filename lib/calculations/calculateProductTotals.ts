import { ProductName } from "../game/productNames";
import { GameData } from "../game/types";
import { FormWorkstations } from "../schemas/factory";
import { getEffectiveProductionByProduct } from "./getEffectiveProductionByProduct";

function calculateProductTotalsInternal(
  workstations: FormWorkstations,
  gameData: GameData,
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
      const product = gameData.products[ws.product]!;

      const itemsPerHour = ws.amount * product.productionRate;

      acc[ws.product] = (acc[ws.product] ?? 0) + itemsPerHour;

      return acc;
    },
    {} as Record<ProductName, number>,
  );
}

export function calculateProductTotals(
  workstations: FormWorkstations,
  gameData: GameData,
): Record<ProductName, number> {
  return calculateProductTotalsInternal(workstations, gameData);
}

export function calculateLimitedProductTotals(
  workstations: FormWorkstations,
  openingHours: number,
  gameData: GameData,
): Record<ProductName, number> {
  return calculateProductTotalsInternal(
    workstations,
    gameData,
    getEffectiveProductionByProduct(workstations, openingHours, gameData),
  );
}
