import { getImportPrice } from "../calculations/math";
import { IngredientName } from "../game/ingredientNames";
import { ingredients } from "../game/ingredients";
import { Product } from "../game/products";
import { Difficulty } from "../game/types";

export const getIngredientDataForProduct = (
  product: Product,
  difficulty: Difficulty,
): { name: IngredientName; amount: number; cost: number }[] => {
  const neededIngredients = product.ingredients
    .flatMap((ingredientGroup) => Object.entries(ingredientGroup))
    .filter(
      (entry): entry is [IngredientName, number] => entry[1] !== undefined,
    );

  return neededIngredients.map(([name, amount]) => {
    const ingredient = ingredients[name as keyof typeof ingredients];
    const cost = getImportPrice(ingredient.wholesalePrice, difficulty) * amount;

    return {
      name,
      amount,
      cost,
    };
  });
};
