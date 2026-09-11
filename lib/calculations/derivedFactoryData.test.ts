import { _testFactoryFormValues } from "@/__tests__/test-values";
import { getGameData } from "../game/registry";
import { FactoryFormValues } from "../schemas/factory";
import { getManufacturePrice, getProfitAfterIncomeTax } from "./math";
import { deriveProductData } from "./derivedFactoryData";

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
