import { _testFactoryFormValues } from "@/__tests__/test-values";
import { getGameData } from "../game/registry";
import { FactoryFormValues } from "../schemas/factory";
import { getManufacturePrice, getProfitAfterIncomeTax } from "./math";
import { deriveIngredientData, deriveProductData } from "./derivedFactoryData";

describe("deriveProductData tax calculations", () => {
  const values: FactoryFormValues = {
    ..._testFactoryFormValues,
    openingHours: 1,
    employees: {
      deliveryDriver: { amount: 0, salary: 0 },
      logisticsManager: { amount: 0, salary: 0 },
      purchasingAgent: { amount: 0, salary: 0 },
      hrManager: { amount: 0, salary: 0 },
      factoryWorker: { amount: 1, salary: 25 },
    },
    workstations: [
      {
        amount: 1,
        name: "clothingWorkstation",
        product: "classicCheapMaleClothing",
        salesAmount: 0,
      },
    ],
  };

  it("deducts version 1.0 manufacturing costs before calculating product tax", () => {
    const gameData = getGameData("1.0");
    const product = gameData.products.classicCheapMaleClothing!;
    const [row] = deriveProductData(values, "hard", "hourly", {}, gameData);
    const manufacturingCost =
      getManufacturePrice(product, "hard", gameData, 25) *
      product.productionRate;

    expect(row.diff).toBeCloseTo(
      getProfitAfterIncomeTax(
        row.value,
        manufacturingCost,
        manufacturingCost,
        "hard",
      ),
    );
  });
});

describe("deriveProductData production limits", () => {
  it.each([
    ["whisky", 3, 25_000],
    ["whisky", 3, 12_500],
    ["hairCareProduct", 1, 25_000],
    ["hairCareProduct", 1, 12_500],
  ] as const)(
    "shows the exact weekly limit for %s at %i workstations and %i products",
    (product, amount, productionLimit) => {
      const factory: FactoryFormValues = {
        ..._testFactoryFormValues,
        openingHours: 24,
        workstations: [
          {
            amount,
            name: "bottledGoodsWorkstation",
            product,
            productionLimit,
          },
        ],
      };

      const rows = deriveProductData(
        factory,
        "easy",
        "weekly",
        {},
        getGameData("1.0"),
      );

      expect(rows).toHaveLength(1);
      expect(rows[0].amount).toBe(productionLimit);
    },
  );

  it.each([
    ["whisky", 3, "water"],
    ["hairCareProduct", 1, "hairCareFormula"],
  ] as const)(
    "keeps daily and hourly %s output and ingredient amounts consistent with the weekly limit",
    (product, amount, ingredient) => {
      const gameData = getGameData("1.0");

      for (const [productionLimit, dailyAmount, hourlyAmount] of [
        [25_000, 3_572, 149],
        [12_500, 1_786, 75],
      ] as const) {
        const factory: FactoryFormValues = {
          ..._testFactoryFormValues,
          openingHours: 24,
          workstations: [
            {
              amount,
              name: "bottledGoodsWorkstation",
              product,
              productionLimit,
            },
          ],
        };

        for (const [period, expectedAmount] of [
          ["daily", dailyAmount],
          ["hourly", hourlyAmount],
        ] as const) {
          const products = deriveProductData(
            factory,
            "easy",
            period,
            {},
            gameData,
          );
          const ingredients = deriveIngredientData(
            factory,
            "easy",
            period,
            gameData,
          );

          expect(products).toHaveLength(1);
          expect(products[0].amount).toBe(expectedAmount);
          expect(
            ingredients.find((row) => row.name === `ingredients.${ingredient}`)
              ?.amount,
          ).toBe(expectedAmount);
        }
      }
    },
  );
});
