import {
  AVERAGE_DISCTRICT_MULT,
  BASE_PRODUCT_PRICE_INDEX,
  DISPLAY_PRICE_OPTIONS,
  EXPORT_PRICE_MULT,
  PUBLIC_PRICE_MULT,
  SALARY_BASE_MULT,
  SALARY_DIFF_MULT,
} from "../constants";
import { IMPORT_PRICE_BASE_MULT } from "../constants";
import { EmployeeName } from "../game/employeeNames";
import { employees } from "../game/employees";
import { machines, Workstation } from "../game/machines";
import { Product } from "../game/products";
import { Difficulty } from "../game/types";
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

export const getAverageRetailPrice = (product: Product): number =>
  product.defaultMarketPrice * AVERAGE_DISCTRICT_MULT;

export const getEmployeeSalary = (
  employeeName: EmployeeName,
  difficulty: Difficulty,
) => {
  const employee = employees[employeeName];

  return Math.round(
    SALARY_BASE_MULT * SALARY_DIFF_MULT[difficulty] * employee.baseHourlyWage,
  );
};

export const getManufacturePrice = (
  product: Product,
  difficulty: Difficulty,
): number => {
  const ingredientData = getIngredientDataForProduct(product, difficulty);
  const totalIngredientPrice = ingredientData.reduce(
    (acc, ingredient) => acc + ingredient.cost,
    0,
  );
  const ingredientPricePerItem = totalIngredientPrice / product.productionRate;
  const employeeSalary = getEmployeeSalary("factoryWorker", difficulty);
  const employeeCostPerItem = employeeSalary / product.productionRate;
  return ingredientPricePerItem + employeeCostPerItem;
};

export const getProfitMarginForProduct = (
  product: Product,
  difficulty: Difficulty,
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

  const costPerItem = (() => {
    if (source === DISPLAY_PRICE_OPTIONS.SOURCE.MANUFACTURE) {
      return getManufacturePrice(product, difficulty);
    } else {
      return (
        getImportPrice(product.wholesalePrice, difficulty, priceIndex) /
        product.productionRate
      );
    }
  })();

  const margin = salePrice - costPerItem;
  const marginPercent = salePrice !== 0 ? (margin / salePrice) * 100 : 0;

  return { margin, marginPercent };
};

export function getWorkstationPrice(ws: Workstation) {
  return ws.neededMachines.reduce(
    (sum, machineName) => sum + machines[machineName].purchasePrice,
    0,
  );
}
