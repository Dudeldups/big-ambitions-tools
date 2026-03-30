import {
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
import { getIngredientDataForProduct } from "../utils/getIngredientDataForProduct";

export const getImportPrice = (
  wholesalePrice: number,
  difficulty: Difficulty,
  priceIndex: number = 1,
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
  priceIndex: number = 1,
) => {
  return (
    wholesalePrice *
    PUBLIC_PRICE_MULT[difficulty] *
    EXPORT_PRICE_MULT[difficulty] *
    priceIndex
  );
};

export const getProfitMarginForProduct = (
  product: Product,
  difficulty: Difficulty,
  priceIndex: number = 1,
) => {
  const ingredientData = getIngredientDataForProduct(product, difficulty);
  const totalIngredientPrice = ingredientData.reduce(
    (acc, ingredient) => acc + ingredient.cost,
    0,
  );
  const ingredientPricePerItem = totalIngredientPrice / product.productionRate;

  const exportPrice = getExportPrice(
    product.wholesalePrice,
    difficulty,
    priceIndex,
  );

  const margin = exportPrice - ingredientPricePerItem;
  const marginPercent = (margin / ingredientPricePerItem) * 100;

  return { margin, marginPercent };
};

export const getEmployeeSalary = (
  employeeName: EmployeeName,
  difficulty: Difficulty,
) => {
  const employee = employees[employeeName];

  return Math.round(
    SALARY_BASE_MULT * SALARY_DIFF_MULT[difficulty] * employee.baseHourlyWage,
  );
};

export function getWorkstationPrice(ws: Workstation) {
  return ws.neededMachines.reduce(
    (sum, machineName) => sum + machines[machineName].purchasePrice,
    0,
  );
}
