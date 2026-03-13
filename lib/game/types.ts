import { IngredientName } from "./ingredientNames";
import { MachineName, WorkstationName } from "./machineNames";
import { ProductName } from "./productNames";

export type Difficulty = "easy" | "normal" | "hard";

export type Price = {
  [K in Difficulty]: number;
};

type TableKeyMap = {
  products: ProductName;
  ingredients: IngredientName;
  machines: MachineName;
  workstations: WorkstationName;
};

export type ItemName =
  | ProductName
  | IngredientName
  | MachineName
  | WorkstationName;

export type TableType = keyof TableKeyMap;

export type TableData<T extends TableType, V> = [TableKeyMap[T], V][];
