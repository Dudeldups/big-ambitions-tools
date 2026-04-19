import { IngredientName } from "../game/ingredientNames";
import { ingredients } from "../game/ingredients";
import { shelves } from "../game/inventory";
import { ProductName } from "../game/productNames";
import { products } from "../game/products";
import { FormWorkstations } from "../schemas/factory";
import { calculateIngredientTotals } from "./calculateIngredientTotals";
import { calculateProductTotals } from "./calculateProductTotals";

type OptimalPalletShelves = {
  daily: number;
  weekly: number;
  external: number;
  isOverflowing: boolean;
};

export const getOptimalPalletShelfAmount = (
  workstations: FormWorkstations,
): OptimalPalletShelves => {
  if (workstations.length === 0)
    return { daily: 0, weekly: 0, external: 0, isOverflowing: false };

  const ingredientTotals = calculateIngredientTotals(workstations);
  const productTotals = calculateProductTotals(workstations);

  const totalIngBoxesPerHour = (
    Object.entries(ingredientTotals) as [IngredientName, number][]
  )
    .map(([iName, amount]) => amount / ingredients[iName].amountPerBox)
    .reduce((sum, amount) => sum + amount, 0);

  const totalProdBoxesPerHour = Object.entries(productTotals).reduce(
    (acc, [pName, amount]) => {
      const product = products[pName as ProductName];
      return acc + amount / product.amountPerBox;
    },
    0,
  );

  const dailyIngBoxes = totalIngBoxesPerHour * 24;

  const dailyOverflow = Math.max(
    0,
    (totalProdBoxesPerHour - totalIngBoxesPerHour) * 24,
  );

  const netDailyBoxes = dailyIngBoxes + dailyOverflow;

  const dailyPalletShelfAmount = Math.ceil(
    netDailyBoxes / shelves.palletShelf.storageCapacity,
  );
  const weeklyPalletShelfAmount = Math.ceil(
    (dailyIngBoxes * 7 + dailyOverflow) / shelves.palletShelf.storageCapacity,
  );
  const externalPalletShelfAmount = Math.ceil(
    (dailyIngBoxes * 7) / shelves.palletShelf.storageCapacity,
  );

  return {
    daily: dailyPalletShelfAmount,
    weekly: weeklyPalletShelfAmount,
    external: externalPalletShelfAmount,
    isOverflowing: dailyOverflow > 0,
  };
};
