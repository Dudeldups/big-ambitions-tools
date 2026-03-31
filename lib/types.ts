import { RowData } from "@tanstack/react-table";
import { Difficulty } from "./game/types";
import { useTranslations } from "next-intl";

export type Translator = ReturnType<typeof useTranslations>;

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
