import { ProductName } from "../game/productNames";
import { GameData, Product } from "../game/types";

// function to lookup which products a workstation is used for
export function getWorkstationProducts(
  wName: string,
  products: Partial<Record<ProductName, Product>>,
) {
  return Object.entries(products)
    .filter(([productName, product]) => ({
      [productName]: product?.workstation.includes(wName),
    }))
    .sort((a, b) => a[0].localeCompare(b[0]));
}
