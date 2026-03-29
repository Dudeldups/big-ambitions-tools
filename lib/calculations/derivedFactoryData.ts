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
import { Difficulty } from "../game/types";
import { VehicleName } from "../game/vehicleNames";
import { vehicles } from "../game/vehicles";
import { FactoryFormValues } from "../schemas/factory";
import { getWorkstationPrice } from "./math";
import { shelves } from "../game/inventory";

export type DerivedDataFromFormValues = {
  amount: number;
  name: string;
  cost: number;
}[];

export const deriveWorkstationData = (
  values: FactoryFormValues,
): DerivedDataFromFormValues => {
  const workstationData = values.workstations;

  const countsByName = workstationData.reduce(
    (acc, ws) => {
      acc[ws.name] = (acc[ws.name] ?? 0) + 1;
      return acc;
    },
    {} as Record<WorkstationName, number>,
  );

  return (Object.entries(countsByName) as [WorkstationName, number][]).map(
    ([name, amount]) => ({
      amount,
      name: `workstations.${name}`,
      cost: amount * getWorkstationPrice(workstations[name]),
    }),
  );
};

export const deriveVehicleData = (
  values: FactoryFormValues,
): DerivedDataFromFormValues => {
  const { vehicle1, vehicle2 } = values;

  const entries = [vehicle1, vehicle2].filter(
    (v): v is VehicleName => v != null,
  );

  const countsByName = entries.reduce(
    (acc, v) => {
      acc[v] = (acc[v] ?? 0) + 1;
      return acc;
    },
    {} as Record<VehicleName, number>,
  );

  return (Object.entries(countsByName) as [VehicleName, number][]).map(
    ([name, amount]) => ({
      amount,
      name: `vehicles.${name}`,
      cost: amount * vehicles[name].purchasePrice,
    }),
  );
};

export const derivePalletShelfData = (
  values: FactoryFormValues,
): DerivedDataFromFormValues => {
  const { workstations, openingHours } = values;

  const productData = workstations.map((ws) => products[ws.product]);
  const neededIngredients = productData.flatMap((p) => {
    return p.ingredients
      .flatMap((ingredientGroup) => Object.entries(ingredientGroup))
      .filter(
        (entry): entry is [IngredientName, number] => entry[1] !== undefined,
      );
  });
  const totalBoxAmount =
    neededIngredients
      .map((i) => i[1] / ingredients[i[0]].amountPerBox)
      .reduce((sum, amount) => sum + amount, 0) *
    openingHours *
    7;
  const shelfAmount = Math.ceil(
    totalBoxAmount / shelves.palletShelf.storageCapacity,
  );

  if (shelfAmount === 0) return [];

  const cost = shelfAmount * shelves.palletShelf.purchasePrice;

  return [
    {
      amount: shelfAmount,
      name: "inventory.palletShelf",
      cost,
    },
  ];
};

export const deriveEmployeeCost = (
  employeeName: EmployeeName | undefined,
  values: FactoryFormValues,
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
