import { _testFactoryFormValues } from "@/__tests__/test-values";
import { factorySchema } from "./factory";

describe("factorySchema", () => {
  it("allows a naked factory with no pallet shelves", () => {
    const result = factorySchema.safeParse({
      ..._testFactoryFormValues,
      shelfAmount: 0,
    });

    expect(result.success).toBe(true);
  });
});
