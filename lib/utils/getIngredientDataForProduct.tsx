import { getImportPrice } from "../calculations/math";
import { IngredientName } from "../game/ingredientNames";
import { requireIngredient } from "../game/requireGameData";
import { Difficulty, GameData, Product } from "../game/types";

export const getIngredientDataForProduct = (
  product: Product,
  difficulty: Difficulty,
  gameData: GameData,
): { name: IngredientName; amount: number; cost: number }[] => {
  const neededIngredients = product.ingredients
    .flatMap((ingredientGroup) => Object.entries(ingredientGroup))
    .filter(
      (entry): entry is [IngredientName, number] => entry[1] !== undefined,
    );

  return neededIngredients.map(([name, amount]) => {
    const ingredient = requireIngredient(gameData, name);
    const cost = getImportPrice(ingredient.wholesalePrice, difficulty) * amount;

    return {
      name,
      amount,
      cost,
    };
  });
};
