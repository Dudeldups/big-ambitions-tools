import { gameData as gameData010 } from "@/data/game/0.10";
import { describe, expect, it } from "vitest";
import { deriveIngredientData, deriveProductData } from "./derivedFactoryData";
import { FactoryFormValues } from "../schemas/factory";
import { getShoppingList } from "../utils/getShoppingList";

const testFactory: FactoryFormValues = {
  name: "Hotdog Factory",
  description: "",
  openingHours: 10,
  shelfAmount: 5,
  employees: {
    deliveryDriver: { amount: 1, salary: 0 },
    hrManager: { amount: 0, salary: 0 },
    logisticsManager: { amount: 1, salary: 0 },
    purchasingAgent: { amount: 0, salary: 0 },
    factoryWorker: { amount: 2, salary: 0 },
  },
  vehicles: [{ name: "FreightTruckT1" }],
  workstations: [
    {
      amount: 1,
      name: "foodWorkstation",
      product: "hotdog",
      salesAmount: 10000,
      productionLimit: 1000,
    },
    {
      amount: 1,
      name: "foodWorkstation",
      product: "hotdog",
      salesAmount: 4000,
    },
  ],
};

describe("production limits", () => {
  it("applies a product limit across all matching workstations in the shopping list", () => {
    const shoppingList = getShoppingList(testFactory, "normal", gameData010);
    const allItems = shoppingList.flatMap((entry) => entry.items);

    expect(allItems.every((item) => Number.isInteger(item.amount))).toBe(true);
    expect(allItems.find((item) => item.name === "rawSausage")?.amount).toBe(
      1000,
    );
    expect(allItems.find((item) => item.name === "dough")?.amount).toBe(1000);
    expect(allItems.find((item) => item.name === "tomato")?.amount).toBe(250);
  });

  it("caps product output by the weekly production limit", () => {
    const productRows = deriveProductData(
      testFactory,
      "normal",
      "weekly",
      { hotdog: 100 },
      gameData010,
    );

    expect(productRows).toHaveLength(1);
    expect(productRows[0].valueType).toBe("retail");
    expect(productRows[0].amount).toBe(1000);
  });

  it("rounds ingredient overview amounts up to whole numbers", () => {
    const ingredientRows = deriveIngredientData(
      testFactory,
      "normal",
      "weekly",
      gameData010,
    );

    expect(
      ingredientRows.find((row) => row.name === "ingredients.rawSausage")
        ?.amount,
    ).toBe(1000);
    expect(
      ingredientRows.find((row) => row.name === "ingredients.tomato")?.amount,
    ).toBe(250);
  });

  it("does not over-round limited ingredients when the same product is split across workstation entries", () => {
    const jewelryFactory: FactoryFormValues = {
      ...testFactory,
      name: "Jewelry Factory",
      workstations: [
        {
          amount: 5,
          name: "jewelryWorkstation",
          product: "cheapJewelry",
          productionLimit: 5000,
        },
        {
          amount: 5,
          name: "jewelryWorkstation",
          product: "expensiveJewelry",
          productionLimit: 1000,
        },
        {
          amount: 1,
          name: "jewelryWorkstation",
          product: "cheapJewelry",
        },
        {
          amount: 1,
          name: "jewelryWorkstation",
          product: "expensiveJewelry",
        },
      ],
    };

    const shoppingList = getShoppingList(jewelryFactory, "normal", gameData010);
    const allItems = shoppingList.flatMap((entry) => entry.items);

    expect(allItems.find((item) => item.name === "metalBand")?.amount).toBe(
      6000,
    );
    expect(
      allItems.find((item) => item.name === "uncutGemsCheap")?.amount,
    ).toBe(5000);
    expect(
      allItems.find((item) => item.name === "uncutGemsExpensive")?.amount,
    ).toBe(1000);
  });
});
