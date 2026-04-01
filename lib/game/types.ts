import { CALCULATION_PERIODS, DIFFICULTY_OPTIONS } from "./../constants";
import { IngredientName } from "./ingredientNames";
import { MachineName, WorkstationName } from "./machineNames";
import { ProductName } from "./productNames";
import { DISPLAY_PRICE_OPTIONS } from "../constants";

export type Difficulty = (typeof DIFFICULTY_OPTIONS)[number];

export type CalculationPeriod = (typeof CALCULATION_PERIODS)[number];

export type StoreDifficulty = Difficulty | null | undefined;

export type Price = {
  [K in Difficulty]: number;
};

export type PriceSource =
  (typeof DISPLAY_PRICE_OPTIONS)["SOURCE"][keyof (typeof DISPLAY_PRICE_OPTIONS)["SOURCE"]];
export type PriceTarget =
  (typeof DISPLAY_PRICE_OPTIONS)["TARGET"][keyof (typeof DISPLAY_PRICE_OPTIONS)["TARGET"]];

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
