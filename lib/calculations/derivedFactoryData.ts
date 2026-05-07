import { FormEmployees } from "./../schemas/employee";
import {
  getAverageRetailPrice,
  getExportPrice,
  getImportPrice,
  getManufacturePrice,
} from "@/lib/calculations/math";
import { FULLTIME_MAX_WORKING_HOURS, TAX_RATE } from "../constants";
import { EmployeeName } from "../game/employeeNames";
import { employees } from "../game/employees";
import { ingredients } from "../game/ingredients";
import { MachineName } from "../game/machineNames";
import { machines, workstations } from "../game/machines";
import { products } from "../game/products";
import { CalculationPeriod, Difficulty } from "../game/types";
import { VehicleName } from "../game/vehicleNames";
import { vehicles } from "../game/vehicles";
import {
  FactoryFormValues,
  FormVehicles,
  FormWorkstations,
} from "../schemas/factory";
import { shelves } from "../game/inventory";
import { ProductName } from "../game/productNames";
import { getTimeMultiplier } from "../utils/getTimeMultiplier";
import { Factory, Playthrough, PriceIndices } from "../stores/playthroughStore";
import { ImporterShoppingList } from "../utils/getShoppingList";
import { calculateIngredientTotals } from "./calculateIngredientTotals";
import { getEffectiveProductionByProduct } from "./getEffectiveProductionByProduct";

export type DerivedDataFromFormValues = {
  valueType?: string;
  amount: number;
  name: string;
  value: number;
  diff?: number;
}[];

export const deriveWorkstationData = (
  values: FactoryFormValues,
): DerivedDataFromFormValues => {
  const machineCountsByName = values.workstations.reduce(
    (acc, ws) => {
      const neededMachines = workstations[ws.name].neededMachines;
      for (const machine of neededMachines) {
        if (ws.amount === 0) continue;
        acc[machine] = (acc[machine] ?? 0) + ws.amount;
      }
      return acc;
    },
    {} as Record<MachineName, number>,
  );

  return (Object.entries(machineCountsByName) as [MachineName, number][]).map(
    ([name, amount]) => ({
      amount,
      name: `machines.${name}`,
      value: amount * machines[name].purchasePrice,
    }),
  );
};

export const deriveVehicleData = (
  values: FactoryFormValues,
): DerivedDataFromFormValues => {
  const { vehicles: formVehicles } = values;

  const entries = formVehicles.filter((v) => v !== undefined);

  const countsByName = entries.reduce(
    (acc, v) => {
      acc[v.name] = (acc[v.name] ?? 0) + 1;
      return acc;
    },
    {} as Record<VehicleName, number>,
  );

  return (Object.entries(countsByName) as [VehicleName, number][]).map(
    ([name, amount]) => ({
      amount,
      name: `vehicles.${name}`,
      value: amount * vehicles[name].purchasePrice,
    }),
  );
};

export const derivePalletShelfData = (
  values: FactoryFormValues,
): DerivedDataFromFormValues => {
  const { shelfAmount } = values;

  const value = shelfAmount * shelves.palletShelf.purchasePrice;

  return [
    {
      amount: shelfAmount,
      name: "inventory.palletShelf",
      value,
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
        ? employee.customWorkingHours / 7
        : FULLTIME_MAX_WORKING_HOURS / 7;

    const totalWorkstationAmount = values.workstations.reduce(
      (sum, ws) => sum + ws.amount,
      0,
    );

    const value =
      n === "factoryWorker"
        ? salary * totalWorkstationAmount * timeMult
        : ((amount * salary * averageWorkingHoursPerDay) / 24) * timeMult;

    if (value === 0) return [];

    return [
      {
        valueType: "employees",
        name: `employees.${n}`,
        amount,
        value,
      },
    ];
  });
};

export const deriveFactoryWorkerAmount = (
  workstations: FormWorkstations,
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
  vehicles: FormVehicles,
  salary: number,
) => {
  if (salary === 0) return 0;

  return vehicles.filter(Boolean).length;
};

export const deriveHrManagerAmount = (employeeData: FormEmployees): number => {
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

  const totalAmounts = calculateIngredientTotals(workstations, {
    limited: true,
    openingHours,
  });

  return Object.entries(totalAmounts).map(([name, amount]) => {
    const ingredient = ingredients[name as keyof typeof ingredients];
    const totalAmount = amount * timeMult;
    const totalCost =
      getImportPrice(ingredient.wholesalePrice, difficulty) * amount * timeMult;

    return {
      valueType: "ingredients",
      name: `ingredients.${name}`,
      amount: totalAmount,
      value: totalCost,
    };
  });
};

export const deriveProductData = (
  values: FactoryFormValues,
  difficulty: Difficulty,
  calculationPeriod: CalculationPeriod,
  priceIndices: PriceIndices,
): DerivedDataFromFormValues => {
  const { workstations, openingHours } = values;
  const timeMult = getTimeMultiplier(calculationPeriod, openingHours);

  const productHourlyYieldByProduct = getEffectiveProductionByProduct(
    workstations,
    openingHours,
  );

  return Object.entries(productHourlyYieldByProduct).flatMap(
    ([name, { effectiveRatePerHour, salesAmount }]) => {
      const product = products[name as keyof typeof products];

      const totalAmount = effectiveRatePerHour * timeMult;
      const weeklyToPeriodMult = timeMult / (openingHours * 7);
      const retailAmount = Math.min(
        salesAmount * weeklyToPeriodMult,
        totalAmount,
      );
      const retailValue = getAverageRetailPrice(product) * retailAmount;
      const isValidRetail = retailValue > 0;

      const exportAmount = !isValidRetail
        ? totalAmount
        : totalAmount - retailAmount;
      const exportValue =
        getExportPrice(
          product.wholesalePrice,
          difficulty,
          priceIndices[name as ProductName],
        ) * exportAmount;

      const manufacturePrice = getManufacturePrice(
        product,
        difficulty,
        values.employees.factoryWorker.salary,
      );
      const taxMult = 1 - TAX_RATE[difficulty];
      const retailProfit =
        retailValue * taxMult - manufacturePrice * retailAmount;
      const exportProfit =
        exportValue * taxMult - manufacturePrice * exportAmount;

      return [
        ...(isValidRetail && retailAmount > 0
          ? [
              {
                valueType: "retail",
                name: `products.${name}`,
                amount: Math.ceil(retailAmount),
                value: retailValue,
                diff: retailProfit,
              },
            ]
          : []),
        ...(exportAmount > 0
          ? [
              {
                valueType: "export",
                name: `products.${name}`,
                amount: Math.ceil(exportAmount),
                value: exportValue,
                diff: exportProfit,
              },
            ]
          : []),
      ];
    },
  );
};

export const deriveWeeklyIncome = (
  factories: Factory[],
  playthrough: Playthrough,
): number => {
  const { difficulty, priceIndices } = playthrough;
  const calculationPeriod = "weekly";

  return factories.reduce((total, factory) => {
    const recurringCost = [
      ...deriveEmployeeData(factory, calculationPeriod),
      ...deriveIngredientData(factory, difficulty, calculationPeriod),
    ].reduce((sum, item) => sum + item.value, 0);

    const income = deriveProductData(
      factory,
      difficulty,
      calculationPeriod,
      priceIndices,
    ).reduce((sum, item) => sum + item.value, 0);

    return total + (income - recurringCost);
  }, 0);
};

export const deriveWeeklyIngredientCosts = (
  factories: Factory[],
  playthrough: Playthrough,
): number => {
  const { difficulty } = playthrough;
  const calculationPeriod = "weekly";

  return factories.reduce((total, factory) => {
    const ingredientCosts = deriveIngredientData(
      factory,
      difficulty,
      calculationPeriod,
    ).reduce((sum, item) => sum + item.value, 0);

    return total + ingredientCosts;
  }, 0);
};

export const deriveImporterTotals = (
  shoppingList: ImporterShoppingList[],
): DerivedDataFromFormValues => {
  return shoppingList.map((importerEntry) => {
    const totalValue = importerEntry.items.reduce(
      (sum, item) => sum + item.value,
      0,
    );

    return {
      valueType: "ingredients",
      amount: 1,
      name: `importers.${importerEntry.importer}`,
      value: totalValue,
    };
  });
};
