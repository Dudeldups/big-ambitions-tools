import { MAX_PRODUCT_PRICE_INDEX, MIN_PRODUCT_PRICE_INDEX } from "../constants";

export function assertPriceIndex(value: number): asserts value is number {
  if (value < MIN_PRODUCT_PRICE_INDEX || value > MAX_PRODUCT_PRICE_INDEX) {
    throw new Error("errors.invalidPriceIndex");
  }
}
