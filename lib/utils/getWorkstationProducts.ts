import { WorkstationName } from "../game/machineNames";
import { ProductName } from "../game/productNames";
import { Product } from "../game/types";

// function to lookup which products a workstation is used for
export function getWorkstationProducts(
  wName: WorkstationName,
  products: Partial<Record<ProductName, Product>>,
) {
  return Object.entries(products)
    .flatMap(([productName, product]): [ProductName, Product][] =>
      product?.workstation === wName
        ? [[productName as ProductName, product]]
        : [],
    )
    .sort((a, b) => a[0].localeCompare(b[0]));
}
