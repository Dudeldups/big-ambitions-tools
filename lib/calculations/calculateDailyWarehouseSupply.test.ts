import { calculateDailyWarehouseSupply } from "./calculateDailyWarehouseSupply";

describe("calculateDailyWarehouseSupply", () => {
  it("combines importer totals and converts weekly amounts to daily consumption", () => {
    expect(
      calculateDailyWarehouseSupply([
        {
          importer: "importer-a",
          items: [
            { name: "water", amount: 70, value: 100 },
            { name: "fabric", amount: 8, value: 50 },
          ],
        },
        {
          importer: "importer-b",
          items: [{ name: "water", amount: 7, value: 10 }],
        },
      ]),
    ).toEqual([
      { name: "water", amount: 11 },
      { name: "fabric", amount: 2 },
    ]);
  });
});
