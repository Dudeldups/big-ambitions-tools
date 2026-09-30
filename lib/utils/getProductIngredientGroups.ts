import { IngredientName } from "../game/ingredientNames";
import { Product } from "../game/types";

export type ProductIngredientEntry = {
  name: IngredientName;
  amount: number;
};

/** Keeps each recipe position intact so choices within a position stay distinct. */
export const getProductIngredientGroups = (
  product: Product,
): ProductIngredientEntry[][] =>
  product.ingredients.map((group) =>
    (Object.entries(group) as [IngredientName, number | undefined][]).flatMap(
      ([name, amount]) => (amount === undefined ? [] : [{ name, amount }]),
    ),
  );
