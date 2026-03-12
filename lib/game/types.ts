import { IngredientName } from "./ingredientNames";
import { MachineName } from "./machineNames";
import { ProductName } from "./productNames";

export type Difficulty = "easy" | "normal" | "hard";

export type Price = {
  [K in Difficulty]: number;
};

type TableKeyMap = {
  products: ProductName;
  ingredients: IngredientName;
  machines: MachineName;
};

export type ItemName = ProductName | IngredientName | MachineName;

export type TableType = keyof TableKeyMap;

export type TableData<T extends TableType, V> = [TableKeyMap[T], V][];
