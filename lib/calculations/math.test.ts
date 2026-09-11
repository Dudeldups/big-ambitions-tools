import { getGameData } from "../game/registry";
import {
  getExportPrice,
  getIncomeTax,
  getManufacturePrice,
  getProfitAfterIncomeTax,
  getProfitMarginForProduct,
  getTaxableIncome,
} from "./math";

describe("tax calculations", () => {
  it("subtracts deductions from income before applying tax", () => {
    expect(getTaxableIncome(1000, 600)).toBe(400);
    expect(getIncomeTax(1000, 600, "hard")).toBe(120);
    expect(getProfitAfterIncomeTax(1000, 600, 600, "hard")).toBe(280);
  });

  it("does not tax a loss or turn it into a tax credit", () => {
    expect(getTaxableIncome(500, 600)).toBe(0);
    expect(getIncomeTax(500, 600, "hard")).toBe(0);
    expect(getProfitAfterIncomeTax(500, 600, 600, "hard")).toBe(-100);
  });

  it("uses version 1.0 factory deductions in product margins", () => {
    const gameData = getGameData("1.0");
    const product = gameData.products.classicCheapMaleClothing!;
    const salePrice = getExportPrice(product.wholesalePrice, "hard");
    const manufacturePrice = getManufacturePrice(product, "hard", gameData);

    const { margin } = getProfitMarginForProduct(product, "hard", gameData);

    expect(margin).toBeCloseTo(
      getProfitAfterIncomeTax(
        salePrice,
        manufacturePrice,
        manufacturePrice,
        "hard",
      ),
    );
  });

  it("preserves the pre-1.0 gross-revenue tax treatment", () => {
    const gameData = getGameData("0.11");
    const product = gameData.products.classicCheapMaleClothing!;
    const salePrice = getExportPrice(product.wholesalePrice, "hard");
    const manufacturePrice = getManufacturePrice(product, "hard", gameData);

    const { margin } = getProfitMarginForProduct(product, "hard", gameData);

    expect(margin).toBeCloseTo(
      getProfitAfterIncomeTax(salePrice, manufacturePrice, 0, "hard"),
    );
  });
});
