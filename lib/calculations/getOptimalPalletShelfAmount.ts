import { IngredientName } from "../game/ingredientNames";
import { ingredients } from "../game/ingredients";
import { shelves } from "../game/inventory";
import { ProductName } from "../game/productNames";
import { products } from "../game/products";
import { FormWorkstations } from "../schemas/factory";
import {
  calculateIngredientTotals,
  calculateLimitedIngredientTotals,
} from "./calculateIngredientTotals";
import {
  calculateLimitedProductTotals,
  calculateProductTotals,
} from "./calculateProductTotals";

type OptimalPalletShelves = {
  daily: number;
  weekly: number;
  external: number;
  isOverflowing: boolean;
};

type OptimalPalletShelfVariants = {
  full: OptimalPalletShelves;
  limited: OptimalPalletShelves | null;
};

const EMPTY_SHELVES: OptimalPalletShelves = {
  daily: 0,
  weekly: 0,
  external: 0,
  isOverflowing: false,
};

const deriveOptimalPalletShelfAmount = (
  ingredientTotals: ReturnType<typeof calculateIngredientTotals>,
  productTotals: ReturnType<typeof calculateProductTotals>,
): OptimalPalletShelves => {
  const { storageCapacity } = shelves.palletShelf;

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
  const overflowFromMonToTue = (dailyOverflow / 24) * 18; // Mon 8 a.m. - Tue 2 a.m.

  const netDailyBoxes = dailyIngBoxes + dailyOverflow;

  return {
    daily: Math.ceil(netDailyBoxes / storageCapacity),
    weekly: Math.ceil(
      (dailyIngBoxes * 7 + overflowFromMonToTue) / storageCapacity,
    ),
    external: Math.ceil((dailyIngBoxes * 7) / storageCapacity),
    isOverflowing: dailyOverflow > 0,
  };
};

export const getOptimalPalletShelfAmounts = (
  workstations: FormWorkstations,
  openingHours: number,
): OptimalPalletShelfVariants => {
  if (workstations.length === 0) {
    return {
      full: EMPTY_SHELVES,
      limited: null,
    };
  }

  const full = deriveOptimalPalletShelfAmount(
    calculateIngredientTotals(workstations),
    calculateProductTotals(workstations),
  );

  const hasProductionLimit = workstations.some(
    (workstation) => workstation.productionLimit !== undefined,
  );

  if (!hasProductionLimit) {
    return { full, limited: null };
  }

  const limited = deriveOptimalPalletShelfAmount(
    calculateLimitedIngredientTotals(workstations, openingHours),
    calculateLimitedProductTotals(workstations, openingHours),
  );

  return { full, limited };
};

export const getOptimalPalletShelfAmount = (
  workstations: FormWorkstations,
): OptimalPalletShelves => {
  return getOptimalPalletShelfAmounts(workstations, 24).full;
};
