import { getImportPrice } from "@/lib/calculations/math";
import { FULLTIME_MAX_WORKING_HOURS } from "../constants";
import { EmployeeName } from "../game/employeeNames";
import { employees } from "../game/employees";
import { IngredientName } from "../game/ingredientNames";
import { ingredients } from "../game/ingredients";
import { WorkstationName } from "../game/machineNames";
import { workstations } from "../game/machines";
import { ProductName } from "../game/productNames";
import { products } from "../game/products";
import { DeepPartial, Difficulty } from "../game/types";
import { VehicleName } from "../game/vehicleNames";
import { vehicles } from "../game/vehicles";
import { FactoryFormValues } from "../schemas/factory";
import { getWorkstationPrice } from "./math";

export const deriveWorkstationCost = (
  wsName: WorkstationName | undefined,
): number => {
  if (!wsName) return 0;
  return getWorkstationPrice(workstations[wsName]);
};

export const deriveVehicleCost = (
  vehicleName: VehicleName | undefined,
): number => {
  if (!vehicleName) return 0;
  return vehicles[vehicleName].purchasePrice;
};

export const deriveEmployeeCost = (
  employeeName: EmployeeName | undefined,
  values: DeepPartial<FactoryFormValues>,
): number => {
  if (!employeeName || !values.openingHours) return 0;
  const employee = employees[employeeName];
  const formEmployee =
    values.employees?.[employeeName as keyof FactoryFormValues["employees"]];
  if (!formEmployee?.salary) return 0;
  const workingHours =
    "customWorkingHours" in employee
      ? employee.customWorkingHours
      : values.openingHours;
  return formEmployee.salary * workingHours * 7;
};

export const deriveFactoryWorkerAmount = (
  workstationAmount: number | undefined,
  openingHours: number | undefined,
): number => {
  if (!workstationAmount || !openingHours) return 0;

  const BUFFER_FACTOR = 1.02;
  const ROUNDING_THRESHOLD = 0.8;

  const rawAmount =
    (workstationAmount * openingHours * 7 * BUFFER_FACTOR) /
    FULLTIME_MAX_WORKING_HOURS;

  if (rawAmount < workstationAmount) return workstationAmount;

  const extraBuffer = rawAmount % 1 >= ROUNDING_THRESHOLD ? 1 : 0;

  return Math.ceil(rawAmount) + extraBuffer;
};

export const deriveIngredientCostsOfProduct = (
  productName: ProductName,
  openingHours: number | undefined,
  difficulty: Difficulty,
): { name: IngredientName; cost: number; amount: number }[] => {
  if (!productName || !openingHours) return [];

  const product = products[productName];

  const ingredientEntries = product.ingredients
    .flatMap((ingredientGroup) => Object.entries(ingredientGroup))
    .filter(
      (entry): entry is [IngredientName, number] => entry[1] !== undefined,
    );

  return ingredientEntries.map(([name, amount]) => ({
    name,
    amount: amount * openingHours * 7,
    cost:
      getImportPrice(ingredients[name].wholesalePrice, difficulty) *
      amount *
      openingHours *
      7,
  }));
};
