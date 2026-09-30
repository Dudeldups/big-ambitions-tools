import { getImportPrice } from "../calculations/math";
import { IngredientName } from "../game/ingredientNames";
import { requireIngredient } from "../game/requireGameData";
import { Difficulty, GameData, Product } from "../game/types";
import { getProductIngredientGroups } from "./getProductIngredientGroups";

export const getIngredientDataForProduct = (
  product: Product,
  difficulty: Difficulty,
  gameData: GameData,
): { name: IngredientName; amount: number; cost: number }[] => {
  const neededIngredients = getProductIngredientGroups(product).flat();

  return neededIngredients.map(({ name, amount }) => {
    const ingredient = requireIngredient(gameData, name);
    const cost = getImportPrice(ingredient.wholesalePrice, difficulty) * amount;

    return {
      name,
      amount,
      cost,
    };
  });
};
