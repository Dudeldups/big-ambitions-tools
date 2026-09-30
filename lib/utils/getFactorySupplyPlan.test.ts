import { _testFactoryFormValues } from "@/__tests__/test-values";
import { calculateDailyWarehouseSupply } from "../calculations/calculateDailyWarehouseSupply";
import { getMissingPalletShelvesTotal } from "../calculations/getMissingPalletShelvesTotal";
import { getGameData } from "../game/registry";
import { GAME_VERSIONS } from "../game/versions";
import { FactoryFormValues } from "../schemas/factory";
import { Factory } from "../stores/playthroughStore";
import { getFactorySupplyPlan } from "./getFactorySupplyPlan";
import { ImporterShoppingList } from "./getShoppingList";
import { splitShoppingListByShelves } from "./splitShoppingListByShelves";

const factory: Factory = {
  ..._testFactoryFormValues,
  id: "factory",
  createdAt: 0,
  openingHours: 24,
  shelfAmount: 9,
  workstations: [{ name: "foodWorkstation", product: "hotdog", amount: 25 }],
};

const withPurchasingAgent = (
  amount: number,
): Pick<FactoryFormValues, "employees"> => ({
  employees: {
    ..._testFactoryFormValues.employees,
    purchasingAgent: {
      ..._testFactoryFormValues.employees.purchasingAgent,
      amount,
    },
  },
});

const ingredient = (list: ImporterShoppingList[], name: string) =>
  list.flatMap((entry) => entry.items).find((item) => item.name === name);

describe.each(GAME_VERSIONS)("factory purchasing in game %s", (version) => {
  const gameData = getGameData(version);

  it("orders all seven days centrally even when factory shelves hold a full week", () => {
    const central = {
      ...factory,
      ...withPurchasingAgent(0),
      shelfAmount: 63,
    };
    const plan = getFactorySupplyPlan(central, "normal", gameData);

    expect(plan.factoryList).toEqual([]);
    expect(ingredient(plan.warehouseList, "rawSausage")?.amount).toBe(840000);
    expect(calculateDailyWarehouseSupply(plan.warehouseList)).toEqual([
      { name: "rawSausage", amount: 120000 },
      { name: "dough", amount: 120000 },
      { name: "tomato", amount: 30000 },
    ]);
    expect(getMissingPalletShelvesTotal([central], gameData)).toBe(63);
  });

  it("splits purchases without double ordering and delivers only the warehouse share", () => {
    const separate = { ...factory, ...withPurchasingAgent(1) };
    const plan = getFactorySupplyPlan(separate, "normal", gameData);

    expect(ingredient(plan.factoryList, "rawSausage")?.amount).toBe(120000);
    expect(ingredient(plan.warehouseList, "rawSausage")?.amount).toBe(720000);
    for (const item of plan.weeklyList.flatMap((entry) => entry.items)) {
      const direct = ingredient(plan.factoryList, item.name)!;
      const warehouse = ingredient(plan.warehouseList, item.name)!;
      expect(direct.amount + warehouse.amount).toBe(item.amount);
      expect(direct.value + warehouse.value).toBeCloseTo(item.value);
    }
    expect(calculateDailyWarehouseSupply(plan.warehouseList)).toEqual([
      { name: "rawSausage", amount: 102858 },
      { name: "dough", amount: 102858 },
      { name: "tomato", amount: 25715 },
    ]);
    expect(getMissingPalletShelvesTotal([separate], gameData)).toBe(54);
  });

  it("needs no warehouse order when a separate buyer can order the whole week directly", () => {
    const plan = getFactorySupplyPlan(
      { ...factory, ...withPurchasingAgent(1), shelfAmount: 63 },
      "normal",
      gameData,
    );
    expect(plan.factoryList).toEqual(plan.weeklyList);
    expect(plan.warehouseList).toEqual([]);
  });

  it("keeps zero-shelf and zero-production plans free of phantom direct orders", () => {
    const withoutShelves = getFactorySupplyPlan(
      { ...factory, ...withPurchasingAgent(1), shelfAmount: 0 },
      "normal",
      gameData,
    );
    expect(withoutShelves.factoryList).toEqual([]);
    expect(withoutShelves.warehouseList).toEqual(withoutShelves.weeklyList);
    const paused: FactoryFormValues = {
      ...factory,
      ...withPurchasingAgent(0),
      workstations: [{ ...factory.workstations[0], productionLimit: 0 }],
    };
    expect(
      getFactorySupplyPlan(paused, "normal", gameData).warehouseList,
    ).toEqual([]);
  });

  it("sizes one warehouse from mixed purchasing strategies", () => {
    const central = { ...factory, ...withPurchasingAgent(0) };
    const separate = {
      ...factory,
      ...withPurchasingAgent(1),
      id: "other",
    };
    expect(
      getMissingPalletShelvesTotal([central, separate, undefined], gameData),
    ).toBe(117);
  });
});

describe("box rounding when splitting purchases", () => {
  const gameData = getGameData("1.0");

  it("assigns costs to the actual rounded quantities and preserves the weekly totals", () => {
    const { factoryList, externalList } = splitShoppingListByShelves(
      [
        {
          importer: "lunartide",
          items: [{ name: "dough", amount: 750, value: 75 }],
        },
      ],
      3,
      1,
      gameData,
    );
    expect(ingredient(factoryList, "dough")).toEqual({
      name: "dough",
      amount: 500,
      value: 50,
    });
    expect(ingredient(externalList, "dough")).toEqual({
      name: "dough",
      amount: 250,
      value: 25,
    });
  });

  it("never buys more than the weekly demand when it is smaller than one box", () => {
    const { factoryList, externalList } = splitShoppingListByShelves(
      [
        {
          importer: "lunartide",
          items: [{ name: "tomato", amount: 250, value: 25 }],
        },
      ],
      3,
      1,
      gameData,
    );
    expect(ingredient(factoryList, "tomato")).toEqual({
      name: "tomato",
      amount: 250,
      value: 25,
    });
    expect(externalList).toEqual([]);
  });
});
