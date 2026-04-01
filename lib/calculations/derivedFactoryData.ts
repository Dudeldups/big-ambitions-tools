import { getExportPrice, getImportPrice } from "@/lib/calculations/math";
import { FULLTIME_MAX_WORKING_HOURS } from "../constants";
import { EmployeeName } from "../game/employeeNames";
import { employees } from "../game/employees";
import { IngredientName } from "../game/ingredientNames";
import { ingredients } from "../game/ingredients";
import { WorkstationName } from "../game/machineNames";
import { workstations } from "../game/machines";
import { products } from "../game/products";
import { Difficulty } from "../game/types";
import { VehicleName } from "../game/vehicleNames";
import { vehicles } from "../game/vehicles";
import { FactoryFormValues } from "../schemas/factory";
import { getWorkstationPrice } from "./math";
import { shelves } from "../game/inventory";
import { ProductName } from "../game/productNames";

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
      acc[ws.name] = (acc[ws.name] ?? 0) + ws.amount;
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

export const deriveEmployeeData = (
  values: FactoryFormValues,
): DerivedDataFromFormValues => {
  const employeeData = values.employees;

  return Object.entries(employeeData).flatMap(([name, data]) => {
    const n = name as EmployeeName;
    const salary = data?.salary ?? 0;
    const amount = data?.amount ?? 0;

    if (amount <= 0) return [];

    const employee = employees[n];
    const workingHours =
      "customWorkingHours" in employee
        ? employee.customWorkingHours
        : values.openingHours;

    return [
      {
        name: `employees.${n}`,
        amount,
        cost: amount * salary * workingHours * 7,
      },
    ];
  });
};

export const deriveFactoryWorkerAmount = (
  workstations: FactoryFormValues["workstations"],
  openingHours: number | undefined,
): number => {
  if (!workstations || !openingHours) return 0;

  const workstationAmount = workstations.reduce(
    (total, workstation) => total + workstation.amount,
    0,
  );

  const BUFFER_FACTOR = 1.02;
  const ROUNDING_THRESHOLD = 0.8;

  const rawAmount =
    (workstationAmount * openingHours * 7 * BUFFER_FACTOR) /
    FULLTIME_MAX_WORKING_HOURS;

  if (rawAmount < workstationAmount) return workstationAmount;

  const extraBuffer = rawAmount % 1 >= ROUNDING_THRESHOLD ? 1 : 0;

  return Math.ceil(rawAmount) + extraBuffer;
};

export const deriveDeliveryDriverAmount = (
  vehicle1: VehicleName,
  vehicle2: VehicleName | undefined,
  employeeData: FactoryFormValues["employees"],
) => {
  if (employeeData.deliveryDriver.salary === 0) return 0;

  return [vehicle1, vehicle2].filter(Boolean).length;
};

export const deriveHrManagerAmount = (
  employeeData: FactoryFormValues["employees"],
): number => {
  if (employeeData.hrManager.salary === 0) return 0;

  const totalEmployees = Object.values(employeeData).reduce(
    (total, employee) => total + (employee?.amount ?? 0),
    0,
  );

  return Math.round((totalEmployees / 50) * 10) / 10;
};

export const deriveIngredientData = (
  values: FactoryFormValues,
  difficulty: Difficulty,
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

  const totalAmounts = neededIngredients.reduce(
    (acc, [name, amount]) => {
      acc[name] = (acc[name] ?? 0) + amount;
      return acc;
    },
    {} as Record<IngredientName, number>,
  );

  return Object.entries(totalAmounts).map(([name, amount]) => {
    const ingredient = ingredients[name as keyof typeof ingredients];
    const totalAmount = amount * openingHours * 7;
    const totalCost =
      getImportPrice(ingredient.wholesalePrice, difficulty) *
      amount *
      openingHours *
      7;

    return {
      name: `ingredients.${name}`,
      amount: totalAmount,
      cost: totalCost,
    };
  });
};

export const deriveProductData = (
  values: FactoryFormValues,
  difficulty: Difficulty,
): DerivedDataFromFormValues => {
  const { workstations, openingHours } = values;

  const productHourlyYieldByProduct = workstations.reduce(
    (acc, ws) => {
      const product = products[ws.product];
      const totalRate = (acc[ws.product] ?? 0) + product.productionRate;
      return {
        ...acc,
        [ws.product]: totalRate,
      };
    },
    {} as Record<ProductName, number>,
  );

  return Object.entries(productHourlyYieldByProduct).map(
    ([name, amountPerHour]) => {
      const product = products[name as keyof typeof products];

      const totalAmount = amountPerHour * openingHours * 7;
      const totalCost =
        getExportPrice(product.wholesalePrice, difficulty) * totalAmount;

      return {
        name: `products.${name}`,
        amount: Math.ceil(totalAmount),
        cost: totalCost,
      };
    },
  );
};
