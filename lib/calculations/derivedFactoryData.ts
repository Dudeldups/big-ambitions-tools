import { FormEmployees } from "./../schemas/employee";
import {
  ceilWithTolerance,
  getAverageRetailPrice,
  getExportPrice,
  getImportPrice,
  getManufacturePrice,
} from "@/lib/calculations/math";
import { FULLTIME_MAX_WORKING_HOURS, TAX_RATE } from "../constants";
import { EmployeeName } from "../game/employeeNames";
import { MachineName } from "../game/machineNames";
import { CalculationPeriod, Difficulty, GameData } from "../game/types";
import { VehicleName } from "../game/vehicleNames";
import {
  FactoryFormValues,
  FormVehicles,
  FormWorkstations,
} from "../schemas/factory";
import { ProductName } from "../game/productNames";
import { getPlaythroughGameData } from "../game/registry";
import { getTimeMultiplier } from "../utils/getTimeMultiplier";
import { Factory, Playthrough, PriceIndices } from "../stores/playthroughStore";
import { ImporterShoppingList } from "../utils/getShoppingList";
import { calculateLimitedIngredientTotals } from "./calculateIngredientTotals";
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
  gameData: GameData,
): DerivedDataFromFormValues => {
  const machineCountsByName = values.workstations.reduce(
    (acc, ws) => {
      const workstation = gameData.workstations[ws.name]!;
      const neededMachines = workstation.neededMachines;
      for (const machine of neededMachines) {
        if (ws.amount === 0) continue;
        acc[machine] = (acc[machine] ?? 0) + ws.amount;
      }
      return acc;
    },
    {} as Record<MachineName, number>,
  );

  return (Object.entries(machineCountsByName) as [MachineName, number][]).map(
    ([name, amount]) => {
      const machine = gameData.machines[name]!;

      return {
        amount,
        name: `machines.${name}`,
        value: amount * machine.purchasePrice,
      };
    },
  );
};

export const deriveVehicleData = (
  values: FactoryFormValues,
  gameData: GameData,
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
    ([name, amount]) => {
      const vehicle = gameData.vehicles[name]!;

      return {
        amount,
        name: `vehicles.${name}`,
        value: amount * vehicle.purchasePrice,
      };
    },
  );
};

export const derivePalletShelfData = (
  values: FactoryFormValues,
  gameData: GameData,
): DerivedDataFromFormValues => {
  const { shelfAmount } = values;
  const palletShelf = gameData.shelves.palletShelf!;

  const value = shelfAmount * palletShelf.purchasePrice;

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
  gameData: GameData,
): DerivedDataFromFormValues => {
  const { employees: employeeData, openingHours } = values;
  const timeMult = getTimeMultiplier(calculationPeriod, openingHours);

  return Object.entries(employeeData).flatMap(([name, data]) => {
    const n = name as EmployeeName;
    const salary = data?.salary ?? 0;
    const amount = data?.amount ?? 0;

    if (amount <= 0) return [];

    const employee = gameData.employees[n];
    if (!employee) return [];
    const averageWorkingHoursPerDay =
      (employee.customWorkingHours ?? FULLTIME_MAX_WORKING_HOURS) / 7;

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
  gameData: GameData,
): DerivedDataFromFormValues => {
  const { workstations, openingHours } = values;
  const timeMult = getTimeMultiplier(calculationPeriod, openingHours);

  const totalAmounts = calculateLimitedIngredientTotals(
    workstations,
    openingHours,
    gameData,
  );

  return Object.entries(totalAmounts).map(([name, amount]) => {
    const ingredient =
      gameData.ingredients[name as keyof typeof gameData.ingredients]!;
    const totalAmount = amount * timeMult;
    const totalCost =
      getImportPrice(ingredient.wholesalePrice, difficulty) * amount * timeMult;

    return {
      valueType: "ingredients",
      name: `ingredients.${name}`,
      amount: ceilWithTolerance(totalAmount),
      value: totalCost,
    };
  });
};

export const deriveProductData = (
  values: FactoryFormValues,
  difficulty: Difficulty,
  calculationPeriod: CalculationPeriod,
  priceIndices: PriceIndices,
  gameData: GameData,
): DerivedDataFromFormValues => {
  const { workstations, openingHours } = values;
  const timeMult = getTimeMultiplier(calculationPeriod, openingHours);

  const productHourlyYieldByProduct = getEffectiveProductionByProduct(
    workstations,
    openingHours,
    gameData,
  );

  return Object.entries(productHourlyYieldByProduct).flatMap(
    ([name, { effectiveRatePerHour, salesAmount }]) => {
      const product =
        gameData.products[name as keyof typeof gameData.products]!;

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
        gameData,
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
  const gameData = getPlaythroughGameData(playthrough);

  return factories.reduce((total, factory) => {
    const recurringCost = [
      ...deriveEmployeeData(factory, calculationPeriod, gameData),
      ...deriveIngredientData(factory, difficulty, calculationPeriod, gameData),
    ].reduce((sum, item) => sum + item.value, 0);

    const income = deriveProductData(
      factory,
      difficulty,
      calculationPeriod,
      priceIndices,
      gameData,
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
  const gameData = getPlaythroughGameData(playthrough);

  return factories.reduce((total, factory) => {
    const ingredientCosts = deriveIngredientData(
      factory,
      difficulty,
      calculationPeriod,
      gameData,
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
