import { getExportPrice, getImportPrice } from "@/lib/calculations/math";
import { FULLTIME_MAX_WORKING_HOURS } from "../constants";
import { EmployeeName } from "../game/employeeNames";
import { employees } from "../game/employees";
import { IngredientName } from "../game/ingredientNames";
import { ingredients } from "../game/ingredients";
import { WorkstationName } from "../game/machineNames";
import { workstations } from "../game/machines";
import { products } from "../game/products";
import { CalculationPeriod, Difficulty } from "../game/types";
import { VehicleName } from "../game/vehicleNames";
import { vehicles } from "../game/vehicles";
import { FactoryFormValues } from "../schemas/factory";
import { getWorkstationPrice } from "./math";
import { shelves } from "../game/inventory";
import { ProductName } from "../game/productNames";
import { getTimeMultiplier } from "../utils/getTimeMultiplier";

export type DerivedDataFromFormValues = {
  amount: number;
  name: string;
  cost: number;
}[];

type IngredientTotals = Record<IngredientName, number>;

export function calculateIngredientTotals(
  workstations: FactoryFormValues["workstations"],
): IngredientTotals {
  return workstations.reduce((acc, ws) => {
    const product = products[ws.product];

    product.ingredients.forEach((ingredientGroup) => {
      Object.entries(ingredientGroup).forEach(([name, amount]) => {
        if (amount === undefined) return;

        const key = name as IngredientName;
        acc[key] = (acc[key] ?? 0) + amount * ws.amount;
      });
    });

    return acc;
  }, {} as IngredientTotals);
}

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
  calculationPeriod: CalculationPeriod,
): DerivedDataFromFormValues => {
  const { workstations, openingHours } = values;
  const timeMult = getTimeMultiplier(calculationPeriod, openingHours);

  const ingredientTotals = calculateIngredientTotals(workstations);

  const totalBoxAmountPerHour = (
    Object.entries(ingredientTotals) as [IngredientName, number][]
  )
    .map(([iName, amount]) => amount / ingredients[iName].amountPerBox)
    .reduce((sum, amount) => sum + amount, 0);
  const shelfAmount = Math.ceil(
    (totalBoxAmountPerHour * timeMult) / shelves.palletShelf.storageCapacity,
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
  calculationPeriod: CalculationPeriod,
): DerivedDataFromFormValues => {
  const { employees: employeeData, openingHours } = values;
  const timeMult = getTimeMultiplier(calculationPeriod, openingHours);

  return Object.entries(employeeData).flatMap(([name, data]) => {
    const n = name as EmployeeName;
    const salary = data?.salary ?? 0;
    const amount = data?.amount ?? 0;

    if (amount <= 0) return [];

    const employee = employees[n];
    const averageWorkingHoursPerDay =
      "customWorkingHours" in employee
        ? employee.customWorkingHours
        : values.openingHours;

    const cost =
      ((amount * salary * averageWorkingHoursPerDay) / 24) * timeMult;

    if (cost === 0) return [];

    return [
      {
        name: `employees.${n}`,
        amount,
        cost,
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
  calculationPeriod: CalculationPeriod,
): DerivedDataFromFormValues => {
  const { workstations, openingHours } = values;
  const timeMult = getTimeMultiplier(calculationPeriod, openingHours);

  const totalAmounts = calculateIngredientTotals(workstations);

  return Object.entries(totalAmounts).map(([name, amount]) => {
    const ingredient = ingredients[name as keyof typeof ingredients];
    const totalAmount = amount * timeMult;
    const totalCost =
      getImportPrice(ingredient.wholesalePrice, difficulty) * amount * timeMult;

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
  calculationPeriod: CalculationPeriod,
): DerivedDataFromFormValues => {
  const { workstations, openingHours } = values;
  const timeMult = getTimeMultiplier(calculationPeriod, openingHours);

  const productHourlyYieldByProduct = workstations.reduce(
    (acc, ws) => {
      const product = products[ws.product];
      const totalRate =
        (acc[ws.product] ?? 0) + product.productionRate * ws.amount;
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

      const totalAmount = amountPerHour * timeMult;
      const totalExportIncome =
        getExportPrice(product.wholesalePrice, difficulty) * totalAmount;

      return {
        name: `products.${name}`,
        amount: Math.ceil(totalAmount),
        cost: totalExportIncome,
      };
    },
  );
};
