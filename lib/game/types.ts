import { useTranslations } from "next-intl";
import { IngredientName } from "./ingredientNames";
import { MachineName, WorkstationName } from "./machineNames";
import { ProductName } from "./productNames";
import { RowData } from "@tanstack/react-table";

type Translator = ReturnType<typeof useTranslations>;

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    t: Translator;
    difficulty: Difficulty | null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: "left" | "center" | "right";
  }
}

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
