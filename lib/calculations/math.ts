import {
  AVERAGE_DISCTRICT_MULT,
  BASE_PRODUCT_PRICE_INDEX,
  DISPLAY_PRICE_OPTIONS,
  EXPORT_PRICE_MULT,
  PUBLIC_PRICE_MULT,
  SALARY_BASE_MULT,
  SALARY_DIFF_MULT,
  TAX_RATE,
} from "../constants";
import { IMPORT_PRICE_BASE_MULT } from "../constants";
import { EmployeeName } from "../game/employeeNames";
import { requireEmployee, requireMachine } from "../game/requireGameData";
import { Difficulty, GameData, Product, Workstation } from "../game/types";
import { DisplayPrices } from "../stores/appStore";
import { getIngredientDataForProduct } from "../utils/getIngredientDataForProduct";

export const getImportPrice = (
  wholesalePrice: number,
  difficulty: Difficulty,
  priceIndex: number = BASE_PRODUCT_PRICE_INDEX,
) => {
  return (
    wholesalePrice *
    IMPORT_PRICE_BASE_MULT *
    PUBLIC_PRICE_MULT[difficulty] *
    priceIndex
  );
};

export const getExportPrice = (
  wholesalePrice: number,
  difficulty: Difficulty,
  priceIndex: number = BASE_PRODUCT_PRICE_INDEX,
) => {
  return (
    wholesalePrice *
    PUBLIC_PRICE_MULT[difficulty] *
    EXPORT_PRICE_MULT[difficulty] *
    priceIndex
  );
};

export const getPriceIndexFromExportPrice = (
  exportPrice: number,
  wholesalePrice: number,
  difficulty: Difficulty,
) => {
  return (
    exportPrice /
    (wholesalePrice *
      PUBLIC_PRICE_MULT[difficulty] *
      EXPORT_PRICE_MULT[difficulty])
  );
};

export const getAverageRetailPrice = (product: Product): number =>
  product.defaultMarketPrice * AVERAGE_DISCTRICT_MULT;

export const getEmployeeSalary = (
  employeeName: EmployeeName,
  difficulty: Difficulty,
  gameData: GameData,
) => {
  const employee = requireEmployee(gameData, employeeName);

  return Math.round(
    SALARY_BASE_MULT * SALARY_DIFF_MULT[difficulty] * employee.baseHourlyWage,
  );
};

export const getManufacturePrice = (
  product: Product,
  difficulty: Difficulty,
  gameData: GameData,
  factoryWorkerSalary?: number,
): number => {
  const employeeSalary =
    factoryWorkerSalary ??
    getEmployeeSalary("factoryWorker", difficulty, gameData);
  const ingredientData = getIngredientDataForProduct(
    product,
    difficulty,
    gameData,
  );
  const totalIngredientPrice = ingredientData.reduce(
    (acc, ingredient) => acc + ingredient.cost,
    0,
  );
  const ingredientPricePerItem = totalIngredientPrice / product.productionRate;
  const employeeCostPerItem = employeeSalary / product.productionRate;
  return ingredientPricePerItem + employeeCostPerItem;
};

export const getProfitMarginForProduct = (
  product: Product,
  difficulty: Difficulty,
  gameData: GameData,
  priceIndex: number = BASE_PRODUCT_PRICE_INDEX,
  displayPrices: DisplayPrices = {
    source: DISPLAY_PRICE_OPTIONS.SOURCE.MANUFACTURE,
    target: DISPLAY_PRICE_OPTIONS.TARGET.EXPORT,
  },
) => {
  const { source, target } = displayPrices;

  const salePrice =
    target === DISPLAY_PRICE_OPTIONS.TARGET.RETAIL
      ? getAverageRetailPrice(product)
      : getExportPrice(product.wholesalePrice, difficulty, priceIndex);

  const costPerItem =
    source === DISPLAY_PRICE_OPTIONS.SOURCE.MANUFACTURE
      ? getManufacturePrice(product, difficulty, gameData)
      : getImportPrice(product.wholesalePrice, difficulty, priceIndex);

  const taxMult = 1 - TAX_RATE[difficulty];

  const margin = salePrice * taxMult - costPerItem;
  const marginPercent = salePrice !== 0 ? (margin / salePrice) * 100 : 0;

  return { margin, marginPercent };
};

export const getProfitPerHourForProduct = (
  product: Product,
  difficulty: Difficulty,
  gameData: GameData,
  priceIndex: number = BASE_PRODUCT_PRICE_INDEX,
  displayPrices: DisplayPrices = {
    source: DISPLAY_PRICE_OPTIONS.SOURCE.MANUFACTURE,
    target: DISPLAY_PRICE_OPTIONS.TARGET.EXPORT,
  },
) =>
  getProfitMarginForProduct(
    product,
    difficulty,
    gameData,
    priceIndex,
    displayPrices,
  ).margin * product.productionRate;

export function getWorkstationPrice(ws: Workstation, gameData: GameData) {
  return ws.neededMachines.reduce(
    (sum, machineName) =>
      sum + requireMachine(gameData, machineName).purchasePrice,
    0,
  );
}

export const ceilWithTolerance = (value: number, tolerance = 1e-9) =>
  Math.ceil(value - tolerance);
